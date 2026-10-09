const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const request = require(path.join(serverDir, "node_modules/supertest"));
const app = require(path.join(serverDir, "app.js"));
const Pharmacy = require(path.join(serverDir, "models/Pharmacy"));
const Medicine = require(path.join(serverDir, "models/Medicine"));
const Inventory = require(path.join(serverDir, "models/Inventory"));
const Order = require(path.join(serverDir, "models/Order"));

require(path.join(serverDir, "node_modules/dotenv")).config({ path: path.join(serverDir, ".env") });

async function runE2ETest() {
  const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medibridge";
  await mongoose.connect(dbUri);

  console.log("==================================================");
  console.log("  PART B #11: END-TO-END PHARMACY & INVENTORY TEST ");
  console.log("==================================================");

  // 1. Login Admin & User
  const adminLogin = await request(app).post("/api/auth/login").send({ email: "admin@medibridge.com", password: "admin123456" });
  const userLogin = await request(app).post("/api/auth/login").send({ email: "user@medibridge.com", password: "user123456" });
  const adminToken = adminLogin.body.token;
  const userToken = userLogin.body.token;

  if (!adminToken || !userToken) {
    throw new Error("Failed to authenticate test accounts");
  }

  // Find or create test medicine
  let medicine = await Medicine.findOne({ prescriptionRequired: false });
  if (!medicine) {
    medicine = await Medicine.create({
      name: "E2E Test OTC Paracetamol 500mg",
      brandName: "E2E Health",
      genericName: "Paracetamol",
      form: "Tablet",
      dosage: "500mg",
      category: "Pain Relief",
      price: 25,
      prescriptionRequired: false,
      isActive: true,
    });
  }

  const testPharmId = `pharm-e2e-test-${Date.now()}`;
  const testPharmName = `E2E Test Pharmacy ${Date.now()}`;

  // 2. Create controlled test pharmacy (Quantity: 5)
  const pharmRes = await request(app)
    .post("/api/admin/pharmacies")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      id: testPharmId,
      name: testPharmName,
      address: "100 Test St, RS Puram, Coimbatore",
      phone: "+91-9876543210",
      openingTime: "08:00 AM",
      closingTime: "10:00 PM",
      latitude: 11.005,
      longitude: 76.96,
      isOpen: true,
      deliveryAvailable: true,
      deliveryFee: 15,
      isActive: true,
    });
  console.log("Step 1: Admin created test pharmacy:", pharmRes.status === 201 ? "SUCCESS" : "FAILED", pharmRes.body.pharmacy?.id);

  // 3. Create inventory record (Quantity: 5)
  const invRes = await request(app)
    .post("/api/admin/inventory")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      pharmacyId: pharmRes.body.pharmacy?.id,
      medicineId: medicine.id,
      stock: 5,
      price: 30,
      stockType: "verified",
      lowStockThreshold: 3,
    });
  console.log("Step 2: Admin set inventory to 5:", (invRes.status === 200 || invRes.status === 201) ? "SUCCESS" : "FAILED", `Stock: ${invRes.body.inventory?.stock}`);

  // 4. Verify Nearby Pharmacy shows correct pharmacy, medicine, price and stock availability
  const searchRes = await request(app)
    .get(`/api/pharmacies/availability/${medicine.id}?lat=11.006&lng=76.961`);
  const foundPharm = searchRes.body.pharmacies?.find(p => p.id === pharmRes.body.pharmacy?.id);
  console.log("Step 3: Customer search found test pharmacy with stock:", foundPharm ? `YES (Stock: ${foundPharm.stock}, Price: ₹${foundPharm.price})` : "NO");

  if (!foundPharm || foundPharm.stock !== 5) {
    throw new Error(`Step 3 failed. Expected stock 5, got ${foundPharm?.stock}`);
  }

  // 5. Place valid order for quantity 2
  const orderRes = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      items: [
        {
          medicineId: medicine.id,
          medicineName: medicine.name,
          genericName: medicine.genericName || "Paracetamol",
          strength: "500mg",
          quantity: 2,
          unitPrice: 30,
          totalPrice: 60,
          otc: true,
        },
      ],
      pharmacy: {
        id: pharmRes.body.pharmacy?.id,
        name: pharmRes.body.pharmacy?.name,
        address: pharmRes.body.pharmacy?.address || "100 Test St",
        phone: pharmRes.body.pharmacy?.phone || "+91-9876543210",
        rating: 4.8,
        distance: "1.2 km",
      },
      deliveryAddress: {
        fullName: "Test User",
        phone: "+91-9876543210",
        houseFlat: "Flat 101",
        streetRoad: "123 Main St",
        area: "RS Puram",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641002",
      },
      paymentMethod: "cod",
      subtotal: 60,
      deliveryFee: 15,
      discount: 0,
      totalAmount: 75,
    });

  console.log("Step 4: Customer order quantity 2 status:", orderRes.status, `Order ID: ${orderRes.body.order?.id}`);

  // 6. Verify stock changes to 3 exactly once
  const updatedInv = await Inventory.findOne({ pharmacyId: pharmRes.body.pharmacy?.id, medicineId: medicine.id });
  console.log("Step 5: Inventory stock after order (Expected: 3):", updatedInv.stock);
  if (updatedInv.stock !== 3) {
    throw new Error(`Step 5 failed. Stock is ${updatedInv.stock}, expected 3`);
  }

  // 7. Cancel order and verify stock restored to 5
  const cancelRes = await request(app)
    .put(`/api/orders/${orderRes.body.order?.id}/status`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({ status: "cancelled" });
  console.log("Step 6: Cancel order status:", cancelRes.status);

  const restoredInv = await Inventory.findOne({ pharmacyId: pharmRes.body.pharmacy?.id, medicineId: medicine.id });
  console.log("Step 7: Inventory stock after cancellation (Expected: 5):", restoredInv.stock);
  if (restoredInv.stock !== 5) {
    throw new Error(`Step 7 failed. Stock is ${restoredInv.stock}, expected 5`);
  }

  // 8. Set quantity to zero and verify order fails
  await Inventory.updateOne({ pharmacyId: pharmRes.body.pharmacy?.id, medicineId: medicine.id }, { stock: 0 });
  const zeroOrderRes = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      items: [
        {
          medicineId: medicine.id,
          medicineName: medicine.name,
          genericName: medicine.genericName || "Paracetamol",
          strength: "500mg",
          quantity: 1,
          unitPrice: 30,
          totalPrice: 30,
          otc: true,
        },
      ],
      pharmacy: {
        id: pharmRes.body.pharmacy?.id,
        name: pharmRes.body.pharmacy?.name,
        address: pharmRes.body.pharmacy?.address || "100 Test St",
        phone: pharmRes.body.pharmacy?.phone || "+91-9876543210",
        rating: 4.8,
        distance: "1.2 km",
      },
      deliveryAddress: {
        fullName: "Test User",
        phone: "+91-9876543210",
        houseFlat: "Flat 101",
        streetRoad: "123 Main St",
        area: "RS Puram",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641002",
      },
      paymentMethod: "cod",
      subtotal: 30,
      deliveryFee: 15,
      discount: 0,
      totalAmount: 45,
    });

  console.log("Step 8: Ordering zero-stock item status:", zeroOrderRes.status, "(Expected 400 Bad Request)");
  console.log("        Response Message:", zeroOrderRes.body.message);
  if (zeroOrderRes.status !== 400) {
    throw new Error(`Step 8 failed. Zero-stock order was not blocked correctly! Status: ${zeroOrderRes.status}`);
  }

  // 9. Clean up ONLY test records created in this test
  await Order.deleteMany({ id: orderRes.body.order?.id });
  await Inventory.deleteMany({ pharmacyId: pharmRes.body.pharmacy?.id });
  await Pharmacy.deleteMany({ id: pharmRes.body.pharmacy?.id });
  console.log("Step 9: Test records cleaned up successfully.");

  console.log("==================================================");
  console.log("  PART B #11 E2E TEST: ✅ 100% ALL PASSED         ");
  console.log("==================================================");

  await mongoose.disconnect();
}

runE2ETest().catch((err) => {
  console.error("E2E Test Failed:", err);
  process.exit(1);
});
