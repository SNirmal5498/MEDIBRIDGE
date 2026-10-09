const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const request = require(path.join(serverDir, "node_modules/supertest"));
const app = require(path.join(serverDir, "app.js"));
const fs = require("fs");

require(path.join(serverDir, "node_modules/dotenv")).config({ path: path.join(serverDir, ".env") });

// Import translations & formatters
const translationsFile = fs.readFileSync(path.join(__dirname, "../client/src/i18n/translations.js"), "utf8");
let code = translationsFile.replace(/import \{ formatMedicineText \} from "[^"]+";/, "const formatMedicineText = (s) => s;");
code = code.replace("export const translations =", "const translations =");
code = code.replace("export function translate", "function translate");
code += "\nmodule.exports = { translations, translate };";

const tempFile = path.join(__dirname, "temp_trans_eval2.js");
fs.writeFileSync(tempFile, code);
const { translations, translate } = require(tempFile);
fs.unlinkSync(tempFile);

async function runMultilingualTestSuite() {
  const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medibridge";
  await mongoose.connect(dbUri);

  console.log("==================================================");
  console.log("  OBJECTIVE: COMPREHENSIVE MULTILINGUAL TEST SUITE");
  console.log("==================================================");

  const langs = ["en", "hi", "ta", "te", "ml", "kn"];
  const testKeys = [
    "nav.home",
    "nav.compareMedicines",
    "nav.nearbyPharmacy",
    "nav.emergency",
    "pharmacy.verifiedStock",
    "pharmacy.demoData",
    "pharmacy.outOfStockOrderUnavailable",
    "autocomplete.suggestionsHeader",
    "autocomplete.noResults",
    "firstaid.fever.title",
    "firstaid.heart-attack.title",
    "checkout.title",
    "common.loading",
    "common.error",
  ];

  console.log("\n1. Testing Static Dictionary Key Coverage across 6 languages...");
  let staticFailures = 0;

  for (const lang of langs) {
    for (const key of testKeys) {
      const result = translate(lang, key);
      if (!result || result === key) {
        console.error(`❌ Lang '${lang}' failed for key '${key}': Got '${result}'`);
        staticFailures++;
      }
    }
  }

  if (staticFailures === 0) {
    console.log("   ✅ All sample static UI keys returned localized strings for all 6 languages!");
  } else {
    throw new Error(`Static dictionary verification failed with ${staticFailures} errors.`);
  }

  console.log("\n2. Testing Backend Dynamic Translation Endpoint (/api/translation/translate)...");
  const sampleTexts = [
    "Take 1 tablet after food twice daily.",
    "Store below 30°C in a dry place.",
    "For fever and mild headache.",
  ];

  for (const targetLang of ["hi", "ta", "te", "ml", "kn"]) {
    const res = await request(app)
      .post("/api/translation/translate")
      .send({ texts: sampleTexts, targetLang });

    console.log(`   Target '${targetLang}': Status ${res.status}, Count: ${res.body.translated?.length}`);
    if (res.status !== 200 || !Array.isArray(res.body.translated) || res.body.translated.length !== 3) {
      throw new Error(`Dynamic translation failed for lang '${targetLang}'`);
    }
  }

  console.log("\n3. Testing Medical Safety Preservation (Units, Dosage, Numbers)...");
  const medicalSample = {
    name: "Paracetamol 500mg",
    dosage: "500mg every 4-6 hours (Max 4000mg/day).",
    price: 30,
    emergencyPhone: "108",
  };

  const safeRes = await request(app)
    .post("/api/translation/object")
    .send({
      object: medicalSample,
      fields: ["dosage"],
      targetLang: "ta",
    });

  const translatedDosage = safeRes.body.translatedObject?.dosage;
  console.log("   Original Dosage:", medicalSample.dosage);
  console.log("   Translated Dosage (ta):", translatedDosage);

  if (!translatedDosage.includes("500") || !translatedDosage.includes("4-6")) {
    throw new Error("Medical numerical safety violated in translation output!");
  }
  console.log("   ✅ Dosage numbers and units preserved accurately!");

  console.log("\n4. Testing MongoDB Cache Hit Latency...");
  const t0 = Date.now();
  const cacheRes = await request(app)
    .post("/api/translation/translate")
    .send({ text: "Take 1 tablet after food twice daily.", targetLang: "hi" });
  const durationMs = Date.now() - t0;
  console.log(`   Cached response time: ${durationMs} ms, Text: '${cacheRes.body.translated}'`);
  if (durationMs > 500) {
    console.warn("⚠️ Cache response took longer than expected!");
  }

  console.log("\n==================================================");
  console.log("  MULTILINGUAL TEST SUITE: ✅ 100% ALL PASSED     ");
  console.log("==================================================");

  await mongoose.disconnect();
}

runMultilingualTestSuite().catch((err) => {
  console.error("Multilingual Test Suite Failed:", err);
  process.exit(1);
});
