const {
  formatBrandName,
  formatGenericName,
  formatManufacturer,
  formatDosageForm,
  formatStrength,
  formatPackSize,
  formatMedicineText
} = require("../client/src/utils/formatters.js");
const { CATEGORY_TRANSLATIONS, getCategoryTranslation } = require("../client/src/i18n/i18n.js");

const testMedicines = [
  {
    brand: "Electral Powder",
    name: "Electral Powder",
    genericName: "Oral Rehydration Salts (WHO Formula)",
    composition: "Oral Rehydration Salts (WHO Formula)",
    category: "ORS & Hydration",
    manufacturer: "FDC Limited",
    dosageForm: "Sachet",
    strength: "21.8g sachet",
    packSize: "Pack of 5 sachets",
    otc: true
  },
  {
    brand: "Eno Fruit Salt Lemon",
    name: "Eno Fruit Salt Lemon",
    genericName: "Anhydrous Citric Acid + Sodium Bicarbonate + Sodium Carbonate",
    composition: "Anhydrous Citric Acid + Sodium Bicarbonate + Sodium Carbonate",
    category: "Antacid",
    manufacturer: "GSK",
    dosageForm: "Sachet",
    strength: "5g sachet",
    packSize: "Box of 30 sachets",
    otc: true
  },
  {
    brand: "Eno Fruit Salt Regular",
    name: "Eno Fruit Salt Regular",
    genericName: "Anhydrous Citric Acid + Sodium Bicarbonate + Sodium Carbonate",
    composition: "Anhydrous Citric Acid + Sodium Bicarbonate + Sodium Carbonate",
    category: "Antacid",
    manufacturer: "GSK",
    dosageForm: "Sachet",
    strength: "5g sachet",
    packSize: "Box of 30 sachets",
    otc: true
  },
  {
    brand: "Evion 400",
    name: "Evion 400",
    genericName: "Vitamin E (Tocopheryl Acetate)",
    composition: "Vitamin E (Tocopheryl Acetate)",
    category: "Vitamins & Supplements",
    manufacturer: "Merck / P&G",
    dosageForm: "Capsule",
    strength: "400mg",
    packSize: "Strip of 10 capsules",
    otc: true
  },
  {
    brand: "Foracort 200 Inhaler",
    name: "Foracort 200 Inhaler",
    genericName: "Formoterol + Budesonide",
    composition: "Formoterol + Budesonide",
    category: "Respiratory & Asthma",
    manufacturer: "Cipla",
    dosageForm: "Inhaler",
    strength: "200mcg",
    packSize: "1 Inhaler of 120 doses",
    otc: false
  },
  {
    brand: "Glycomet-SR 500",
    name: "Glycomet-SR 500",
    genericName: "Metformin Hydrochloride",
    composition: "Metformin Hydrochloride",
    category: "Diabetes",
    manufacturer: "USV",
    dosageForm: "Tablet",
    strength: "500mg SR",
    packSize: "Strip of 15 tablets",
    otc: false
  },
  {
    brand: "Moov Pain Relief Cream",
    name: "Moov Pain Relief Cream",
    genericName: "Ayurvedic Pain Relief Formula",
    composition: "Turpentine Oil + Nilgiri Oil + Wintergreen Oil",
    category: "Pain Relief",
    manufacturer: "Reckitt Benckiser",
    dosageForm: "Cream",
    strength: "30g",
    packSize: "Tube of 30g",
    otc: true
  },
  {
    brand: "Neurobion Forte",
    name: "Neurobion Forte",
    genericName: "Vitamin B-Complex + Cyanocobalamin",
    composition: "Vitamin B-Complex + Cyanocobalamin",
    category: "Vitamins & Supplements",
    manufacturer: "Procter & Gamble",
    dosageForm: "Tablet",
    strength: "High Potency B-Complex",
    packSize: "Strip of 30 tablets",
    otc: true
  }
];

const langs = ["en", "hi", "ta", "te", "ml", "kn"];

langs.forEach(lang => {
  console.log(`\n=================== LANGUAGE: ${lang} ===================`);
  testMedicines.forEach(m => {
    const brand = formatBrandName(m.brand, lang);
    const generic = formatGenericName(m.genericName || m.composition, lang);
    const category = getCategoryTranslation(lang, m.category);
    const mfg = formatManufacturer(m.manufacturer, lang);
    const form = formatDosageForm(m.dosageForm, lang);
    const strength = formatStrength(m.strength, lang);
    const pack = formatPackSize(m.packSize, lang);

    console.log(`[${m.brand}]`);
    console.log(`  Brand: ${brand}`);
    console.log(`  Category: ${category}`);
    console.log(`  Generic: ${generic}`);
    console.log(`  Manufacturer: ${mfg}`);
    console.log(`  Form: ${form}, Strength: ${strength}, Pack: ${pack}`);
  });
});
