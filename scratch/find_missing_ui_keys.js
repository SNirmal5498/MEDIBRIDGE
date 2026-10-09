const path = require("path");
const fs = require("fs");

// Read translations.js
const translationsFile = fs.readFileSync(path.join(__dirname, "../client/src/i18n/translations.js"), "utf8");

// Convert ES module export to CommonJS module.exports for Node analysis
let code = translationsFile.replace(/import \{ formatMedicineText \} from "[^"]+";/, "const formatMedicineText = (s) => s;");
code = code.replace("export const translations =", "const translations =");
code = code.replace("export function translate", "function translate");
code += "\nmodule.exports = { translations, translate };";

const tempFile = path.join(__dirname, "temp_trans_eval.js");
fs.writeFileSync(tempFile, code);

const { translations } = require(tempFile);
fs.unlinkSync(tempFile);

const enKeys = new Set(Object.keys(translations.en || {}));

// Recursively find all JSX files in client/src
function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith(".jsx") || name.endsWith(".js")) {
      files.push(name);
    }
  }
  return files;
}

const allSrcFiles = getFiles(path.join(__dirname, "../client/src"));
const usedKeys = new Set();

// Match t("key") or t('key')
const tKeyRegex = /t\s*\(\s*["']([^"']+)["']/g;

for (const filePath of allSrcFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  let match;
  while ((match = tKeyRegex.exec(content)) !== null) {
    const key = match[1];
    // Ignore parameter interpolation or dynamic variable keys
    if (!key.includes("${") && !key.includes("+") && key.includes(".")) {
      usedKeys.add(key);
    }
  }
}

console.log("==================================================");
console.log("  MISSING TRANSLATION KEYS SCANNER ");
console.log("==================================================");
console.log("Total unique t() keys found in JSX components:", usedKeys.size);

const missingFromEn = [];
for (const key of usedKeys) {
  if (!enKeys.has(key)) {
    missingFromEn.push(key);
  }
}

console.log(`Missing keys in translations.js (en): ${missingFromEn.length}`);
if (missingFromEn.length > 0) {
  console.log("Missing keys list:");
  missingFromEn.forEach((k) => console.log(" -", k));
} else {
  console.log("✅ All t() keys used in JSX exist in translations.js!");
}
