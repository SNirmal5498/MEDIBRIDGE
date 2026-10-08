const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const request = require(path.join(serverDir, "node_modules/supertest"));
const app = require(path.join(serverDir, "app.js"));

async function testAuthRoleFlow() {
  await mongoose.connect("mongodb://127.0.0.1:27017/medibridge");

  console.log("==================================================");
  console.log("  ADMIN ROLE-BASED AUTHENTICATION & SECURITY TEST ");
  console.log("==================================================");

  // 1. Login with Normal User Account
  const userLogin = await request(app)
    .post("/api/auth/login")
    .send({ email: "user@medibridge.com", password: "user123456" });

  console.log("\n1. Normal User Login Response:");
  console.log("   Status:", userLogin.status);
  console.log("   User Object:", userLogin.body.user);
  console.log("   Role Identified as:", userLogin.body.user?.role);

  // 2. Login with Admin Account
  const adminLogin = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@medibridge.com", password: "admin123456" });

  console.log("\n2. Admin User Login Response:");
  console.log("   Status:", adminLogin.status);
  console.log("   User Object:", adminLogin.body.user);
  console.log("   Role Identified as:", adminLogin.body.user?.role);

  // 3. Test Profile Refresh for Admin
  const adminProfile = await request(app)
    .get("/api/auth/profile")
    .set("Authorization", `Bearer ${adminLogin.body.token}`);

  console.log("\n3. Admin Profile Refresh (/api/auth/profile):");
  console.log("   Status:", adminProfile.status);
  console.log("   Persisted Role on Refresh:", adminProfile.body.user?.role);

  // 4. Test Route Security Matrix
  const noTokenRes = await request(app).get("/api/admin/overview");
  const userAuthRes = await request(app)
    .get("/api/admin/overview")
    .set("Authorization", `Bearer ${userLogin.body.token}`);
  const adminAuthRes = await request(app)
    .get("/api/admin/overview")
    .set("Authorization", `Bearer ${adminLogin.body.token}`);

  console.log("\n4. Security Access Matrix (/api/admin/overview):");
  console.log("   No Token Request Status:     ", noTokenRes.status, "(Expected 401)");
  console.log("   Normal User Token Status:    ", userAuthRes.status, "(Expected 403 Forbidden)");
  console.log("   Admin User Token Status:     ", adminAuthRes.status, "(Expected 200 Allowed)");

  const passed =
    userLogin.body.user?.role === "user" &&
    adminLogin.body.user?.role === "admin" &&
    adminProfile.body.user?.role === "admin" &&
    noTokenRes.status === 401 &&
    userAuthRes.status === 403 &&
    adminAuthRes.status === 200;

  console.log("\n==================================================");
  console.log("OVERALL ROLE-BASED AUTH TEST:", passed ? "✅ PASSED 100%" : "❌ FAILED");
  console.log("==================================================");

  await mongoose.disconnect();
}

testAuthRoleFlow().catch(console.error);
