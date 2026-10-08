const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const { translateText } = require(path.join(serverDir, "utils/translator"));

async function test1() {
  await mongoose.connect("mongodb://127.0.0.1:27017/medibridge");
  const text = "Paracetamol is used to reduce fever and relieve mild to moderate pain.";
  const langs = ["ta", "hi", "te", "ml", "kn"];

  console.log("=== TEST 1: EXTERNAL TRANSLATION API ===");
  for (const lang of langs) {
    const start = Date.now();
    const result = await translateText(text, lang, "en");
    const duration = Date.now() - start;
    console.log(`[${lang.toUpperCase()}] (${duration}ms): ${result}`);
  }
  await mongoose.disconnect();
}

test1().catch((err) => {
  console.error(err);
  process.exit(1);
});
