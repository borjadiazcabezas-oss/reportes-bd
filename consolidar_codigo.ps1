# SCRIPT DE CONSOLIDACIÓN DE CÓDIGO (consolidar_codigo.ps1)
# Este script lee los archivos críticos y los guarda en un solo .txt

# 1. Definición de la ruta base del proyecto (donde está package.json y server.js)
$baseDir = "C:\Users\CALIDAD2\Documents\Proyectos\reportes base de datos\dashboard\remoto"
$outputFile = "proyecto_completo_consolidado_GENERADO.txt"
$outputPath = Join-Path $baseDir $outputFile

# 2. Lista de archivos críticos a incluir (relativos a $baseDir)
$filesToInclude = @(
    "package.json",
    "server.js",
    "backend/seed.js",
    "backend/models/empleado.model.js",
    "backend/models/usuario.model.js",
    "backend/models/modelo.model.js"
    # Puedes añadir más rutas aquí si fuera necesario
)

# 3. Limpiar archivo de salida si ya existe
Remove-Item $outputPath -ErrorAction SilentlyContinue

# 4. Procesar cada archivo
foreach ($relativePath in $filesToInclude) {
    $fullPath = Join-Path $baseDir $relativePath

    # Escribir separador y nombre del archivo al TXT
    Add-Content -Path $outputPath -Value "`n=========================================================================="
    Add-Content -Path $outputPath -Value "📄 ARCHIVO: $relativePath"
    Add-Content -Path $outputPath -Value "=========================================================================="

    # Leer y añadir el contenido o notificar si falta
    if (Test-Path $fullPath) {
        Get-Content -Path $fullPath | Add-Content -Path $outputPath
    } else {
        Add-Content -Path $outputPath -Value "❌ ERROR: Archivo no encontrado. Esto puede causar errores de importación."
    }
}

# Líneas corregidas para asegurar la terminación correcta del string:
Write-Host "`n✅ ¡CONSOLIDACIÓN FINALIZADA!" -ForegroundColor Green
Write-Host "El archivo '$outputFile' ha sido creado en la carpeta 'remoto/'" -ForegroundColor Green