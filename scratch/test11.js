const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const { translateText } = require(path.join(serverDir, "utils/translator"));

async function test11() {
  await mongoose.connect("mongodb://127.0.0.1:27017/medibridge");

  console.log("=== TEST 11: MEDICAL DATA PRESERVATION ===");
  const testCases = [
    "Dose: 500 mg twice daily. Price: ₹15.",
    "Pack size: 24 tablets. Take 650 mg after food.",
    "Call emergency helpline at +91-9876543210 or visit https://medibridge.com/help",
    "MongoDB ID: 60d5ec49f1b2c8123456789a",
  ];

  for (const text of testCases) {
    const result = await translateText(text, "ta", "en");
    console.log(`\nOriginal:  "${text}"`);
    console.log(`Translated: "${result}"`);
  }

  await mongoose.disconnect();
}

test11().catch((err) => {
  console.error(err);
  process.exit(1);
});
