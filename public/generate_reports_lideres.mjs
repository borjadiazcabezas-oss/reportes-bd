import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

// Plantilla base de líderes
const baseTemplateLider = path.join(basePath, "reporte_base_lideres.html");

if (!fs.existsSync(baseTemplateLider)) {
  console.error("❌ No se encuentra la plantilla base de líderes");
  process.exit(1);
}

// Definimos los líderes
const lideres = [
  { name: "Antonio Montes", code: "120", file: "reporte_antonio_120.html", userId: "user_120" },
  { name: "Jonatan Escarraman", code: "178", file: "reporte_jonatan_178.html", userId: "user_178" },
  { name: "Francisco Garcia", code: "229", file: "reporte_franciscog_229.html", userId: "user_229" }
];

// Generamos los archivos individuales
lideres.forEach((lider) => {
  let content = fs.readFileSync(baseTemplateLider, "utf8");

  // Reemplazamos el nombre y código
  content = content.replace('<span id="operator-name"></span>', `<span id="operator-name">${lider.name} (${lider.code})</span>`);
  content = content.replace(/const\s+OPERATOR_NAME\s*=\s*["'`][\s\S]*?["'`]\s*;/, `const OPERATOR_NAME = "${lider.name}";`);
  content = content.replace(/const\s+OPERATOR_CODE\s*=\s*["'`][\s\S]*?["'`]\s*;/, `const OPERATOR_CODE = "${lider.code}";`);
  content = content.replace(/let userId = crypto.randomUUID\(\)/, `let userId = "${lider.userId}"`);

  fs.writeFileSync(path.join(basePath, lider.file), content, "utf8");
  console.log(`✔ Generado: ${lider.file}`);
});

console.log("✅ Todos los reportes de líderes han sido generados correctamente");
