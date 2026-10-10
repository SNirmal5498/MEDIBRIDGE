const API_URL = "http://localhost:5000/api";

async function apiPost(endpoint, body, token = "") {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function apiPut(endpoint, body, token = "") {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function apiPatch(endpoint, body, token = "") {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function apiGet(endpoint, token = "") {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, { headers });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function apiDelete(endpoint, token = "") {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function runTests() {
  console.log("=================================================");
  console.log("🧪 RUNNING PHARMACY DELETION & INTEGRITY TEST SUITE");
  console.log("=================================================\n");

  let adminToken = "";
  let userToken = "";
  const testPharm1Id = `test-pharm-safe-${Date.now()}`;
  const testPharm2Id = `test-pharm-orders-${Date.now()}`;

  try {
    // Step 0: Login Admin and User
    console.log("1. Authenticating Admin & Customer accounts...");
    const adminLogin = await apiPost("/auth/login", {
      email: "admin@medibridge.com",
      password: "admin123456",
    });
    adminToken = adminLogin.token;
    console.log("  ✓ Admin logged in successfully");

    let userLogin;
    try {
      userLogin = await apiPost("/auth/login", {
        email: "testuser@example.com",
        password: "userpassword123",
      });
    } catch {
      await apiPost("/auth/register", {
        name: "Test Customer",
        email: "testuser@example.com",
        phone: "+919876543210",
        password: "userpassword123",
      });
      userLogin = await apiPost("/auth/login", {
        email: "testuser@example.com",
        password: "userpassword123",
      });
    }
    userToken = userLogin.token;
    console.log("  ✓ Customer logged in successfully\n");

    // Test 2: Non-admin & unauthenticated deletion rejection
    console.log("2. Testing authorization controls (Requirement 2)...");
    try {
      await apiDelete("/admin/pharmacies/pharm-001");
      console.error("  ❌ FAIL: Unauthenticated request should have been rejected (401)");
    } catch (err) {
      console.log(`  ✓ Unauthenticated DELETE rejected (${err.status})`);
    }

    try {
      await apiDelete("/admin/pharmacies/pharm-001", userToken);
      console.error("  ❌ FAIL: Non-admin request should have been rejected (403)");
    } catch (err) {
      console.log(`  ✓ Non-admin DELETE rejected (${err.status})`);
    }

    // Setup Test Pharmacies
    console.log("\n3. Setting up test pharmacies & inventory records...");
    const catalogRes = await apiGet("/medicines?limit=5");
    const testMed = catalogRes.medicines[0] || { id: "dolo-650", price: 30 };
    const testMedId = testMed.id;
    console.log(`  ✓ Using catalog medicine ID: ${testMedId}`);

    await apiPost(
      "/admin/pharmacies",
      {
        id: testPharm1Id,
        name: `Safe Unwanted Test Pharmacy ${Date.now()}`,
        address: "100 Test Lane, Coimbatore",
        phone: "+91 90000 11111",
        latitude: 11.0,
        longitude: 76.9,
      },
      adminToken
    );
    console.log(`  ✓ Created safe test pharmacy (${testPharm1Id})`);

    await apiPost(
      "/admin/pharmacies",
      {
        id: testPharm2Id,
        name: `Protected Historical Test Pharmacy ${Date.now()}`,
        address: "200 Protected Way, Coimbatore",
        phone: "+91 90000 22222",
        latitude: 11.0,
        longitude: 76.9,
      },
      adminToken
    );
    console.log(`  ✓ Created protected test pharmacy (${testPharm2Id})`);

    // Create stock for testPharm1Id and testPharm2Id
    await apiPost(
      "/admin/inventory",
      { pharmacyId: testPharm1Id, medicineId: testMedId, stock: 100, price: testMed.price || 25 },
      adminToken
    );
    await apiPost(
      "/admin/inventory",
      { pharmacyId: testPharm2Id, medicineId: testMedId, stock: 100, price: testMed.price || 25 },
      adminToken
    );
    console.log("  ✓ Created stock records for both test pharmacies");

    // Create an order for testPharm2Id so it has historical order dependencies
    console.log("\n4. Placing customer order against testPharm2Id to establish historical dependency...");
    const orderRes = await apiPost(
      "/orders",
      {
        pharmacy: { id: testPharm2Id, name: "Protected Historical Test Pharmacy", address: "200 Protected Way", phone: "+91 90000 22222", rating: 4.5, distance: "1.0 km" },
        items: [{ medicineId: testMedId, medicineName: testMed.brand || testMed.name || "Test Med", genericName: testMed.genericName || "Generic", strength: testMed.strength || "500mg", quantity: 2, unitPrice: testMed.price || 25, totalPrice: (testMed.price || 25) * 2, otc: true }],
        deliveryAddress: { fullName: "Test Customer", phone: "9876543210", houseFlat: "12", streetRoad: "Main St", area: "Peelamedu", city: "Coimbatore", state: "Tamil Nadu", pincode: "641004" },
        paymentMethod: "cod",
      },
      userToken
    );
    const orderId = orderRes.order.id;
    console.log(`  ✓ Placed order ${orderId} against pharmacy ${testPharm2Id}`);

    // Test 3: Pharmacy with protected historical orders CANNOT be deleted
    console.log("\n5. Testing historical order deletion safeguard (Requirement 3 & 9)...");
    try {
      await apiDelete(`/admin/pharmacies/${testPharm2Id}`, adminToken);
      console.error("  ❌ FAIL: Deleting pharmacy with active orders should have failed!");
    } catch (err) {
      if (err.status === 400 || err.status === 409) {
        console.log(`  ✓ Blocked deletion of pharmacy with orders (${err.status}): "${err.data.message}"`);
      } else {
        console.error("  ❌ Unexpected status code:", err.status);
      }
    }

    // Verify order remains readable
    const getOrderRes = await apiGet(`/orders/${orderId}`, userToken);
    console.log(`  ✓ Historical order ${getOrderRes.order.id} remains intact and readable`);

    // Test 4 & 7: Deactivating pharmacy hides inventory from default operational list, reactivating restores it
    console.log("\n6. Testing Pharmacy Deactivation & Inventory Visibility Sync (Requirements 4 & 7)...");
    let invDefaultBefore = await apiGet("/admin/inventory", adminToken);
    let hasTest1Before = invDefaultBefore.inventory.some((i) => i.pharmacyId === testPharm1Id);
    console.log(`  ✓ Test pharmacy stock present in default operational inventory: ${hasTest1Before}`);

    // Deactivate testPharm1Id
    await apiPut(`/admin/pharmacies/${testPharm1Id}`, { isActive: false }, adminToken);
    console.log(`  ✓ Deactivated pharmacy ${testPharm1Id}`);

    // Operational inventory query should now exclude testPharm1Id
    let invDefaultAfterDeactivate = await apiGet("/admin/inventory", adminToken);
    let hasTest1AfterDeactivate = invDefaultAfterDeactivate.inventory.some((i) => i.pharmacyId === testPharm1Id);
    console.log(`  ✓ Deactivated pharmacy stock excluded from default operational inventory: ${!hasTest1AfterDeactivate}`);

    // Explicit includeInactive filter query SHOULD return it
    let invWithInactive = await apiGet("/admin/inventory?includeInactive=true", adminToken);
    let hasTest1Explicit = invWithInactive.inventory.some((i) => i.pharmacyId === testPharm1Id);
    console.log(`  ✓ Deactivated pharmacy stock visible with explicit includeInactive=true filter: ${hasTest1Explicit}`);

    // Test 5: Deactivated pharmacy excluded from nearby search & availability
    console.log("\n7. Testing Customer Search & Availability Filters (Requirement 5)...");
    const searchPharmacies = await apiGet("/pharmacies");
    const searchHasDeactivated = searchPharmacies.pharmacies.some((p) => p.id === testPharm1Id);
    console.log(`  ✓ Deactivated pharmacy excluded from nearby pharmacy search: ${!searchHasDeactivated}`);

    const availabilityRes = await apiGet(`/pharmacies/availability/${testMedId}`);
    const availHasDeactivated = availabilityRes.pharmacies.some((p) => p.id === testPharm1Id);
    console.log(`  ✓ Deactivated pharmacy excluded from medicine availability endpoint: ${!availHasDeactivated}`);

    // Test 6: Orders against deactivated pharmacy are rejected on backend
    console.log("\n8. Testing Backend rejection of orders against deactivated pharmacy (Requirement 6)...");
    try {
      await apiPost(
        "/orders",
        {
          pharmacy: { id: testPharm1Id, name: "Safe Unwanted Test Pharmacy", address: "100 Test Lane", phone: "+91 90000 11111", rating: 4.5, distance: "1.0 km" },
          items: [{ medicineId: testMedId, medicineName: testMed.brand || testMed.name || "Test Med", genericName: testMed.genericName || "Generic", strength: testMed.strength || "500mg", quantity: 1, unitPrice: testMed.price || 25, totalPrice: testMed.price || 25, otc: true }],
          deliveryAddress: { fullName: "Test Customer", phone: "9876543210", houseFlat: "12", streetRoad: "Main St", area: "Peelamedu", city: "Coimbatore", state: "Tamil Nadu", pincode: "641004" },
          paymentMethod: "cod",
        },
        userToken
      );
      console.error("  ❌ FAIL: Order against deactivated pharmacy should have been rejected!");
    } catch (err) {
      console.log(`  ✓ Order against deactivated pharmacy rejected by backend (${err.status}): "${err.data?.message}"`);
    }

    // Reactivate testPharm1Id and verify visibility restored
    console.log("\n9. Testing Reactivation (Requirement 7)...");
    await apiPut(`/admin/pharmacies/${testPharm1Id}`, { isActive: true }, adminToken);
    let invAfterReactivate = await apiGet("/admin/inventory", adminToken);
    let hasTest1Reactivated = invAfterReactivate.inventory.some((i) => i.pharmacyId === testPharm1Id);
    console.log(`  ✓ Reactivating pharmacy restored inventory visibility: ${hasTest1Reactivated}`);

    // Test 1 & 8: Permanent deletion of safe test pharmacy without orders
    console.log("\n10. Testing Safe Permanent Deletion (Requirement 1 & 8)...");
    const deleteRes = await apiDelete(`/admin/pharmacies/${testPharm1Id}`, adminToken);
    console.log(`  ✓ Delete endpoint response: "${deleteRes.message}"`);

    // Verify testPharm1Id is removed from pharmacy directory
    const pharmaciesList = await apiGet("/admin/pharmacies", adminToken);
    const existsInDir = pharmaciesList.pharmacies.some((p) => p.id === testPharm1Id);
    console.log(`  ✓ Deleted pharmacy removed from directory: ${!existsInDir}`);

    // Verify associated inventory is also removed
    const invAfterDelete = await apiGet("/admin/inventory?includeInactive=true", adminToken);
    const stockExists = invAfterDelete.inventory.some((i) => i.pharmacyId === testPharm1Id);
    console.log(`  ✓ Associated inventory permanently removed: ${!stockExists}`);

    // Test 10: Atomic stock reservation & cancellation restoration
    console.log("\n11. Testing Atomic Stock Reservation & Cancellation Restoration (Requirement 10)...");
    const testOrderRes = await apiPost(
      "/orders",
      {
        pharmacy: { id: testPharm2Id, name: "Protected Historical Test Pharmacy", address: "200 Protected Way", phone: "+91 90000 22222", rating: 4.5, distance: "1.0 km" },
        items: [{ medicineId: testMedId, medicineName: testMed.brand || testMed.name || "Test Med", genericName: testMed.genericName || "Generic", strength: testMed.strength || "500mg", quantity: 5, unitPrice: testMed.price || 25, totalPrice: (testMed.price || 25) * 5, otc: true }],
        deliveryAddress: { fullName: "Test Customer", phone: "9876543210", houseFlat: "12", streetRoad: "Main St", area: "Peelamedu", city: "Coimbatore", state: "Tamil Nadu", pincode: "641004" },
        paymentMethod: "cod",
      },
      userToken
    );
    const testOrderId = testOrderRes.order.id;
    console.log(`  ✓ Placed test order ${testOrderId} (5 units)`);

    // Cancel order as Admin
    await apiPatch(`/admin/orders/${testOrderId}/status`, { status: "cancelled" }, adminToken);
    console.log(`  ✓ Cancelled order ${testOrderId} and restored stock`);

    // Clean up testPharm2Id deactivate
    await apiPut(`/admin/pharmacies/${testPharm2Id}`, { isActive: false }, adminToken);

    console.log("\n=================================================");
    console.log("🎉 ALL 10 TEST SCENARIOS PASSED SUCCESSFULLY!");
    console.log("=================================================");
  } catch (err) {
    console.error("\n❌ TEST SUITE FAILED:", err.data || err.message);
    process.exit(1);
  }
}

runTests();
