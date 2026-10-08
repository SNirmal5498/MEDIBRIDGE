const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const Medicine = require(path.join(serverDir, "models/Medicine"));
const { translateMedicine } = require(path.join(serverDir, "utils/translator"));

async function test4And5() {
  await mongoose.connect("mongodb://127.0.0.1:27017/medibridge");

  // Get a real medicine document from DB (or create mock if DB is empty)
  let med = await Medicine.findOne().lean();

  if (!med) {
    med = {
      id: "dolo-650",
      brand: "Dolo",
      genericName: "Paracetamol",
      description: "Dolo 650 is an analgesic and antipyretic medicine recommended for fever and pain.",
      uses: ["Fever", "Headache", "Body Pain"],
      howItWorks: "Paracetamol blocks chemical messengers in the brain that trigger pain and fever signals.",
      dosage: { adults: "1 tablet every 6 hours as needed", pediatric: "Consult doctor for pediatric dose" },
      sideEffects: { common: ["Nausea", "Stomach Upset"], rare: ["Allergic Rash"] },
      warnings: { pregnancy: "Consult doctor before use during pregnancy", alcohol: "Avoid alcohol consumption" },
      interactions: ["Warfarin", "Other paracetamol medications"],
      foodInteractions: ["Can be taken with or without food"],
      storage: "Store in a cool dry place below 30°C",
    };
  }

  console.log("=== TEST 4: MEDICINE API TRANSLATION FOR TAMIL (?lang=ta) ===");
  const startTa = Date.now();
  const translatedTa = await translateMedicine(med, "ta");
  const durationTa = Date.now() - startTa;

  console.log(`Translation Duration: ${durationTa}ms`);
  console.log("Original description:", med.description);
  console.log("Translated description:", translatedTa.description);
  console.log("Original uses:", med.uses);
  console.log("Translated uses:", translatedTa.uses);
  console.log("Original howItWorks:", med.howItWorks);
  console.log("Translated howItWorks:", translatedTa.howItWorks);
  console.log("Original dosage:", med.dosage);
  console.log("Translated dosage:", translatedTa.dosage);
  console.log("Original sideEffects:", med.sideEffects);
  console.log("Translated sideEffects:", translatedTa.sideEffects);
  console.log("Original warnings:", med.warnings);
  console.log("Translated warnings:", translatedTa.warnings);
  console.log("Original storage:", med.storage);
  console.log("Translated storage:", translatedTa.storage);

  console.log("\n=== TEST 5: ALL 6 LANGUAGES (en, hi, ta, te, ml, kn) ===");
  const langs = ["en", "hi", "ta", "te", "ml", "kn"];

  for (const lang of langs) {
    const start = Date.now();
    const result = await translateMedicine(med, lang);
    const duration = Date.now() - start;
    console.log(`\n[Language: ${lang.toUpperCase()}] (${duration}ms)`);
    console.log("  Brand:", result.brand);
    console.log("  Description:", typeof result.description === "string" ? result.description.slice(0, 70) + "..." : result.description);
  }

  await mongoose.disconnect();
}

test4And5().catch((err) => {
  console.error(err);
  process.exit(1);
});
