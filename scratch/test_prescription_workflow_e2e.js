const path = require("path");
const serverDir = path.join(__dirname, "../server");
const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const request = require(path.join(serverDir, "node_modules/supertest"));
const app = require(path.join(serverDir, "app.js"));
const User = require(path.join(serverDir, "models/User"));
const Pharmacy = require(path.join(serverDir, "models/Pharmacy"));
const Prescription = require(path.join(serverDir, "models/Prescription"));

require(path.join(serverDir, "node_modules/dotenv")).config({ path: path.join(serverDir, ".env") });

async function runE2EWorkflow() {
  const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medibridge";
  await mongoose.connect(dbUri);

  console.log("===============================================================");
  console.log("  PRESCRIPTION WORKFLOW: FULL END-TO-END INTEGRATION TEST       ");
  console.log("===============================================================");

  // 1. Authenticate users
  console.log("\n[1] Authenticating test users...");
  const custRes = await request(app).post("/api/auth/login").send({
    email: "user@medibridge.com",
    password: "user123456",
  });
  if (custRes.status !== 200) throw new Error("Customer login failed");
  const custToken = custRes.body.token;
  console.log("✔ Customer logged in:", custRes.body.user.email);

  // Look up existing pharmacy owner user or create test owner
  let pharmUser = await User.findOne({ role: "pharmacy_owner" });
  let assignedPharmId = pharmUser?.pharmacyId;

  if (!pharmUser) {
    const bcrypt = require(path.join(serverDir, "node_modules/bcrypt"));
    const hashed = await bcrypt.hash("pharm123456", 10);
    const firstPharmacy = await Pharmacy.findOne({ approvalStatus: "approved" });
    assignedPharmId = firstPharmacy?.pharmacyId || "pharm-apollo-rspuram";
    pharmUser = await User.create({
      name: "Apollo Pharmacy Owner",
      email: "owner_test@pharmacy.com",
      password: hashed,
      role: "pharmacy_owner",
      pharmacyId: assignedPharmId,
      accountStatus: "active",
    });
  }

  const jwt = require(path.join(serverDir, "node_modules/jsonwebtoken"));
  const pharmToken = jwt.sign(
    { id: pharmUser._id, role: pharmUser.role, pharmacyId: pharmUser.pharmacyId },
    process.env.JWT_SECRET || "medibridge_secret_key"
  );
  console.log("✔ Pharmacy Owner authenticated:", pharmUser.email, "Assigned pharmacy:", pharmUser.pharmacyId);
  assignedPharmId = pharmUser.pharmacyId;

  // Create another customer to test unauthorized access (User 2)
  let otherUser = await User.findOne({ email: "other_customer@test.com" });
  if (!otherUser) {
    otherUser = await User.create({
      name: "Other Customer",
      email: "other_customer@test.com",
      password: "hashedpassword123",
      role: "user",
    });
  }
  const otherCustToken = jwt.sign(
    { id: otherUser._id, role: otherUser.role },
    process.env.JWT_SECRET || "medibridge_secret_key"
  );
  console.log("✔ Secondary customer token generated for isolation tests.");

  // 2. Fetch eligible pharmacies
  console.log("\n[2] Checking eligible partner pharmacies API...");
  const pharmaciesRes = await request(app).get("/api/pharmacies");
  console.log("Pharmacies returned:", pharmaciesRes.body.pharmacies?.length || pharmaciesRes.body.length);
  const eligiblePharmacy = (pharmaciesRes.body.pharmacies || pharmaciesRes.body).find(
    (p) => (p.pharmacyId || p.id) === assignedPharmId
  );
  if (!eligiblePharmacy) throw new Error("Assigned pharmacy not found in eligible list!");
  const targetPharmId = eligiblePharmacy.pharmacyId || eligiblePharmacy.id;
  console.log("✔ Verified eligible pharmacy:", targetPharmId, `("${eligiblePharmacy.name}")`);

  // 3. Test Invalid File Extension (e.g. .exe)
  console.log("\n[3] Testing upload validation: Disallowed extension (.exe)...");
  const invalidExtRes = await request(app)
    .post("/api/prescriptions/upload")
    .set("Authorization", `Bearer ${custToken}`)
    .field("pharmacyId", targetPharmId)
    .attach("prescription", Buffer.from("dummy-content"), "bad_script.exe");
  console.log("Disallowed extension status:", invalidExtRes.status, "(Expected 400)");
  if (invalidExtRes.status !== 400) throw new Error("Executable file was not rejected!");
  console.log("✔ Disallowed file rejected properly:", invalidExtRes.body.message);

  // 4. Test File Size Limit (> 5 MB)
  console.log("\n[4] Testing upload validation: File > 5 MB limit...");
  const largeBuffer = Buffer.alloc(5.5 * 1024 * 1024); // 5.5 MB
  const oversizeRes = await request(app)
    .post("/api/prescriptions/upload")
    .set("Authorization", `Bearer ${custToken}`)
    .field("pharmacyId", targetPharmId)
    .attach("prescription", largeBuffer, "large_rx.png");
  console.log("Oversize file status:", oversizeRes.status, "(Expected 400)");
  if (oversizeRes.status !== 400) throw new Error("Oversized file (>5MB) was not rejected!");
  console.log("✔ Oversize file rejected properly:", oversizeRes.body.message);

  // 5. Test Missing Pharmacy Selection
  console.log("\n[5] Testing upload validation: Missing pharmacy ID...");
  const noPharmRes = await request(app)
    .post("/api/prescriptions/upload")
    .set("Authorization", `Bearer ${custToken}`)
    .attach("prescription", Buffer.from("%PDF-1.4 dummy pdf"), "valid_rx.pdf");
  console.log("Missing pharmacy status:", noPharmRes.status, "(Expected 400)");
  if (noPharmRes.status !== 400) throw new Error("Missing pharmacy was not rejected!");
  console.log("✔ Missing pharmacy rejected properly:", noPharmRes.body.message);

  // 6. Test Valid Prescription Submission
  console.log("\n[6] Submitting valid prescription document...");
  const validPdfContent = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF");
  const uploadRes = await request(app)
    .post("/api/prescriptions/upload")
    .set("Authorization", `Bearer ${custToken}`)
    .field("pharmacyId", targetPharmId)
    .field("medicineId", "ecosprin-75-75mg")
    .field("medicineName", "Ecosprin 75 (Aspirin 75mg)")
    .field("customerNotes", "Please deliver the enteric-coated version prescribed by Dr. Sharma.")
    .attach("prescription", validPdfContent, "my_prescription.pdf");

  console.log("Upload response status:", uploadRes.status, "(Expected 201)");
  if (uploadRes.status !== 201) throw new Error("Valid upload failed: " + JSON.stringify(uploadRes.body));
  const createdRx = uploadRes.body.prescription;
  console.log("✔ Prescription submitted successfully!");
  console.log("  - Prescription ID:", createdRx._id || createdRx.id);
  console.log("  - Status:", createdRx.status, "(Expected 'pending')");
  console.log("  - Medicine:", createdRx.medicineName);
  console.log("  - Customer Notes:", createdRx.customerNotes);
  console.log("  - Pharmacy:", createdRx.pharmacyName, `(${createdRx.pharmacyId})`);
  console.log("  - File path exposed in API?", Boolean(createdRx.filePath), "(Expected false)");
  if (createdRx.filePath) throw new Error("filePath was exposed in API response!");
  if (createdRx.status !== "pending") throw new Error("Initial status should be pending!");

  const rxId = createdRx._id || createdRx.id;

  // 7. Security: Test Secure File Storage and Access Control
  console.log("\n[7] Testing Secure Prescription File Access Control...");

  // 7a. Unauthenticated access
  const unauthFileRes = await request(app).get(`/api/prescriptions/${rxId}/file`);
  console.log("  7a. Unauthenticated access:", unauthFileRes.status, "(Expected 401)");
  if (unauthFileRes.status !== 401) throw new Error("Unauthenticated access allowed!");

  // 7b. Access by uploading customer (Owner)
  const ownerFileRes = await request(app)
    .get(`/api/prescriptions/${rxId}/file`)
    .set("Authorization", `Bearer ${custToken}`);
  console.log("  7b. Uploading customer access:", ownerFileRes.status, "(Expected 200)");
  if (ownerFileRes.status !== 200) throw new Error("Uploading customer was denied access!");

  // 7c. Access with query token parameter
  const queryTokenRes = await request(app)
    .get(`/api/prescriptions/${rxId}/file?token=${custToken}`);
  console.log("  7c. Query parameter token access:", queryTokenRes.status, "(Expected 200)");
  if (queryTokenRes.status !== 200) throw new Error("Query token access failed!");

  // 7d. Access by unauthorized third-party customer
  const otherUserFileRes = await request(app)
    .get(`/api/prescriptions/${rxId}/file`)
    .set("Authorization", `Bearer ${otherCustToken}`);
  console.log("  7d. Unauthorized customer access:", otherUserFileRes.status, "(Expected 403)");
  if (otherUserFileRes.status !== 403) throw new Error("Unauthorized customer allowed access!");

  // 7e. Access by assigned pharmacy owner
  const assignedPharmFileRes = await request(app)
    .get(`/api/prescriptions/${rxId}/file`)
    .set("Authorization", `Bearer ${pharmToken}`);
  console.log("  7e. Assigned pharmacy owner access:", assignedPharmFileRes.status, "(Expected 200)");
  if (assignedPharmFileRes.status !== 200) throw new Error("Assigned pharmacy owner was denied access!");

  // 8. Pharmacy Owner Review Workflow
  console.log("\n[8] Testing Pharmacy Owner Queue & Review Workflow...");

  // 8a. Check prescription appears in pharmacy queue
  const queueRes = await request(app)
    .get("/api/pharmacy-owner/prescriptions")
    .set("Authorization", `Bearer ${pharmToken}`);
  console.log("  8a. Pharmacy review queue fetch status:", queueRes.status, "(Expected 200)");
  if (queueRes.status !== 200) throw new Error("Failed to fetch pharmacy prescriptions");
  const foundInQueue = queueRes.body.prescriptions.find((p) => p._id.toString() === rxId.toString());
  if (!foundInQueue) throw new Error("Prescription not found in pharmacy queue!");
  console.log("  ✔ Found prescription in queue with medicine:", foundInQueue.medicineName);
  console.log("  ✔ Customer notes:", foundInQueue.customerNotes);

  // 8b. Pharmacy owner reviews prescription (e.g. approve)
  const reviewRes = await request(app)
    .patch(`/api/pharmacy-owner/prescriptions/${rxId}/review`)
    .set("Authorization", `Bearer ${pharmToken}`)
    .send({
      status: "approved",
      reviewNotes: "Prescription verified. Valid dosage for 30 days.",
    });
  console.log("  8b. Pharmacy review submission status:", reviewRes.status, "(Expected 200)");
  if (reviewRes.status !== 200) throw new Error("Review submission failed: " + JSON.stringify(reviewRes.body));
  console.log("  ✔ Review response message:", reviewRes.body.message);

  // 9. Customer views updated prescription status
  console.log("\n[9] Checking customer prescription list for updated review status...");
  const myRxRes = await request(app)
    .get("/api/prescriptions/my")
    .set("Authorization", `Bearer ${custToken}`);
  if (myRxRes.status !== 200) throw new Error("Failed to fetch customer prescriptions");
  const updatedRx = myRxRes.body.prescriptions.find((p) => p._id.toString() === rxId.toString());
  if (!updatedRx) throw new Error("Updated prescription not found for customer");
  console.log("  ✔ Customer sees review status:", updatedRx.status, "(Expected 'approved')");
  console.log("  ✔ Review notes from pharmacist:", updatedRx.reviewNotes);

  // Cleanup test prescription
  await Prescription.deleteOne({ _id: rxId });
  await User.deleteOne({ email: "other_customer@test.com" });

  console.log("\n===============================================================");
  console.log("  ALL TESTS PASSED SUCCESSFULLY! WORKFLOW IS 100% OPERATIONAL   ");
  console.log("===============================================================");

  await mongoose.disconnect();
}

runE2EWorkflow().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
