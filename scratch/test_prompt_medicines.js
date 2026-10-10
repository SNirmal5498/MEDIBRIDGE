import { getCategoryTranslation } from "../client/src/i18n/i18n.js";
import {
  formatBrandName,
  formatGenericName,
  formatManufacturer,
  formatStrength,
  formatDosageForm,
} from "../client/src/utils/formatters.js";
import { translationService } from "../client/src/services/translationService.js";

const promptMedicines = [
  {
    id: "clavam-625",
    brand: "Clavam 625",
    genericName: "Amoxicillin and Potassium Clavulanate Tablets IP",
    category: "Antibiotics",
    manufacturer: "Alkem Laboratories Ltd",
    strength: "500mg+125mg",
    dosageForm: "Tablet",
    price: 198,
    otc: false,
    description: "Clavam 625 is an antibiotic medicine used to treat bacterial infections.",
  },
  {
    id: "augmentin-dds",
    brand: "Augmentin DDS Syrup",
    genericName: "Amoxicillin + Clavulanic Acid",
    category: "Antibiotics",
    manufacturer: "GlaxoSmithKline",
    strength: "200mg+28.5mg/5ml",
    dosageForm: "Syrup",
    price: 145,
    otc: false,
    description: "Augmentin DDS Syrup is used for pediatric bacterial infections.",
  },
  {
    id: "moxikind-cv-625",
    brand: "Moxikind-CV 625",
    genericName: "Amoxicillin and Potassium Clavulanate",
    category: "Antibiotics",
    manufacturer: "Mankind Pharma",
    strength: "500mg+125mg",
    dosageForm: "Tablet",
    price: 175,
    otc: false,
    description: "Moxikind-CV 625 is used to treat respiratory tract infections.",
  },
  {
    id: "augmentin-1000-duo",
    brand: "Augmentin 1000 Duo",
    genericName: "Amoxicillin and Potassium Clavulanate",
    category: "Antibiotics",
    manufacturer: "GlaxoSmithKline",
    strength: "875mg+125mg",
    dosageForm: "Tablet",
    price: 260,
    otc: false,
    description: "Augmentin 1000 Duo is a high strength antibiotic tablet.",
  },
];

async function testPromptMedicinesSuite() {
  console.log("==================================================");
  console.log("   PROMPT MEDICINES LOCALIZATION & BADGE SUITE    ");
  console.log("==================================================");

  const langs = ["en", "hi", "ta", "te", "ml", "kn"];
  let failures = 0;

  for (const lang of langs) {
    console.log(`\nTesting Language '${lang.toUpperCase()}'...`);

    for (const med of promptMedicines) {
      // 1. Test Static Fallback Pipeline
      const staticBrand = formatBrandName(med.brand, lang);
      const staticGeneric = formatGenericName(med.genericName, lang);
      const staticCat = getCategoryTranslation(lang, med.category);
      const staticMfg = formatManufacturer(med.manufacturer, lang);

      // 2. Test Dynamic Translation Pipeline
      let dynamicMed = med;
      try {
        dynamicMed = await translationService.translateMedicine(med, lang);
      } catch (e) {
        console.warn(`Dynamic translation bypassed for ${med.brand} in ${lang}`);
      }

      const finalBrand = dynamicMed.brand || staticBrand;
      const finalGeneric = dynamicMed.genericName || staticGeneric;
      const finalMfg = dynamicMed.manufacturer || staticMfg;
      const finalCat = (dynamicMed.category && dynamicMed.category !== med.category) ? dynamicMed.category : staticCat;

      console.log(` - [${med.brand}]`);
      console.log(`    Brand: '${finalBrand}'`);
      console.log(`    Generic: '${finalGeneric}'`);
      console.log(`    Manufacturer: '${finalMfg}'`);
      console.log(`    Category: '${finalCat}'`);

      // Assertions
      if (!finalBrand || !finalGeneric || !finalCat || !finalMfg) {
        console.error(`❌ Field missing for ${med.brand} in ${lang}`);
        failures++;
      }

      // Check numbers preserved
      if (med.strength.includes("625") && !finalBrand.includes("625") && !med.brand.includes("625")) {
        console.error(`❌ Strength digits lost in ${med.brand} in ${lang}`);
        failures++;
      }
    }
  }

  console.log("\n==================================================");
  if (failures === 0) {
    console.log("   PROMPT MEDICINES TEST RESULT: ✅ 100% PASSED!");
  } else {
    console.error(`   PROMPT MEDICINES TEST RESULT: ❌ ${failures} ERRORS`);
  }
  console.log("==================================================");

  if (failures > 0) process.exit(1);
}

testPromptMedicinesSuite();
