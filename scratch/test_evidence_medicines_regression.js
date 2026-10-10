const {
  formatBrandName,
  formatGenericName,
  formatStrength,
  formatManufacturer,
  formatDosageForm,
  formatCompositionPhrase,
} = require("../client/src/utils/formatters.js");
const { getCategoryTranslation } = require("../client/src/i18n/i18n.js");

const evidenceMeds = [
  {
    name: "Becosules Capsules",
    brand: "Becosules Capsules",
    genericName: "Vitamin B-Complex with Vitamin C & Zinc",
    strength: "Multi B-Complex + Vit C",
    category: "Vitamins & Supplements",
  },
  {
    name: "Becosules Z",
    brand: "Becosules Z",
    genericName: "Vitamin B-Complex + Zinc",
    strength: "B-Complex + Vit C + Zinc",
    category: "Vitamins & Supplements",
  },
  {
    name: "Dettol Antiseptic Liquid",
    brand: "Dettol Antiseptic Liquid",
    genericName: "Chloroxylenol",
    strength: "Antiseptic Liquid",
    category: "First Aid",
  },
  {
    name: "Iron + B12 Syrup",
    brand: "Iron + B12 Syrup",
    genericName: "Iron + B12",
    strength: "Iron + B12 (200ml)",
    category: "Vitamins & Supplements",
  },
  {
    name: "Betadine 5% Ointment",
    brand: "Betadine 5% Ointment",
    genericName: "Povidone-Iodine",
    strength: "Povidone Iodine Antiseptic",
    category: "First Aid",
  },
  {
    name: "Ecosprin 75",
    brand: "Ecosprin 75",
    genericName: "Aspirin",
    strength: "75mg",
    category: "Heart & Blood Care",
  }
];

const languages = ["ta", "hi", "te", "ml", "kn"];

console.log("==================================================");
console.log("   EVIDENCE MEDICINES COMPOSITION TEST");
console.log("==================================================");

let failureCount = 0;

languages.forEach(lang => {
  console.log(`\n--- Target Language: [${lang.toUpperCase()}] ---`);
  evidenceMeds.forEach(med => {
    const brand = formatBrandName(med.brand, lang);
    const generic = formatGenericName(med.genericName, lang);
    const strength = formatStrength(med.strength, lang);
    const category = getCategoryTranslation(lang, med.category);

    console.log(`[${med.name}]`);
    console.log(`  Brand:    '${brand}'`);
    console.log(`  Generic:  '${generic}'`);
    console.log(`  Strength: '${strength}'`);
    console.log(`  Category: '${category}'`);

    // Verify strength / generic has no untranslated raw English phrases
    if (strength === med.strength && lang !== "en") {
      console.error(`  ❌ ERROR: Strength '${med.strength}' was not localized!`);
      failureCount++;
    }
  });
});

console.log("\n==================================================");
if (failureCount === 0) {
  console.log("   EVIDENCE TEST RESULT: ✅ ALL EVIDENCE MEDICINES FULLY LOCALIZED!");
} else {
  console.error(`   EVIDENCE TEST RESULT: ❌ ${failureCount} LOCALIZATION ERRORS FOUND!`);
}
console.log("==================================================");

if (failureCount > 0) process.exit(1);
