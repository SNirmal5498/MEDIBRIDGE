const path = require("path");
const fs = require("fs");

const translationsFilePath = path.join(__dirname, "../client/src/i18n/translations.js");
let code = fs.readFileSync(translationsFilePath, "utf8");

// Convert ES module export to CommonJS module.exports for Node testing
code = code.replace(/import \{ formatMedicineText \} from "[^"]+";/, "const formatMedicineText = (s) => s;");
code = code.replace("export const translations =", "const translations =");
code = code.replace("export function translate", "function translate");
code += "\nmodule.exports = { translations, translate };";

const tempFile = path.join(__dirname, "temp_translations.js");
fs.writeFileSync(tempFile, code);

const { translations } = require(tempFile);

console.log("==================================================");
console.log("  PART C: MULTILINGUAL STATIC KEY AUDIT (JS EVAL) ");
console.log("==================================================");

const langs = ["en", "hi", "ta", "te", "ml", "kn"];
const enKeys = Object.keys(translations.en || {});

console.log("English (en) total keys:", enKeys.length);

let totalMissing = 0;
for (const lang of langs) {
  const langKeys = Object.keys(translations[lang] || {});
  console.log(`${lang.toUpperCase()} total keys:`, langKeys.length);
  const missing = enKeys.filter((k) => !translations[lang]?.[k]);
  if (missing.length > 0) {
    console.log(`⚠️ ${lang.toUpperCase()} missing ${missing.length} keys.`);
    totalMissing += missing.length;
  } else {
    console.log(`✅ ${lang.toUpperCase()} has 100% key parity with EN.`);
  }
}

// Clean up temp file
fs.unlinkSync(tempFile);

if (totalMissing === 0) {
  console.log("\n==================================================");
  console.log("  TRANSLATION AUDIT RESULT: ✅ ALL 6 LANGS 100% COVERED");
  console.log("==================================================");
} else {
  console.log(`\n⚠️ Total missing keys across all languages: ${totalMissing}`);
}
