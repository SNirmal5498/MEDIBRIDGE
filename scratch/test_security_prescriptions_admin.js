const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const request = require(path.join(serverDir, "node_modules/supertest"));
const app = require(path.join(serverDir, "app.js"));
const Medicine = require(path.join(serverDir, "models/Medicine"));

require(path.join(serverDir, "node_modules/dotenv")).config({ path: path.join(serverDir, ".env") });

async function runSecurityTests() {
  const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medibridge";
  await mongoose.connect(dbUri);

  console.log("==================================================");
  console.log("  ACCEPTANCE TEST 9: SECURITY & DATA PROTECTION    ");
  console.log("==================================================");

  // 1. Authenticate users
  const adminLogin = await request(app).post("/api/auth/login").send({ email: "admin@medibridge.com", password: "admin123456" });
  const userLogin = await request(app).post("/api/auth/login").send({ email: "user@medibridge.com", password: "user123456" });
  const adminToken = adminLogin.body.token;
  const userToken = userLogin.body.token;

  // 2. Test Admin Endpoint Security (Unauthenticated)
  const unauthRes = await request(app).get("/api/admin/pharmacies");
  console.log("1. Unauthenticated request to /api/admin/pharmacies:", unauthRes.status, "(Expected 401)");
  if (unauthRes.status !== 401) throw new Error("Unauthenticated request was not blocked!");

  // 3. Test Admin Endpoint Security (Normal User Token)
  const userAdminRes = await request(app)
    .get("/api/admin/pharmacies")
    .set("Authorization", `Bearer ${userToken}`);
  console.log("2. Normal user request to /api/admin/pharmacies:", userAdminRes.status, "(Expected 403)");
  if (userAdminRes.status !== 403) throw new Error("Normal user was allowed to access admin API!");

  // 4. Test Prescription File Security (Unauthenticated)
  const unauthRxRes = await request(app).get("/api/prescriptions/rx-12345/file");
  console.log("3. Unauthenticated request to prescription file:", unauthRxRes.status, "(Expected 401)");
  if (unauthRxRes.status !== 401) throw new Error("Prescription file access without auth was not blocked!");

  // 5. Test Prescription Review Authorization (User token attempting admin review)
  const userReviewRes = await request(app)
    .patch("/api/prescriptions/rx-12345/review")
    .set("Authorization", `Bearer ${userToken}`)
    .send({ status: "approved" });
  console.log("4. Normal user reviewing prescription:", userReviewRes.status, "(Expected 403)");
  if (userReviewRes.status !== 403) throw new Error("Normal user was allowed to review prescription!");

  // 6. Test Direct Purchase Block for Rx Medicines
  let rxMedicine = await Medicine.findOne({ prescriptionRequired: true });
  if (!rxMedicine) {
    rxMedicine = await Medicine.create({
      id: "med-rx-test",
      name: "Amoxicillin 500mg (Rx Only)",
      brandName: "RxCare",
      genericName: "Amoxicillin",
      form: "Capsule",
      dosage: "500mg",
      category: "Antibiotic",
      price: 120,
      prescriptionRequired: true,
      isActive: true,
    });
  }

  const rxOrderRes = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      items: [
        {
          medicineId: rxMedicine.id,
          medicineName: rxMedicine.name,
          genericName: rxMedicine.genericName,
          strength: "500mg",
          quantity: 1,
          unitPrice: 120,
          totalPrice: 120,
          otc: false, // Rx item
        },
      ],
      pharmacy: { id: "pharm-001", name: "MedPlus Pharmacy", address: "124 Race Course Rd", phone: "+91-9842110001", rating: 4.8, distance: "0.8 km" },
      deliveryAddress: { fullName: "Test User", phone: "+91-9876543210", houseFlat: "Flat 101", streetRoad: "123 Main St", area: "RS Puram", city: "Coimbatore", state: "TN", pincode: "641002" },
      paymentMethod: "cod",
      subtotal: 120,
      deliveryFee: 20,
      discount: 0,
      totalAmount: 140,
    });

  console.log("5. Direct order for Rx medicine status:", rxOrderRes.status, "(Expected 400 Bad Request)");
  console.log("   Message:", rxOrderRes.body.message);
  if (rxOrderRes.status !== 400) throw new Error("Direct order for Rx medicine was not blocked!");

  console.log("==================================================");
  console.log("  ACCEPTANCE TEST 9 RESULT: ✅ ALL PASSED 100%    ");
  console.log("==================================================");

  await mongoose.disconnect();
}

runSecurityTests().catch((err) => {
  console.error("Security Test Failed:", err);
  process.exit(1);
});
