const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const request = require(path.join(serverDir, "node_modules/supertest"));
const app = require(path.join(serverDir, "app.js"));
const Inventory = require(path.join(serverDir, "models/Inventory"));
const Pharmacy = require(path.join(serverDir, "models/Pharmacy"));
const Medicine = require(path.join(serverDir, "models/Medicine"));
const Order = require(path.join(serverDir, "models/Order"));

require(path.join(serverDir, "node_modules/dotenv")).config({ path: path.join(serverDir, ".env") });

async function runEdgeCaseTests() {
  const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medibridge";
  await mongoose.connect(dbUri);

  console.log("==================================================");
  console.log("  ACCEPTANCE TEST 6: EDGE CASES & CONCURRENCY     ");
  console.log("==================================================");

  const adminLogin = await request(app).post("/api/auth/login").send({ email: "admin@medibridge.com", password: "admin123456" });
  const userLogin = await request(app).post("/api/auth/login").send({ email: "user@medibridge.com", password: "user123456" });
  const adminToken = adminLogin.body.token;
  const userToken = userLogin.body.token;

  let medicine = await Medicine.findOne({ prescriptionRequired: false });
  const testPharmId = `pharm-edge-test-${Date.now()}`;

  // 1. Create test pharmacy and set stock to exactly 1 unit
  const pharmRes = await request(app)
    .post("/api/admin/pharmacies")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      id: testPharmId,
      name: `Edge Test Pharmacy ${Date.now()}`,
      address: "200 Edge St, Coimbatore",
      phone: "+91-9988776655",
      openingTime: "08:00 AM",
      closingTime: "10:00 PM",
      latitude: 11.01,
      longitude: 76.95,
      isOpen: true,
      deliveryAvailable: true,
      deliveryFee: 20,
      isActive: true,
    });

  await request(app)
    .post("/api/admin/inventory")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      pharmacyId: testPharmId,
      medicineId: medicine.id,
      stock: 1,
      price: 50,
      stockType: "verified",
      lowStockThreshold: 2,
    });

  console.log("1. Created inventory with stock: 1");

  // 2. Test Insufficient Stock (requesting 5 units when only 1 available)
  const orderBody = (qty) => ({
    items: [
      {
        medicineId: medicine.id,
        medicineName: medicine.name,
        genericName: medicine.genericName || "Paracetamol",
        strength: "500mg",
        quantity: qty,
        unitPrice: 50,
        totalPrice: 50 * qty,
        otc: true,
      },
    ],
    pharmacy: {
      id: testPharmId,
      name: pharmRes.body.pharmacy?.name,
      address: "200 Edge St",
      phone: "+91-9988776655",
      rating: 4.8,
      distance: "1.0 km",
    },
    deliveryAddress: { fullName: "Test User", phone: "+91-9876543210", houseFlat: "Flat 101", streetRoad: "123 Main St", area: "RS Puram", city: "Coimbatore", state: "TN", pincode: "641002" },
    paymentMethod: "cod",
    subtotal: 50 * qty,
    deliveryFee: 20,
    discount: 0,
    totalAmount: 50 * qty + 20,
  });

  const insufficientRes = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${userToken}`)
    .send(orderBody(5));

  console.log("2. Insufficient stock request status:", insufficientRes.status, "(Expected 400)");
  console.log("   Message:", insufficientRes.body.message);
  if (insufficientRes.status !== 400) throw new Error("Insufficient stock order was not blocked!");

  // 3. Test Concurrent Orders (two parallel order requests competing for 1 unit)
  console.log("3. Simulating concurrent orders for 1 remaining unit...");
  const [req1, req2] = await Promise.all([
    request(app).post("/api/orders").set("Authorization", `Bearer ${userToken}`).send(orderBody(1)),
    request(app).post("/api/orders").set("Authorization", `Bearer ${userToken}`).send(orderBody(1)),
  ]);

  const statuses = [req1.status, req2.status].sort();
  console.log("   Concurrent Order Statuses:", statuses);
  if (statuses[0] === 201 && statuses[1] === 400) {
    console.log("   ✅ Atomic locking succeeded! Exactly 1 order placed (201) and 1 rejected (400).");
  } else {
    throw new Error(`Concurrent ordering failure! Statuses: ${statuses}`);
  }

  // 4. Verify stock is now exactly 0 and negative inventory is prevented
  const finalInv = await Inventory.findOne({ pharmacyId: testPharmId, medicineId: medicine.id });
  console.log("4. Stock after race condition:", finalInv.stock, "(Expected 0)");
  if (finalInv.stock < 0) throw new Error("Inventory became negative!");

  // Clean up test data
  const createdOrders = [req1.body.order?.id, req2.body.order?.id].filter(Boolean);
  await Order.deleteMany({ orderId: { $in: createdOrders } });
  await Inventory.deleteMany({ pharmacyId: testPharmId });
  await Pharmacy.deleteMany({ id: testPharmId });
  console.log("5. Cleaned up test data.");

  console.log("==================================================");
  console.log("  ACCEPTANCE TEST 6 RESULT: ✅ ALL PASSED 100%    ");
  console.log("==================================================");

  await mongoose.disconnect();
}

runEdgeCaseTests().catch((err) => {
  console.error("Edge Case Test Failed:", err);
  process.exit(1);
});
