const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const bcrypt = require(path.join(serverDir, "node_modules/bcrypt"));
const User = require(path.join(serverDir, "models/User"));

async function seedAdmin() {
  await mongoose.connect("mongodb://127.0.0.1:27017/medibridge");

  const adminEmail = "admin@medibridge.com";
  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin123456", 10);
    admin = await User.create({
      name: "MediBridge System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      accountStatus: "active",
      phone: "+91-9876543210",
      preferredLanguage: "en",
    });
    console.log("✅ Admin user created: admin@medibridge.com / admin123456");
  } else {
    admin.role = "admin";
    admin.accountStatus = "active";
    await admin.save();
    console.log("✅ Admin user already exists and role updated to 'admin'");
  }

  // Create a regular test user as well for security testing
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
      preferredLanguage: "en",
    });
    console.log("✅ Regular test user created: user@medibridge.com / user123456");
  }

  await mongoose.disconnect();
}

seedAdmin().catch(console.error);
