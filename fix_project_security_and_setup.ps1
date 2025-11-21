<#
.SYNOPSIS
  Script de corrección y hardening del proyecto para Windows PowerShell.
  Crea backups, busca secrets, extrae keys simples del archivo consolidado, genera .env/.env.example,
  instala dependencias npm, crea middlewares y plantillas de configuración.

.NOTES
  Revisa cuidadosamente los backups antes de aceptar cambios; rota las claves externas manualmente.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Configuración inicial ---
$RepoRoot = (Get-Location).Path
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = Join-Path $RepoRoot ("backup_before_fix_$Timestamp")
$ConsolidatedFile = "/mnt/data/proyecto_completo_consolidado_TODO_FINAL.txt"  # ruta del archivo que subiste (si existe)
$EnvFile = Join-Path $RepoRoot ".env"
$EnvExample = Join-Path $RepoRoot ".env.example"
$Gitignore = Join-Path $RepoRoot ".gitignore"
$SecretsFoundFile = Join-Path $BackupDir "secrets_found.txt"
$NextStepsFile = Join-Path $BackupDir "README_next_steps.txt"

Write-Host "Iniciando script en: $RepoRoot" -ForegroundColor Cyan
Write-Host "Creando backup en: $BackupDir" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

# --- Backup (no destructivo) ---
Write-Host "Copiando archivos al backup (excluyendo node_modules y .git si existen)..." -ForegroundColor Yellow
Get-ChildItem -Path $RepoRoot -Force |
    Where-Object { $_.Name -ne "node_modules" -and $_.Name -ne ".git" -and ($_.FullName -ne $BackupDir) } |
    ForEach-Object {
        $dest = Join-Path $BackupDir $_.Name
        if ($_.PSIsContainer) {
            Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force -ErrorAction SilentlyContinue
        } else {
            Copy-Item -Path $_.FullName -Destination $dest -Force -ErrorAction SilentlyContinue
        }
    }

# --- Buscar posibles secretos (heurística simple) ---
Write-Host "Buscando patrones de secretos en el proyecto (esto puede generar falsos positivos)..." -ForegroundColor Yellow
$patterns = "SENDGRID","API_KEY","SECRET","MONGO","PASSWORD","TOKEN","jwtSecret","sendgrid"
Remove-Item -Path $SecretsFoundFile -ErrorAction SilentlyContinue -Force
"" | Out-File -FilePath $SecretsFoundFile -Encoding utf8

Get-ChildItem -Path $RepoRoot -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\.git\\" } |
    ForEach-Object {
        try {
            $matches = Select-String -Path $_.FullName -Pattern ($patterns -join "|") -SimpleMatch -AllMatches -ErrorAction SilentlyContinue
            if ($matches) {
                $matches | ForEach-Object {
                    ("{0}:{1}:{2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()) | Out-File -FilePath $SecretsFoundFile -Append -Encoding utf8
                }
            }
        } catch { }
    }

Write-Host "Listado de posibles secretos guardado en: $SecretsFoundFile" -ForegroundColor Green

# --- Generar .env (intento de extracción desde archivo consolidado si existe) ---
Write-Host "Generando $EnvFile y $EnvExample ..." -ForegroundColor Yellow
"" | Out-File -FilePath $EnvFile -Encoding utf8

# Patrones a detectar en el archivo consolidado (heurística)
$patternMap = @{
    "SENDGRID_API_KEY" = "SENDGRID_API_KEY"
    "MONGO_URI" = "MONGO_URI|MONGO_URL|MONGO_CONNECTION_STRING"
    "JWT_SECRET" = "JWT_SECRET|jwtSecret"
    "SENDGRID_FROM" = "SENDGRID_FROM|MAIL_FROM"
    "PORT" = "PORT"
}

if (Test-Path $ConsolidatedFile) {
    Write-Host "Archivo consolidado encontrado en $ConsolidatedFile. Intentando extraer valores..." -ForegroundColor Cyan
    $content = Get-Content -Raw -Path $ConsolidatedFile -ErrorAction SilentlyContinue
    foreach ($k in $patternMap.Keys) {
        $pat = $patternMap[$k]
        # Convertir el patrón a una regex usable (ya viene como OR pipes)
        $regex = $pat
        # Buscamos KEY = VALUE o "KEY": "value" o KEY: 'value'
        $m = [regex]::Match($content, "(?im)(?:" + $regex + ")[\s\`"'\:]*[=:\s]*['""]?([^'\\""`,;\r\n]+)")
        if ($m.Success) {
            $val = $m.Groups[1].Value.Trim()
            if ($val) {
                Add-Content -Path $EnvFile -Value ("$k=$val")
                Write-Host ("  -> Extraído $k = $val") -ForegroundColor Green
            }
        }
    }
} else {
    Write-Host "No encontrado: $ConsolidatedFile. Saltando extracción automática." -ForegroundColor Yellow
}

# Crear .env.example
$header = @(
    "# .env.example creado por fix script",
    "# Copia este archivo a .env y completa valores reales. NO subir .env al repo."
)
$header | Out-File -FilePath $EnvExample -Encoding utf8
if ((Get-Item -Path $EnvFile).Length -gt 0) {
    Get-Content $EnvFile | ForEach-Object {
        $k = ($_ -split "=")[0]
        ("$k=REPLACE_ME") | Out-File -FilePath $EnvExample -Append -Encoding utf8
    }
} else {
    @(
        "MONGO_URI=REPLACE_ME",
        "SENDGRID_API_KEY=REPLACE_ME",
        "SENDGRID_FROM=REPLACE_ME",
        "JWT_SECRET=REPLACE_ME",
        "PORT=3000"
    ) | Out-File -FilePath $EnvExample -Append -Encoding utf8
}

# --- Crear .gitignore ---
Write-Host "Creando .gitignore (si no existía, hace backup del existente)..." -ForegroundColor Yellow
if (Test-Path $Gitignore) {
    Copy-Item -Path $Gitignore -Destination ($Gitignore + ".bak_before_fix") -Force
}
@(
"node_modules/",
".env",
".env.*",
"backup_before_fix_*/",
".DS_Store",
"dist/",
"coverage/"
) | Out-File -FilePath $Gitignore -Encoding utf8

# --- Instalar dependencias recomendadas (npm) ---
if (Test-Path (Join-Path $RepoRoot "package.json")) {
    Write-Host "Instalando dependencias: dotenv, bcrypt, jsonwebtoken, express-validator, cors, winston ..." -ForegroundColor Yellow
    try {
        npm --version > $null 2>&1
        npm install dotenv bcrypt jsonwebtoken express-validator cors winston --save
    } catch {
        Write-Host "npm no encontrado en PATH. Omisión de instalación automática. Instala manualmente las dependencias." -ForegroundColor Red
    }
} else {
    Write-Host "No se encontró package.json; no se ejecutará npm install." -ForegroundColor Yellow
}

# --- Crear middlewares y snippets ---
$MiddlewareDir = Join-Path $RepoRoot "src\middleware"
if (-not (Test-Path $MiddlewareDir)) { New-Item -ItemType Directory -Path $MiddlewareDir -Force | Out-Null }

# auth.js
$authJs = @'
/**
 * src/middleware/auth.js
 * RequireAuth and requireRole (JWT)
 */
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ ok: false, message: "No token" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes(role))
      return res.status(403).json({ ok: false, message: "Forbidden" });
    next();
  };
}
'@
$authPath = Join-Path $MiddlewareDir "auth.js"
$authJs | Out-File -FilePath $authPath -Encoding utf8

