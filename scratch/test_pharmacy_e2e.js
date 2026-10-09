const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const request = require(path.join(serverDir, "node_modules/supertest"));
const app = require(path.join(serverDir, "app.js"));
require(path.join(serverDir, "node_modules/dotenv")).config({ path: path.join(serverDir, ".env") });

async function testPharmacyE2E() {
  const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medibridge";
  await mongoose.connect(dbUri);

  console.log("==================================================");
  console.log("  PHARMACY E2E SECURITY, CREATION & API TEST     ");
  console.log("==================================================");

  // 1. Authenticate users
  const userLogin = await request(app)
    .post("/api/auth/login")
    .send({ email: "user@medibridge.com", password: "user123456" });

  const adminLogin = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@medibridge.com", password: "admin123456" });

  const adminToken = adminLogin.body.token;
  const userToken = userLogin.body.token;

  // 2. Test Security: Unauthenticated request
  const noTokenRes = await request(app).post("/api/admin/pharmacies").send({ name: "Unauthorized Pharmacy" });
  console.log("1. No token POST status:", noTokenRes.status, "(Expected 401)");

  // 3. Test Security: Normal user request
  const userAuthRes = await request(app)
    .post("/api/admin/pharmacies")
    .set("Authorization", `Bearer ${userToken}`)
    .send({ name: "Forbidden Pharmacy" });
  console.log("2. User token POST status:", userAuthRes.status, "(Expected 403)");

  // 4. Test Validation: Missing required fields as Admin
  const invalidRes = await request(app)
    .post("/api/admin/pharmacies")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "" });
  console.log("3. Missing fields POST status:", invalidRes.status, "(Expected 400 Bad Request)");

  // 5. Test Valid Pharmacy Creation as Admin
  const testName = `Test Care Pharmacy ${Date.now()}`;
  const validData = {
    name: testName,
    address: "123 Health Ave, Saibaba Colony, Coimbatore, Tamil Nadu",
    phone: "+91-422-99887766",
    openingTime: "08:00 AM",
    closingTime: "10:00 PM",
    latitude: 11.025,
    longitude: 76.945,
    isOpen: true,
    deliveryAvailable: true,
    deliveryFee: 20,
    isActive: true,
  };

  const createRes = await request(app)
    .post("/api/admin/pharmacies")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(validData);

  console.log("4. Admin Create Pharmacy status:", createRes.status, "(Expected 201 Created)");
  console.log("   Created Pharmacy ID:", createRes.body.pharmacy?.id);
  console.log("   Created Pharmacy Name:", createRes.body.pharmacy?.name);

  // 6. Test Duplicate Pharmacy Prevention
  const dupRes = await request(app)
    .post("/api/admin/pharmacies")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(validData);
  console.log("5. Duplicate Pharmacy POST status:", dupRes.status, "(Expected 409 Conflict)");
  console.log("   Duplicate Error Message:", dupRes.body.message);

  // 7. Test Pharmacy Update as Admin
  const createdId = createRes.body.pharmacy?.id;
  const updateRes = await request(app)
    .put(`/api/admin/pharmacies/${createdId}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ phone: "+91-422-11223344", deliveryFee: 15 });

  console.log("6. Admin Update Pharmacy status:", updateRes.status, "(Expected 200 OK)");
  console.log("   Updated Phone:", updateRes.body.pharmacy?.phone);

  // 8. Test Pharmacy Persistence in Admin Directory
  const adminListRes = await request(app)
    .get("/api/admin/pharmacies")
    .set("Authorization", `Bearer ${adminToken}`);
  
  const foundInAdmin = adminListRes.body.pharmacies?.some((p) => p.id === createdId);
  console.log("7. Found in Admin Directory list:", foundInAdmin);

  // 9. Test Customer Pharmacy Endpoint
  const customerListRes = await request(app).get("/api/pharmacies");
  const foundInCustomer = customerListRes.body.pharmacies?.some((p) => p.id === createdId);
  console.log("8. Found in Customer Pharmacy list:", foundInCustomer);

  const allPassed =
    noTokenRes.status === 401 &&
    userAuthRes.status === 403 &&
    invalidRes.status === 400 &&
    createRes.status === 201 &&
    dupRes.status === 409 &&
    updateRes.status === 200 &&
    foundInAdmin &&
    foundInCustomer;

  console.log("\n==================================================");
  console.log("PHARMACY E2E TEST RESULT:", allPassed ? "✅ ALL PASSED 100%" : "❌ FAILED");
  console.log("==================================================");

  await mongoose.disconnect();
}

testPharmacyE2E().catch(console.error);
