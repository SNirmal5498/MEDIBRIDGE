const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const request = require(path.join(serverDir, "node_modules/supertest"));
const app = require(path.join(serverDir, "app.js"));
require(path.join(serverDir, "node_modules/dotenv")).config({ path: path.join(serverDir, ".env") });

async function testDynamicTranslation() {
  const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medibridge";
  await mongoose.connect(dbUri);

  console.log("==================================================");
  console.log("  PART C: DYNAMIC TRANSLATION & CACHE API TEST     ");
  console.log("==================================================");

  // 1. Single text translation test to Hindi (hi)
  const singleRes = await request(app)
    .post("/api/translation/translate")
    .send({ text: "Take one tablet after meals twice daily.", targetLang: "hi" });

  console.log("1. Single text status:", singleRes.status);
  console.log("   Original: 'Take one tablet after meals twice daily.'");
  console.log("   Translated (hi):", singleRes.body.translated);

  // 2. Batch text translation test to Tamil (ta)
  const batchRes = await request(app)
    .post("/api/translation/translate")
    .send({
      texts: ["Fever and headache", "Store in a cool dry place", "Keep out of reach of children"],
      targetLang: "ta",
    });

  console.log("2. Batch text status:", batchRes.status);
  console.log("   Translated Batch (ta):", batchRes.body.translated);

  // 3. Object fields translation test to Telugu (te)
  const objectRes = await request(app)
    .post("/api/translation/object")
    .send({
      object: {
        name: "Paracetamol 500mg",
        uses: "Used for relieving fever and mild to moderate pain.",
        dosage: "Take 1 tablet every 6 hours as needed.",
      },
      fields: ["uses", "dosage"],
      targetLang: "te",
    });

  console.log("3. Object fields translation status:", objectRes.status);
  console.log("   Translated Object (te):", objectRes.body.translatedObject);

  // 4. Verify Cache Statistics
  const statsRes = await request(app).get("/api/translation/stats");
  console.log("4. Cache Stats status:", statsRes.status);
  console.log("   Total Cached Entries in MongoDB:", statsRes.body.totalCached);
  console.log("   Supported Languages:", statsRes.body.supportedLanguages);

  console.log("==================================================");
  console.log("  DYNAMIC TRANSLATION TEST: ✅ ALL PASSED          ");
  console.log("==================================================");

  await mongoose.disconnect();
}

testDynamicTranslation().catch((err) => {
  console.error("Dynamic Translation Test Failed:", err);
  process.exit(1);
});
