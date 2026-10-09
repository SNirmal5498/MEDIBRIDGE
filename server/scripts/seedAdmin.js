require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

async function seedAdmin() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medibridge";
  console.log("Connecting to MongoDB for admin seeding...");
  
  await mongoose.connect(mongoUri);

  const adminEmail = "admin@medibridge.com";
  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    // Check if another user has role 'admin'
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log(`Found existing admin account with email: ${existingAdmin.email}. Updating to system admin email.`);
      existingAdmin.email = adminEmail;
      existingAdmin.name = "MediBridge System Admin";
      existingAdmin.accountStatus = "active";
      await existingAdmin.save();
      admin = existingAdmin;
      console.log("✅ Admin user account updated successfully.");
    } else {
      const hashedPassword = await bcrypt.hash("admin123456", 10);
      admin = await User.create({
        name: "MediBridge System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        accountStatus: "active",
        phone: "+91-9876543210",
        preferredLanguage: "English",
      });
      console.log("✅ System Admin created: admin@medibridge.com / admin123456");
    }
  } else {
    let needsSave = false;
    if (admin.role !== "admin") {
      admin.role = "admin";
      needsSave = true;
    }
    if (admin.accountStatus !== "active") {
      admin.accountStatus = "active";
      needsSave = true;
    }
    if (needsSave) {
      await admin.save();
      console.log("✅ Existing admin account role/status verified & updated.");
    } else {
      console.log("✅ Admin account admin@medibridge.com already exists and is active.");
    }
  }

  // Create or verify regular test user user@medibridge.com for security tests
  const userEmail = "user@medibridge.com";
  let normalUser = await User.findOne({ email: userEmail });
  if (!normalUser) {
    const hashedPassword = await bcrypt.hash("user123456", 10);
    await User.create({
      name: "Regular Test User",
      email: userEmail,
      password: hashedPassword,
      role: "user",
      accountStatus: "active",
      phone: "+91-9876543211",
      preferredLanguage: "English",
    });
    console.log("✅ Regular test user created: user@medibridge.com / user123456");
  } else {
    console.log("✅ Regular test user user@medibridge.com already exists.");
  }

  await mongoose.disconnect();
}

if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log("Admin seeding completed successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Admin seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedAdmin;
