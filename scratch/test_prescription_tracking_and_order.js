const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const request = require(path.join(serverDir, "node_modules/supertest"));
const app = require(path.join(serverDir, "app.js"));
const User = require(path.join(serverDir, "models/User"));
const Pharmacy = require(path.join(serverDir, "models/Pharmacy"));
const Prescription = require(path.join(serverDir, "models/Prescription"));
const Order = require(path.join(serverDir, "models/Order"));

require(path.join(serverDir, "node_modules/dotenv")).config({ path: path.join(serverDir, ".env") });

async function runTests() {
  const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medibridge";
  await mongoose.connect(dbUri);

  console.log("===============================================================");
  console.log("  PRESCRIPTION TRACKING & APPROVED ORDER WORKFLOW TEST        ");
  console.log("===============================================================");

  // 1. Authenticate Customer
  console.log("\n[1] Authenticating customer...");
  const custRes = await request(app).post("/api/auth/login").send({
    email: "user@medibridge.com",
    password: "user123456",
  });
  if (custRes.status !== 200) throw new Error("Customer login failed");
  const custToken = custRes.body.token;
  console.log("✔ Customer logged in:", custRes.body.user.email);

  // Authenticate Pharmacy Owner
  console.log("\n[2] Authenticating pharmacy owner...");
  const pharmUser = await User.findOne({ role: "pharmacy_owner" });
  if (!pharmUser) throw new Error("Pharmacy owner account not found");
  const jwt = require(path.join(serverDir, "node_modules/jsonwebtoken"));
  const pharmToken = jwt.sign(
    { id: pharmUser._id, role: pharmUser.role, pharmacyId: pharmUser.pharmacyId },
    process.env.JWT_SECRET || "medibridge_secret_key"
  );
  console.log("✔ Pharmacy Owner authenticated for pharmacy:", pharmUser.pharmacyId);

  // 2. Upload prescription
  console.log("\n[3] Uploading test prescription for Ecosprin 75...");
  const validPdfContent = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF");
  const uploadRes = await request(app)
    .post("/api/prescriptions/upload")
    .set("Authorization", `Bearer ${custToken}`)
    .field("pharmacyId", pharmUser.pharmacyId)
    .field("medicineId", "ecosprin-75-75mg")
    .field("medicineName", "Ecosprin 75 (Aspirin 75mg)")
    .field("customerNotes", "Cardiologist prescribed 30-day course.")
    .attach("prescription", validPdfContent, "rx_cardiology.pdf");

  if (uploadRes.status !== 201) throw new Error("Upload failed: " + JSON.stringify(uploadRes.body));
  const rxId = uploadRes.body.prescription._id;
  console.log("✔ Uploaded prescription ID:", rxId, "Initial status:", uploadRes.body.prescription.status);

  // 3. Test View File Authentication & Security
  console.log("\n[4] Testing View File endpoint authentication...");
  // 4a. Request with empty token query (simulating the previous bug)
  const emptyTokenRes = await request(app).get(`/api/prescriptions/${rxId}/file?token=`);
  console.log("  4a. File access with empty token:", emptyTokenRes.status, "(Expected 401)");
  if (emptyTokenRes.status !== 401) throw new Error("Empty token was not rejected with 401!");

  // 4b. Authenticated request using Authorization header (how prescriptionService.getFile now works)
  const authedFileRes = await request(app)
    .get(`/api/prescriptions/${rxId}/file`)
    .set("Authorization", `Bearer ${custToken}`);
  console.log("  4b. Authenticated file access:", authedFileRes.status, "(Expected 200)");
  if (authedFileRes.status !== 200) throw new Error("Authenticated file access failed!");
  console.log("  ✔ File Content-Type:", authedFileRes.headers["content-type"]);

  // 4. Test Customer Persistent Tracking (/api/prescriptions/my)
  console.log("\n[5] Testing customer persistent prescription tracking endpoint...");
  const myRxRes = await request(app)
    .get("/api/prescriptions/my")
    .set("Authorization", `Bearer ${custToken}`);
  if (myRxRes.status !== 200) throw new Error("Failed to fetch customer prescriptions");
  const trackedRx = myRxRes.body.prescriptions.find((p) => p._id.toString() === rxId.toString());
  if (!trackedRx) throw new Error("Uploaded prescription not found in customer's list!");
  console.log("✔ Customer prescription successfully tracked:");
  console.log("  - Medicine ID:", trackedRx.medicineId);
  console.log("  - Medicine Name:", trackedRx.medicineName);
  console.log("  - Pharmacy:", trackedRx.pharmacyName, `(${trackedRx.pharmacyId})`);
  console.log("  - Status:", trackedRx.status, "(Expected 'pending')");
  console.log("  - Customer Notes:", trackedRx.customerNotes);

  // Filter by medicineId check
  const filteredRes = await request(app)
    .get("/api/prescriptions/my?medicineId=ecosprin-75-75mg")
    .set("Authorization", `Bearer ${custToken}`);
  if (filteredRes.status !== 200) throw new Error("Failed to filter by medicineId");
  const filteredMatch = filteredRes.body.prescriptions.find((p) => p._id.toString() === rxId.toString());
  if (!filteredMatch) throw new Error("Medicine ID filtering failed to match!");
  console.log("✔ Filter by medicineId verified successfully.");

  // 5. Test premature order request (before approval)
  console.log("\n[6] Testing order request before prescription approval...");
  const prematureOrderRes = await request(app)
    .post(`/api/prescriptions/${rxId}/order-request`)
    .set("Authorization", `Bearer ${custToken}`)
    .send({
      quantity: 1,
      paymentMethod: "cod",
      deliveryAddress: {
        fullName: "Test Customer",
        phone: "+91-9876543211",
        houseFlat: "12A",
        streetRoad: "Cross Cut Rd",
        area: "Gandhipuram",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641012",
      },
    });
  console.log("  Premature order request status:", prematureOrderRes.status, "(Expected 400)");
  if (prematureOrderRes.status !== 400) throw new Error("Premature order request was not blocked!");
  console.log("  ✔ Message:", prematureOrderRes.body.message);

  // 6. Pharmacy Owner reviews and approves prescription
  console.log("\n[7] Pharmacy Owner reviews and approves prescription...");
  const approveRes = await request(app)
    .patch(`/api/pharmacy-owner/prescriptions/${rxId}/review`)
    .set("Authorization", `Bearer ${pharmToken}`)
    .send({
      status: "approved",
      reviewNotes: "Prescription verified by pharmacist. Approved for 30 daily tablets.",
    });
  if (approveRes.status !== 200) throw new Error("Approval failed: " + JSON.stringify(approveRes.body));
  console.log("✔ Prescription approved successfully by pharmacy:", approveRes.body.message);

  // 7. Customer submits order request for approved prescription
  console.log("\n[8] Customer requests pharmacy fulfillment order for approved prescription...");
  const orderReqRes = await request(app)
    .post(`/api/prescriptions/${rxId}/order-request`)
    .set("Authorization", `Bearer ${custToken}`)
    .send({
      quantity: 2,
      paymentMethod: "cod",
      deliveryAddress: {
        fullName: "Nirmal Patient",
        phone: "+91-9876543211",
        houseFlat: "Apt 4B",
        streetRoad: "DB Road, RS Puram",
        area: "RS Puram",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641002",
      },
    });
  console.log("Order request status:", orderReqRes.status, "(Expected 201)");
  if (orderReqRes.status !== 201) throw new Error("Order request failed: " + JSON.stringify(orderReqRes.body));
  const createdOrder = orderReqRes.body.order;
  console.log("✔ Prescription order placed successfully!");
  console.log("  - Order ID:", createdOrder.orderId);
  console.log("  - Item:", createdOrder.items[0].medicineName, `(Qty: ${createdOrder.items[0].quantity})`);
  console.log("  - Prescription ID linked:", createdOrder.prescription);
  console.log("  - Total Amount: ₹" + createdOrder.totalAmount);

  // 8. Test duplicate order prevention
  console.log("\n[9] Testing duplicate order prevention on same prescription...");
  const duplicateOrderRes = await request(app)
    .post(`/api/prescriptions/${rxId}/order-request`)
    .set("Authorization", `Bearer ${custToken}`)
    .send({
      quantity: 1,
      paymentMethod: "cod",
      deliveryAddress: {
        fullName: "Test Customer",
        phone: "+91-9876543211",
        houseFlat: "12A",
        streetRoad: "Cross Cut Rd",
        area: "Gandhipuram",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641012",
      },
    });
  console.log("Duplicate order request status:", duplicateOrderRes.status, "(Expected 400)");
  if (duplicateOrderRes.status !== 400) throw new Error("Duplicate order was not blocked!");
  console.log("✔ Duplicate order blocked properly:", duplicateOrderRes.body.message);

  // 9. Verify direct OTC checkout still strictly blocks Rx medicine
  console.log("\n[10] Verifying direct OTC checkout still blocks prescription medicine...");
  const directOtcRes = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${custToken}`)
    .send({
      items: [
        {
          medicineId: "ecosprin-75-75mg",
          medicineName: "Ecosprin 75",
          genericName: "Aspirin",
          strength: "75mg",
          quantity: 1,
          unitPrice: 10,
          totalPrice: 10,
          otc: false, // Attempting Rx medicine via direct checkout
        },
      ],
      pharmacy: { id: pharmUser.pharmacyId },
      deliveryAddress: {
        fullName: "Test Customer",
        phone: "+91-9876543211",
        pincode: "641002",
      },
      paymentMethod: "cod",
    });
  console.log("Direct OTC checkout with Rx medicine status:", directOtcRes.status, "(Expected 400)");
  if (directOtcRes.status !== 400) throw new Error("Direct checkout allowed prescription medicine!");
  console.log("✔ Direct checkout blocked properly:", directOtcRes.body.message);

  // 10. Verify order appears in customer orders list
  console.log("\n[11] Verifying prescription order appears in customer's orders...");
  const userOrdersRes = await request(app)
    .get("/api/orders")
    .set("Authorization", `Bearer ${custToken}`);
  const foundOrder = userOrdersRes.body.orders.find((o) => o.id === createdOrder.orderId);
  if (!foundOrder) throw new Error("Order not found in customer orders list!");
  console.log("✔ Found order in customer's order list with ID:", foundOrder.id);
  console.log("  - Prescription reference in serialized order:", foundOrder.prescription);

  // Cleanup test artifacts
  await Order.deleteOne({ orderId: createdOrder.orderId });
  await Prescription.deleteOne({ _id: rxId });

  console.log("\n===============================================================");
  console.log("  ALL TESTS PASSED! TRACKING & ORDER FLOW 100% VERIFIED       ");
  console.log("===============================================================");

  await mongoose.disconnect();
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
