const path = require("path");
const serverDir = path.join(__dirname, "../server");
require(path.join(serverDir, "node_modules/dotenv")).config({ path: path.join(serverDir, ".env") });
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const bcrypt = require(path.join(serverDir, "node_modules/bcrypt"));
const User = require(path.join(serverDir, "models/User"));
const Pharmacy = require(path.join(serverDir, "models/Pharmacy"));

async function seedTestUsers() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medibridge");

  // Ensure test pharmacy exists and is approved
  const testPharmId = "pharm-test-partner-001";
  let pharm = await Pharmacy.findOne({ id: testPharmId });
  if (!pharm) {
    pharm = await Pharmacy.create({
      id: testPharmId,
      name: "MediBridge Central Partner Pharmacy",
      address: "104 Trichy Road, Coimbatore, Tamil Nadu 641018",
      phone: "+91-9876543220",
      email: "central@medibridge.com",
      licenseNumber: "TN-CBE-2026-998877",
      responsiblePharmacist: "Dr. K. Swaminathan, B.Pharm",
      approvalStatus: "approved",
      deliveryAvailable: true,
      deliveryFee: 25,
      openingTime: "08:00",
      closingTime: "22:00",
      rating: 4.8,
    });
    console.log("✅ Seeded test pharmacy:", testPharmId);
  } else {
    pharm.approvalStatus = "approved";
    pharm.licenseNumber = pharm.licenseNumber || "TN-CBE-2026-998877";
    pharm.responsiblePharmacist = pharm.responsiblePharmacist || "Dr. K. Swaminathan, B.Pharm";
    await pharm.save();
    console.log("✅ Verified test pharmacy:", testPharmId);
  }

  // 1. Pharmacy Owner
  const ownerEmail = "owner@medibridge.com";
  let owner = await User.findOne({ email: ownerEmail });
  const ownerHashedPassword = await bcrypt.hash("owner123456", 10);
  if (!owner) {
    owner = await User.create({
      name: "Ramesh Kumar (Pharmacy Owner)",
      email: ownerEmail,
      password: ownerHashedPassword,
      role: "pharmacy_owner",
      pharmacyId: testPharmId,
      accountStatus: "active",
      phone: "+91-9876543221",
      preferredLanguage: "en",
    });
    console.log("✅ Created pharmacy owner: owner@medibridge.com / owner123456");
  } else {
    owner.role = "pharmacy_owner";
    owner.pharmacyId = testPharmId;
    owner.password = ownerHashedPassword;
    owner.accountStatus = "active";
    await owner.save();
    console.log("✅ Updated pharmacy owner: owner@medibridge.com / owner123456");
  }

  // 2. Pharmacy Staff
  const staffEmail = "staff@medibridge.com";
  let staff = await User.findOne({ email: staffEmail });
  const staffHashedPassword = await bcrypt.hash("staff123456", 10);
  if (!staff) {
    staff = await User.create({
      name: "Priya Sharma (Staff Pharmacist)",
      email: staffEmail,
      password: staffHashedPassword,
      role: "pharmacy_staff",
      pharmacyId: testPharmId,
      staffPermissions: ["inventory_read", "orders_read", "orders_update", "prescriptions_read", "prescriptions_review"],
      accountStatus: "active",
      phone: "+91-9876543222",
      preferredLanguage: "en",
    });
    console.log("✅ Created pharmacy staff: staff@medibridge.com / staff123456");
  } else {
    staff.role = "pharmacy_staff";
    staff.pharmacyId = testPharmId;
    staff.password = staffHashedPassword;
    staff.staffPermissions = ["inventory_read", "orders_read", "orders_update", "prescriptions_read", "prescriptions_review"];
    staff.accountStatus = "active";
    await staff.save();
    console.log("✅ Updated pharmacy staff: staff@medibridge.com / staff123456");
  }

  // 3. Customer User
  const userEmail = "user@medibridge.com";
  let user = await User.findOne({ email: userEmail });
  const userHashedPassword = await bcrypt.hash("user123456", 10);
  if (!user) {
    user = await User.create({
      name: "Regular Test User",
      email: userEmail,
      password: userHashedPassword,
      role: "user",
      accountStatus: "active",
      phone: "+91-9876543211",
      preferredLanguage: "en",
    });
    console.log("✅ Created test customer: user@medibridge.com / user123456");
  } else {
    user.role = "user";
    user.password = userHashedPassword;
    user.accountStatus = "active";
    await user.save();
    console.log("✅ Updated test customer: user@medibridge.com / user123456");
  }

  // 4. Admin User
  const adminEmail = "admin@medibridge.com";
  let admin = await User.findOne({ email: adminEmail });
  const adminHashedPassword = await bcrypt.hash("admin123456", 10);
  if (!admin) {
    admin = await User.create({
      name: "MediBridge System Admin",
      email: adminEmail,
      password: adminHashedPassword,
      role: "admin",
      accountStatus: "active",
      phone: "+91-9876543210",
      preferredLanguage: "en",
    });
    console.log("✅ Created system admin: admin@medibridge.com / admin123456");
  } else {
    admin.role = "admin";
    admin.password = adminHashedPassword;
    admin.accountStatus = "active";
    await admin.save();
    console.log("✅ Updated system admin: admin@medibridge.com / admin123456");
  }

  await mongoose.disconnect();
}

seedTestUsers().catch(console.error);
