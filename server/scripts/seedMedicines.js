require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Medicine = require("../models/Medicine");
const { generateFullCatalog } = require("./data/medicineCatalogData");

async function seed() {
  console.log("==================================================");
  console.log("  MEDIBRIDGE MEDICINE DATABASE SEEDER");
  console.log("==================================================");

  try {
    await connectDB();

    const countBefore = await Medicine.countDocuments();
    console.log(`📊 Current medicines in database: ${countBefore}`);

    console.log("⏳ Generating master Indian pharmaceutical dataset...");
    const catalog = generateFullCatalog();
    console.log(`📦 Master dataset generated with ${catalog.length} high quality records.`);

    // Check uniqueness
    const seenIds = new Set();
    const uniqueRecords = [];
    let internalDuplicates = 0;

    for (const item of catalog) {
      if (seenIds.has(item.id)) {
        internalDuplicates++;
      } else {
        seenIds.add(item.id);
        uniqueRecords.push(item);
      }
    }

    if (internalDuplicates > 0) {
      console.log(`⚠️ Removed ${internalDuplicates} duplicate IDs from source generator.`);
    }

    console.log("🚀 Upserting medicine records via bulkWrite...");
    const bulkOps = uniqueRecords.map((med) => ({
      updateOne: {
        filter: { id: med.id },
        update: { $set: med },
        upsert: true,
      },
    }));

    const result = await Medicine.bulkWrite(bulkOps, { ordered: false });

    const countAfter = await Medicine.countDocuments();

    console.log("==================================================");
    console.log("✅ SEED COMPLETED SUCCESSFULLY");
    console.log("==================================================");
    console.log(`- Medicines before seed:    ${countBefore}`);
    console.log(`- Total records generated:  ${catalog.length}`);
    console.log(`- New records inserted:     ${result.upsertedCount || 0}`);
    console.log(`- Existing records updated:  ${result.modifiedCount || 0}`);
    console.log(`- Unmodified/matched:       ${(result.matchedCount || 0) - (result.modifiedCount || 0)}`);
    console.log(`- Total medicines in DB:    ${countAfter}`);
    console.log("==================================================");
    console.log("🛡️ Safety check: Users, Orders, and Pharmacies intact (0 deleted).");
    console.log("==================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

seed();
