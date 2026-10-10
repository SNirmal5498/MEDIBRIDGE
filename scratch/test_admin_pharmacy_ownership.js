const API_BASE = "http://localhost:5000/api";

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runTests() {
  console.log("🚀 Starting MediBridge Admin Pharmacy Ownership & Approval E2E Verification Tests...\n");

  try {
    // 1. Authenticate as Admin
    console.log("Step 0: Logging in as Admin...");
    const adminLoginRes = await request(`${API_BASE}/auth/login`, {
      method: "POST",
      body: {
        email: "admin@medibridge.com",
        password: "admin123456",
      },
    });
    const adminToken = adminLoginRes.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    console.log("✅ Logged in as Admin successfully.");

    // Create 2 test users (User A and User B) to test assignment and safe reassignment
    const ts = Date.now().toString().slice(-4);
    const userAEmail = `owner_test_a_${ts}@medibridge.com`;
    const userBEmail = `owner_test_b_${ts}@medibridge.com`;
    const customerEmail = `cust_test_${ts}@medibridge.com`;

    console.log(`\nCreating Test Users: ${userAEmail}, ${userBEmail}, ${customerEmail}...`);
    await request(`${API_BASE}/auth/register`, {
      method: "POST",
      body: {
        name: "Owner User A",
        email: userAEmail,
        password: "password123",
        phone: "+91 99999 11111",
      },
    });
    const userALoginRes0 = await request(`${API_BASE}/auth/login`, {
      method: "POST",
      body: { email: userAEmail, password: "password123" },
    });
    const userA = userALoginRes0.user;

    await request(`${API_BASE}/auth/register`, {
      method: "POST",
      body: {
        name: "Owner User B",
        email: userBEmail,
        password: "password123",
        phone: "+91 99999 22222",
      },
    });
    const userBLoginRes0 = await request(`${API_BASE}/auth/login`, {
      method: "POST",
      body: { email: userBEmail, password: "password123" },
    });
    const userB = userBLoginRes0.user;

    await request(`${API_BASE}/auth/register`, {
      method: "POST",
      body: {
        name: "Customer User",
        email: customerEmail,
        password: "password123",
        phone: "+91 99999 33333",
      },
    });
    const custLoginRes0 = await request(`${API_BASE}/auth/login`, {
      method: "POST",
      body: { email: customerEmail, password: "password123" },
    });
    const custToken = custLoginRes0.token;
    const custHeaders = { Authorization: `Bearer ${custToken}` };
    console.log("✅ Created test user accounts successfully.");

    // Fetch list of pharmacies from admin
    const pharmListRes = await request(`${API_BASE}/admin/pharmacies`, { headers: adminHeaders });
    const pharmacies = pharmListRes.pharmacies;
    if (!pharmacies || pharmacies.length === 0) {
      throw new Error("No pharmacies found in database.");
    }
    const testPharm = pharmacies[0];
    console.log(`\nTarget Pharmacy for test: "${testPharm.name}" (${testPharm.id})`);

    // Test Step 1: Assign User A as Pharmacy Owner & Set Approval Status to Pending
    console.log("\n--- Test Step 1: Assign User A as Pharmacy Owner ---");
    const updateRes1 = await request(`${API_BASE}/admin/pharmacies/${testPharm.id}`, {
      method: "PUT",
      headers: adminHeaders,
      body: {
        name: testPharm.name,
        address: testPharm.address,
        phone: testPharm.phone,
        openingTime: testPharm.openingTime || "08:00 AM",
        closingTime: testPharm.closingTime || "10:00 PM",
        latitude: testPharm.latitude || 11.0168,
        longitude: testPharm.longitude || 76.9558,
        isOpen: true,
        deliveryAvailable: true,
        deliveryFee: testPharm.deliveryFee || 25,
        isActive: true,
        approvalStatus: "pending",
        ownerUserId: userA.id,
        licenseNumber: "LIC-TN-998877",
        responsiblePharmacist: "Dr. Owner A, B.Pharm",
      },
    });
    console.log("Update Response:", updateRes1.message);
    const updatedPharm1 = updateRes1.pharmacy;
    console.log(`Assigned Owner ID: ${updatedPharm1.owner?._id || updatedPharm1.owner}`);
    console.log(`Approval Status: ${updatedPharm1.approvalStatus}`);

    // Verify User A role is updated to 'pharmacy_owner' and pharmacyId set
    const userALoginRes = await request(`${API_BASE}/auth/login`, {
      method: "POST",
      body: {
        email: userAEmail,
        password: "password123",
      },
    });
    const tokenA = userALoginRes.token;
    const headersA = { Authorization: `Bearer ${tokenA}` };
    console.log(`User A role: ${userALoginRes.user.role}, pharmacyId: ${userALoginRes.user.pharmacyId}`);
    if (userALoginRes.user.role !== "pharmacy_owner" || userALoginRes.user.pharmacyId !== testPharm.id) {
      throw new Error("User A role/pharmacyId not updated correctly upon owner assignment!");
    }
    console.log("✅ Test Step 1 Passed: Owner assignment persisted to pharmacy & user model.");

    // Test Step 2: Approve the Pharmacy
    console.log("\n--- Test Step 2: Approve the Pharmacy ---");
    const updateRes2 = await request(`${API_BASE}/admin/pharmacies/${testPharm.id}`, {
      method: "PUT",
      headers: adminHeaders,
      body: {
        approvalStatus: "approved",
      },
    });
    console.log("Approve Response:", updateRes2.message);
    console.log(`Approval Status: ${updateRes2.pharmacy.approvalStatus}`);
    if (updateRes2.pharmacy.approvalStatus !== "approved") {
      throw new Error("Pharmacy approvalStatus was not updated to 'approved'!");
    }
    console.log("✅ Test Step 2 Passed: Pharmacy approved successfully.");

    // Test Step 3 & 4: Log in as assigned owner (User A) and access /pharmacy-owner endpoints
    console.log("\n--- Test Step 3 & 4: Pharmacy Owner Portal Access ---");
    const ownerProfileRes = await request(`${API_BASE}/pharmacy-owner/profile`, { headers: headersA });
    console.log(`Owner Portal Profile fetched for pharmacy: ${ownerProfileRes.pharmacy.name}`);
    if (ownerProfileRes.pharmacy.id !== testPharm.id) {
      throw new Error("Owner can access a pharmacy other than the assigned one!");
    }
    console.log("✅ Test Step 3 & 4 Passed: Owner can access and manage ONLY assigned pharmacy.");

    // Test Step 5: Safe Reassignment (Reassign from User A to User B)
    console.log("\n--- Test Step 5: Reassign Owner (User A -> User B) ---");
    const updateRes3 = await request(`${API_BASE}/admin/pharmacies/${testPharm.id}`, {
      method: "PUT",
      headers: adminHeaders,
      body: {
        ownerUserId: userB.id,
      },
    });
    console.log("Reassign Response:", updateRes3.message);

    // Verify User A role is reverted to 'user' and pharmacyId cleared
    const userAReloginRes = await request(`${API_BASE}/auth/login`, {
      method: "POST",
      body: {
        email: userAEmail,
        password: "password123",
      },
    });
    console.log(`User A (Previous Owner) role: ${userAReloginRes.user.role}, pharmacyId: '${userAReloginRes.user.pharmacyId}'`);
    if (userAReloginRes.user.role === "pharmacy_owner" || userAReloginRes.user.pharmacyId === testPharm.id) {
      throw new Error("Previous owner (User A) retained pharmacy_owner access after reassignment!");
    }

    // Verify User B is now pharmacy_owner
    const userBLoginRes = await request(`${API_BASE}/auth/login`, {
      method: "POST",
      body: {
        email: userBEmail,
        password: "password123",
      },
    });
    console.log(`User B (New Owner) role: ${userBLoginRes.user.role}, pharmacyId: '${userBLoginRes.user.pharmacyId}'`);
    if (userBLoginRes.user.role !== "pharmacy_owner" || userBLoginRes.user.pharmacyId !== testPharm.id) {
      throw new Error("New owner (User B) was not given pharmacy_owner role / pharmacyId!");
    }
    console.log("✅ Test Step 5 Passed: Reassignment handled safely. Previous owner lost access.");

    // Re-assign User B to testPharm and ensure User B cannot be assigned to another pharmacy
    console.log("\n--- Testing Incompatible Multiple Pharmacy Owner Assignment Guard ---");
    const pharmacies2 = (await request(`${API_BASE}/admin/pharmacies`, { headers: adminHeaders })).pharmacies;
    const testPharm2 = pharmacies2.find((p) => p.id !== testPharm.id);
    if (testPharm2) {
      try {
        await request(`${API_BASE}/admin/pharmacies/${testPharm2.id}`, {
          method: "PUT",
          headers: adminHeaders,
          body: { ownerUserId: userB.id },
        });
        throw new Error("Backend failed to block assigning one owner to multiple pharmacies!");
      } catch (err) {
        if (err.status === 400) {
          console.log("✅ Guard Verified: Blocked assigning User B to a second pharmacy (Status 400). Message:", err.message);
        } else {
          throw err;
        }
      }
    }

    // Test Step 6: Reject or Deactivate Pharmacy and verify orders are blocked
    console.log("\n--- Test Step 6: Reject / Deactivate Pharmacy Order Restriction ---");
    // Re-approve testPharm to test order placement failure on rejection
    await request(`${API_BASE}/admin/pharmacies/${testPharm.id}`, {
      method: "PUT",
      headers: adminHeaders,
      body: { approvalStatus: "rejected" },
    });
    console.log("Pharmacy status set to approvalStatus: 'rejected'. Trying customer order...");

    try {
      await request(`${API_BASE}/orders`, {
        method: "POST",
        headers: custHeaders,
        body: {
          items: [{ medicineId: "med-001", medicineName: "Paracetamol", quantity: 1, unitPrice: 30, otc: true }],
          pharmacy: { id: testPharm.id, name: testPharm.name },
          deliveryAddress: { fullName: "Test Cust", phone: "9876543210", pincode: "641001", street: "123 Main St", city: "CBE", state: "TN" },
          paymentMethod: "COD",
        },
      });
      throw new Error("Order succeeded for a REJECTED pharmacy! Should have failed!");
    } catch (err) {
      if (err.status === 400) {
        console.log("✅ Verified: Order creation correctly blocked for rejected pharmacy. Message:", err.message);
      } else {
        throw err;
      }
    }

    // Reset pharmacy back to approved for normal system operation
    await request(`${API_BASE}/admin/pharmacies/${testPharm.id}`, {
      method: "PUT",
      headers: adminHeaders,
      body: { approvalStatus: "approved" },
    });
    console.log("Reset pharmacy approvalStatus to 'approved'.");

    // Test Step 7: Confirm existing pharmacy editing still works
    console.log("\n--- Test Step 7: General Pharmacy Details Editing ---");
    const editRes = await request(`${API_BASE}/admin/pharmacies/${testPharm.id}`, {
      method: "PUT",
      headers: adminHeaders,
      body: {
        phone: "+91 98421 99999",
        deliveryFee: 35,
        isOpen: true,
        deliveryAvailable: true,
        isActive: true,
      },
    });
    if (editRes.pharmacy.phone !== "+91 98421 99999" || editRes.pharmacy.deliveryFee !== 35) {
      throw new Error("Standard pharmacy editing failed!");
    }
    console.log("✅ Test Step 7 Passed: Standard pharmacy editing works seamlessly.");

    console.log("\n🎉 ALL E2E VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉\n");
  } catch (err) {
    console.error("❌ Test Failed:", err.message, err.data || "");
    process.exit(1);
  }
}

runTests();
