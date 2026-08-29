require("dotenv").config();
const connectDB = require("../config/db");
const Medicine = require("../models/Medicine");

async function runTests() {
  await connectDB();

  const searchTerms = [
    "paracetamol",
    "crocin",
    "dolo",
    "cetirizine",
    "amoxicillin",
    "azithromycin",
    "metformin",
    "amlodipine",
    "omeprazole",
    "pantoprazole",
    "ibuprofen",
    "vitamin",
    "ORS",
    "para",
    "cro",
    "amox",
    "met",
  ];

  console.log("--- TESTING SEARCH QUERIES ---");
  for (const term of searchTerms) {
    const regex = new RegExp(term, "i");
    const matches = await Medicine.find({
      $or: [
        { brand: regex },
        { genericName: regex },
        { name: regex },
        { composition: regex },
        { category: regex },
        { manufacturer: regex },
      ],
    }).limit(5);
    console.log(
      `Search "${term}": found ${matches.length} matches (first: ${matches[0] ? matches[0].name : "none"})`
    );
  }

  console.log("\n--- TESTING OTC VS RX LOGIC ---");
  const otcCount = await Medicine.countDocuments({ otc: true, prescriptionRequired: false });
  const rxCount = await Medicine.countDocuments({ otc: false, prescriptionRequired: true });
  const total = await Medicine.countDocuments();
  console.log(`OTC count (otc=true, rx=false): ${otcCount}`);
  console.log(`Rx count (otc=false, rx=true): ${rxCount}`);
  console.log(`Total count: ${total} (Consistent: ${otcCount + rxCount === total})`);

  console.log("\n--- TESTING ALTERNATIVES ---");
  const crocin = await Medicine.findOne({ id: "crocin-500" });
  console.log("Crocin 500 alternatives count:", crocin?.alternatives?.length, "sample:", crocin?.alternatives?.slice(0, 5));

  console.log("\n--- TESTING CATEGORIES ---");
  const categories = await Medicine.distinct("category");
  console.log(`Active categories count: ${categories.length}`);
  console.log(categories);

  process.exit(0);
}

runTests();
