const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const { translateText } = require(path.join(serverDir, "utils/translator"));

async function test9() {
  await mongoose.connect("mongodb://127.0.0.1:27017/medibridge");

  // Save current env vars
  const origProvider = process.env.TRANSLATION_PROVIDER;
  const origGoogleKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  // Intentionally set invalid provider / bad key to force error in external provider
  process.env.TRANSLATION_PROVIDER = "invalid_provider_xyz";
  process.env.GOOGLE_TRANSLATE_API_KEY = "invalid_key_xyz";

  console.log("=== TEST 9: FAILURE HANDLING & FALLBACK ===");
  const text = "Paracetamol 500 mg relief tablets.";

  try {
    const result = await translateText(text, "ta", "en");
    console.log("Result under failure simulation:", result);
    console.log("Returned safe fallback string:", typeof result === "string" ? "YES" : "NO");
    console.log("App did NOT crash:", "YES");
  } catch (err) {
    console.error("App crashed with error:", err);
  } finally {
    process.env.TRANSLATION_PROVIDER = origProvider;
    process.env.GOOGLE_TRANSLATE_API_KEY = origGoogleKey;
    await mongoose.disconnect();
  }
}

test9().catch((err) => {
  console.error(err);
  process.exit(1);
});
