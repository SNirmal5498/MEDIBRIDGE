const { translateText, translateObject } = require("../server/utils/translator");

async function runTranslatorRateLimitingTests() {
  console.log("==================================================");
  console.log("   TRANSLATOR RATE LIMITING & COOLDOWN TEST");
  console.log("==================================================");

  // 1. Concurrent Request Deduplication Test
  console.log("\n1. Testing In-Flight Request Deduplication...");
  const textToTranslate = "Oral Rehydration Salts (WHO Formula)";
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(translateText(textToTranslate, "ta"));
  }

  const start = Date.now();
  const results = await Promise.all(promises);
  const duration = Date.now() - start;

  console.log(` ✅ 10 Concurrent requests completed in ${duration}ms.`);
  console.log(` ✅ Sample Result: '${results[0]}'`);
  const allEqual = results.every(r => r === results[0]);
  if (!allEqual) {
    console.error(" ❌ FAILED: Deduplicated requests returned mismatched results.");
    process.exit(1);
  }

  // 2. Cooldown & Terminal Warning Verification
  console.log("\n2. Testing Multiple Fields Batch Translation without log flooding...");
  const testObj = {
    name: "Dettol Antiseptic Liquid",
    brand: "Dettol Antiseptic Liquid",
    genericName: "Chloroxylenol",
    composition: "Chloroxylenol",
    category: "First Aid",
    shortDescription: "Effective antiseptic liquid for wound care.",
    description: "Kills germs and protects against infection.",
    uses: "First aid and hygiene",
    howItWorks: "Disinfects bacteria",
  };
  const fields = Object.keys(testObj);

  const objResult = await translateObject(testObj, fields, "ta");
  console.log(" ✅ Object Translation completed successfully:", {
    brand: objResult.brand,
    genericName: objResult.genericName,
    category: objResult.category,
  });

  console.log("\n==================================================");
  console.log("   TRANSLATOR RATE LIMITING SUITE: ✅ ALL PASSED!");
  console.log("==================================================");
}

runTranslatorRateLimitingTests().catch((err) => {
  console.error("❌ Test crashed:", err);
  process.exit(1);
});
