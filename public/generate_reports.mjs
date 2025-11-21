import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

const baseTemplateOperario = path.join(basePath, "reporte_base_operario.html");

if (!fs.existsSync(baseTemplateOperario)) {
  console.error("❌ No se encuentra la plantilla base operario");
  process.exit(1);
}

const operarios = [
  { name: "Eloy Quiñones", code: "40", file: "reporte_eloy_40.html", userId: "user_40" },
  { name: "Antonio Montes", code: "120", file: "reporte_antonio_120.html", userId: "user_120" },
  { name: "Carlos Javier Rivera", code: "158", file: "reporte_carlos_158.html", userId: "user_158" },
  { name: "Humberto Mariscal", code: "177", file: "reporte_humberto_177.html", userId: "user_177" },
  { name: "Jonatan Escarraman", code: "178", file: "reporte_jonatan_178.html", userId: "user_178" },
  { name: "Jose Gregorio Sarti", code: "196", file: "reporte_joseg_196.html", userId: "user_196" },
  { name: "Francisco Quiñones", code: "199", file: "reporte_franciscoq_199.html", userId: "user_199" },
  { name: "Juan Jose Sarti", code: "203", file: "reporte_juanjose_203.html", userId: "user_203" },
  { name: "Juan Carlos Ugueto", code: "204", file: "reporte_juancarlos_204.html", userId: "user_204" },
  { name: "Francisco Garcia", code: "229", file: "reporte_franciscog_229.html", userId: "user_229" },
  { name: "Francisco Romero", code: "239", file: "reporte_franciscor_239.html", userId: "user_239" },
  { name: "Antonio Ramos", code: "243", file: "reporte_antonior_243.html", userId: "user_243" },
  { name: "Juan Manuel Baez", code: "244", file: "reporte_juanmanuel_244.html", userId: "user_244" },
  { name: "Josue Cortes", code: "246", file: "reporte_josue_246.html", userId: "user_246" },
  { name: "Angel Luis Torres", code: "250", file: "reporte_angel_250.html", userId: "user_250" },
  { name: "Francisco Javier Herrera", code: "251", file: "reporte_franciscoj_251.html", userId: "user_251" },
  { name: "José Pérez", code: "252", file: "reporte_josep_252.html", userId: "user_252" }
];

operarios.forEach((operario) => {
  let content = fs.readFileSync(baseTemplateOperario, "utf8");

  content = content.replace('<span id="operator-name"></span>', `<span id="operator-name">${operario.name} (${operario.code})</span>`);
  content = content.replace(/const\s+OPERATOR_NAME\s*=\s*["'`][\s\S]*?["'`]\s*;/, `const OPERATOR_NAME = "${operario.name}";`);
  content = content.replace(/const\s+OPERATOR_CODE\s*=\s*["'`][\s\S]*?["'`]\s*;/, `const OPERATOR_CODE = "${operario.code}";`);
  content = content.replace('let userId = crypto.randomUUID()', `let userId = "${operario.userId}"`);

  fs.writeFileSync(path.join(basePath, operario.file), content, "utf8");
  console.log(`✔ Generado: ${operario.file}`);
});

console.log("✅ Proceso completado");
