import { translations } from "../client/src/i18n/translations.js";

const langs = ["en", "hi", "ta", "te", "ml", "kn"];
const pharmacyKeys = [
  "title", "subtitle", "open", "closed", "inStock", "limitedStock", "outOfStock",
  "verifiedStock", "demoData", "closesAt", "opensAt", "viewMap", "getDirections",
  "outOfStockOrderUnavailable", "noPharmacies", "noPharmaciesDesc", "locating",
  "driveTime", "walkTime"
];

let missing = 0;
for (const k of pharmacyKeys) {
  for (const lang of langs) {
    if (!translations[lang] || !translations[lang].pharmacy || !translations[lang].pharmacy[k]) {
      console.log(`Missing key: pharmacy.${k} in language ${lang}`);
      missing++;
    }
  }
}

if (missing === 0) {
  console.log("✅ All pharmacy translation keys are present in all 6 languages!");
} else {
  console.log(`❌ Total missing pharmacy keys: ${missing}`);
}
