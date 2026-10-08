const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const { translateText } = require(path.join(serverDir, "utils/translator"));

async function test12() {
  await mongoose.connect("mongodb://127.0.0.1:27017/medibridge");

  console.log("=== TEST 12: MULTI-LAYER PERFORMANCE BENCHMARK ===");
  const text = "Paracetamol reduces fever by acting on the heat-regulating center of the brain.";
  const lang = "ta";

  // Request 1: Warmup / Miss
  const t1 = Date.now();
  await translateText(text, lang, "en");
  const d1 = Date.now() - t1;

  // Request 2: Level 1 (In-Memory Cache)
  const t2 = Date.now();
  await translateText(text, lang, "en");
  const d2 = Date.now() - t2;

  // Request 3: Repeated microsecond calls
  const t3 = Date.now();
  for (let i = 0; i < 1000; i++) {
    await translateText(text, lang, "en");
  }
  const d3 = Date.now() - t3;

  console.log(`First Request (Miss/API): ${d1}ms`);
  console.log(`Second Request (In-Memory Cache): ${d2}ms`);
  console.log(`1,000 Repeated Requests total duration: ${d3}ms (avg ${(d3 / 1000).toFixed(4)}ms/req)`);

  await mongoose.disconnect();
}

test12().catch((err) => {
  console.error(err);
  process.exit(1);
});