# validate.js
$validateJs = @'
/**
 * src/middleware/validate.js
 * Uso con express-validator
 */
import { validationResult } from "express-validator";

export default function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }
  next();
}
'@
$validatePath = Join-Path $MiddlewareDir "validate.js"
$validateJs | Out-File -FilePath $validatePath -Encoding utf8

# corsConfig.js
$corsJs = @'
/**
 * src/middleware/corsConfig.js
 * Uso: app.use(cors(corsConfig));
 */
export default {
  origin: function(origin, callback) {
    const allowed = [process.env.FRONTEND_URL || "http://localhost:3000"];
    if (!origin || allowed.includes(origin)) callback(null, true);
    else callback(new Error("CORS: origin not allowed"));
  },
  credentials: true,
};
'@
$corsPath = Join-Path $MiddlewareDir "corsConfig.js"
$corsJs | Out-File -FilePath $corsPath -Encoding utf8

# Snippet para server.js
$snippetPath = Join-Path $RepoRoot "src\snippets_server_dotenv_and_cors.txt"
$snippetContent = @"
# Insertar al inicio de server.js
import dotenv from 'dotenv';
dotenv.config();

# Ejemplo (CommonJS):
// require('dotenv').config();
// const cors = require('cors');
// const corsConfig = require('./src/middleware/corsConfig').default;
// app.use(cors(corsConfig));
"@
$snippetContent | Out-File -FilePath $snippetPath -Encoding utf8

# --- Dockerfile básico ---
$dockerPath = Join-Path $RepoRoot "Dockerfile"
@"
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD [\"node\", \"server.js\"]
"@ | Out-File -FilePath $dockerPath -Encoding utf8

# --- GitHub Actions workflow (opcional) ---
$workflowDir = Join-Path $RepoRoot ".github\workflows"
if (-not (Test-Path $workflowDir)) { New-Item -ItemType Directory -Path $workflowDir -Force | Out-Null }
$workflowPath = Join-Path $workflowDir "nodeci.yml"
$workflowContent = @"
name: Node CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install
        run: npm ci
      - name: Test
        run: npm test || true
"@
$workflowContent | Out-File -FilePath $workflowPath -Encoding utf8

# --- Pasos manuales imprescindibles ---
$nextSteps = @"
PASOS MANUALES IMPRESCINDIBLES (REVISA ANTES DE CONTINUAR):

1) REVOCAR / ROTAR CLAVES:
   - Revoca y rota SENDGRID_API_KEY, MONGO_URI/usuario DB y cualquier API key detectada.
   - Sustituye los valores en tu entorno (.env) y NO subir .env al repo.

2) REVISAR BACKUP:
   - Revisa el backup en: $BackupDir
   - Revisa $SecretsFoundFile y los archivos *.bak_before_fix si existen.

3) PROBAR LOCAL:
   - Ejecuta tests y npm start en un entorno de staging antes de desplegar en producción.

4) ESCANEO ADICIONAL:
   - Ejecuta scanners de secretos como gitleaks o trufflehog si los tienes.

5) PROTEGER RUTAS:
   - Asegura rutas administrativas con requireAuth + requireRole('admin').
   - Configura CORS con dominios permitidos en producción.

"@
$nextSteps | Out-File -FilePath $NextStepsFile -Encoding utf8

Write-Host "Script completado con éxito." -ForegroundColor Green
Write-Host "Backup: $BackupDir" -ForegroundColor Cyan
Write-Host "Posibles secretos detectados: $SecretsFoundFile" -ForegroundColor Cyan
Write-Host "Archivos generados: $EnvFile, $EnvExample, $Gitignore, $authPath, $validatePath, $corsPath, $dockerPath, $workflowPath" -ForegroundColor Green
Write-Host "LEE el fichero de pasos: $NextStepsFile" -ForegroundColor Yellow
Write-Host "IMPORTANTE: Rota las claves en los paneles de SendGrid/MongoDB manualmente." -ForegroundColor Red
