import path from "path";
import { fileURLToPath } from "url";
import { getCategoryTranslation } from "../client/src/i18n/i18n.js";
import {
  formatBrandName,
  formatGenericName,
  formatManufacturer,
  formatStrength,
} from "../client/src/utils/formatters.js";

const testMedicines = [
  {
    id: "test-electral",
    name: "Electral Powder",
    brand: "Electral Powder",
    genericName: "Oral Rehydration Salts (WHO Formula)",
    category: "ORS & Hydration",
    manufacturer: "FDC Limited",
    strength: "21.8g sachet",
    price: 110,
    otc: true,
  },
  {
    id: "test-eno-lemon",
    name: "Eno Fruit Salt Lemon",
    brand: "Eno Fruit Salt Lemon",
    genericName: "Magaldrate + Simethicone",
    category: "Antacid",
    manufacturer: "GSK",
    strength: "5g sachet",
    price: 180,
    otc: true,
  },
  {
    id: "test-eno-regular",
    name: "Eno Fruit Salt Regular",
    brand: "Eno Fruit Salt Regular",
    genericName: "Magaldrate + Simethicone",
    category: "Antacid",
    manufacturer: "GSK",
    strength: "5g sachet",
    price: 180,
    otc: true,
  },
  {
    id: "test-evion",
    name: "Evion 400",
    brand: "Evion 400",
    genericName: "Vitamin E (Tocopheryl Acetate)",
    category: "Vitamins & Supplements",
    manufacturer: "Merck / P&G Health",
    strength: "400mg",
    price: 38,
    otc: true,
  },
  {
    id: "test-foracort",
    name: "Foracort 200 Inhaler",
    brand: "Foracort 200 Inhaler",
    genericName: "Formoterol + Budesonide",
    category: "Respiratory & Inhalers",
    manufacturer: "Cipla",
    strength: "200mcg",
    price: 350,
    otc: false,
  },
  {
    id: "test-glycomet",
    name: "Glycomet-SR 500",
    brand: "Glycomet-SR 500",
    genericName: "Metformin Hydrochloride",
    category: "Diabetes Care",
    manufacturer: "USV Private Limited",
    strength: "500mg",
    price: 42,
    otc: false,
  },
  {
    id: "test-moov",
    name: "Moov Pain Relief Cream",
    brand: "Moov Pain Relief Cream",
    genericName: "Turpentine Oil + Nilgiri Oil + Wintergreen Oil",
    category: "Pain Relief",
    manufacturer: "Reckitt Benckiser",
    strength: "50g tube",
    price: 155,
    otc: true,
  },
  {
    id: "test-neurobion",
    name: "Neurobion Forte",
    brand: "Neurobion Forte",
    genericName: "Vitamin B-Complex + Cyanocobalamin",
    category: "Vitamins & Supplements",
    manufacturer: "P&G Health",
    strength: "Standard",
    price: 34,
    otc: true,
  },
  {
    id: "test-1",
    name: "Becosules Capsules",
    brand: "Becosules",
    genericName: "Vitamin B-Complex with Vitamin C & Zinc",
    category: "Vitamins & Supplements",
    manufacturer: "Pfizer",
    strength: "Standard Strength",
    price: 45,
    otc: true,
  },
  {
    id: "test-2",
    name: "Becosules Z",
    brand: "Becosules Z",
    genericName: "Vitamin B-Complex + Zinc",
    category: "Vitamins & Minerals",
    manufacturer: "Pfizer",
    strength: "Standard Strength",
    price: 52,
    otc: true,
  },
  {
    id: "test-3",
    name: "Betadine 5% Ointment",
    brand: "Betadine",
    genericName: "Povidone-Iodine",
    category: "First Aid & Antiseptics",
    manufacturer: "Win-Medicare",
    strength: "5% w/w",
    price: 115,
    otc: true,
  },
  {
    id: "test-4",
    name: "க்ரோசின் 500", // Already Tamil brand
    brand: "க்ரோசின் 500",
    genericName: "Paracetamol",
    category: "Pain Relief",
    manufacturer: "GSK",
    strength: "500mg",
    price: 20,
    otc: true,
  },
  {
    id: "test-5",
    name: "Azithral 500 Tablet",
    brand: "Azithral",
    genericName: "Azithromycin",
    category: "Antibiotics",
    manufacturer: "Alembic",
    strength: "500mg",
    price: 120,
    otc: false,
  },
  {
    id: "test-6",
    name: "Mixed Case Category Test",
    brand: "Crocin",
    genericName: "Paracetamol",
    category: "first aid & antiseptics", // Different capitalization & spacing
    manufacturer: "GSK",
    strength: "500mg",
    price: 18,
    otc: true,
  },
  {
    id: "test-7",
    name: "Missing Optional Fields Test",
    brand: "Dolo",
    genericName: "Paracetamol",
    category: "Fever",
    price: 30,
    otc: true,
  },
];

async function runRegressionSuite() {
  console.log("==================================================");
  console.log("  SECTION 6: MEDICINE CARD REGRESSION TEST SUITE  ");
  console.log("==================================================");

  const langs = ["en", "hi", "ta", "te", "ml", "kn"];
  let totalFailures = 0;

  for (const lang of langs) {
    console.log(`\nTesting Language '${lang.toUpperCase()}'...`);

    for (const med of testMedicines) {
      const brandLoc = formatBrandName(med.brand, lang);
      const genericLoc = formatGenericName(med.genericName, lang);
      const categoryLoc = getCategoryTranslation(lang, med.category);
      const mfgLoc = med.manufacturer ? formatManufacturer(med.manufacturer, lang) : "";
      const strengthLoc = formatStrength(med.strength, lang);

      console.log(` - [${med.id}] Brand: '${brandLoc}' | Generic: '${genericLoc}' | Category: '${categoryLoc}'`);

      // Assertions
      if (!brandLoc) {
        console.error(`❌ Missing brand localization for '${med.id}' in ${lang}`);
        totalFailures++;
      }

      if (!genericLoc) {
        console.error(`❌ Missing generic localization for '${med.id}' in ${lang}`);
        totalFailures++;
      }

      if (lang !== "en" && categoryLoc === med.category && !categoryLoc.includes(" & ")) {
        console.error(`❌ Category '${med.category}' remained untranslated in ${lang}!`);
        totalFailures++;
      }
    }
  }

  console.log("\n==================================================");
  if (totalFailures === 0) {
    console.log("  MEDICINE CARD REGRESSION TEST: ✅ ALL 100% PASSED");
  } else {
    console.error(`  MEDICINE CARD REGRESSION TEST: ❌ FAILED WITH ${totalFailures} ERRORS`);
  }
  console.log("==================================================");

  if (totalFailures > 0) {
    process.exit(1);
  }
}

runRegressionSuite();
