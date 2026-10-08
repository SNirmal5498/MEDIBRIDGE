const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const { translateText } = require(path.join(serverDir, "utils/translator"));
const TranslationCache = require(path.join(serverDir, "models/TranslationCache"));

async function testCacheMissAndHit() {
  await mongoose.connect("mongodb://127.0.0.1:27017/medibridge");

  const uniqueText = `Amoxicillin kills bacteria by preventing them from forming their essential protective wall. Unique ID: ${Date.now()}`;
  const targetLang = "ta";
  const sourceLang = "en";

  const hash = TranslationCache.generateHash(uniqueText, targetLang, sourceLang);

  console.log("=== TEST 2: CACHE MISS ===");
  // Ensure not in cache
  await TranslationCache.deleteOne({ hash });

  const startMiss = Date.now();
  const translatedMiss = await translateText(uniqueText, targetLang, sourceLang);
  const durationMiss = Date.now() - startMiss;

  console.log(`Cache Miss Result (${durationMiss}ms):`, translatedMiss);

  // Give async DB write a microsecond to finish if needed
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Check MongoDB
  const dbDoc = await TranslationCache.findOne({ hash }).lean();
  console.log("MongoDB Cache Record Created:", dbDoc ? "YES" : "NO");
  if (dbDoc) {
    console.log("  Hash:", dbDoc.hash);
    console.log("  Source Text:", dbDoc.sourceText);
    console.log("  Translated Text:", dbDoc.translatedText);
  }

  console.log("\n=== TEST 3: CACHE HIT ===");
  const startHit = Date.now();
  const translatedHit = await translateText(uniqueText, targetLang, sourceLang);
  const durationHit = Date.now() - startHit;

  console.log(`Cache Hit Result (${durationHit}ms):`, translatedHit);
  console.log("Matches Miss Result:", translatedMiss === translatedHit ? "YES" : "NO");
  console.log("Fast (sub-10ms):", durationHit < 10 ? "YES" : "NO");

  await mongoose.disconnect();
}

testCacheMissAndHit().catch((err) => {
  console.error(err);
  process.exit(1);
});
