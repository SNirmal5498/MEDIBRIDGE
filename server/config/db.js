const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = "mongodb://127.0.0.1:27017/medibridge";

  try {
    if (primaryUri) {
      try {
        await mongoose.connect(primaryUri, {
          serverSelectionTimeoutMS: 4000,
          family: 4,
        });
        console.log("✅ MongoDB Connected via Atlas Cloud Cluster");
        return;
      } catch (err) {
        console.warn("⚠️ Atlas MongoDB connection failed, attempting local fallback:", err.message);
      }
    }

    await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected via Local Instance (127.0.0.1:27017)");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed on both primary and fallback URIs");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;