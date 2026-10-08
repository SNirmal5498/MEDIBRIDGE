const path = require("path");
const serverDir = path.join(__dirname, "../server");
const axios = require(path.join(serverDir, "node_modules/axios"));

async function testAdminSecurity() {
  const baseUrl = "http://localhost:5000/api";

  console.log("=== TEST 9: ADMIN AUTHORIZATION SECURITY ===");

  // 1. Login Admin to get token
  const adminLogin = await axios.post(`${baseUrl}/auth/login`, {
    email: "admin@medibridge.com",
    password: "admin123456",
  });
  const adminToken = adminLogin.data.token;
  console.log("Admin login success. Role:", adminLogin.data.user.role);

  // 2. Login User to get token
  const userLogin = await axios.post(`${baseUrl}/auth/login`, {
    email: "user@medibridge.com",
    password: "user123456",
  });
  const userToken = userLogin.data.token;
  console.log("Normal User login success. Role:", userLogin.data.user.role);

  // TEST 9A: Access /api/admin/overview with NO token
  try {
    await axios.get(`${baseUrl}/admin/overview`);
    console.error("❌ Test 9A Failed: Expected 401 for No Token");
  } catch (err) {
    console.log("✅ Test 9A PASSED: No Token returned status:", err.response?.status, err.response?.data?.message);
  }

  // TEST 9B: Access /api/admin/overview with Normal User Token
  try {
    await axios.get(`${baseUrl}/admin/overview`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    console.error("❌ Test 9B Failed: Expected 403 for Normal User");
  } catch (err) {
    console.log("✅ Test 9B PASSED: Normal User Token returned status:", err.response?.status, err.response?.data?.message);
  }

  // TEST 9C: Access /api/admin/overview with Admin Token
  try {
    const res = await axios.get(`${baseUrl}/admin/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("✅ Test 9C PASSED: Admin Token returned status:", res.status, "Stats:", res.data.stats);
  } catch (err) {
    console.error("❌ Test 9C Failed for Admin Token:", err.message);
  }
}

testAdminSecurity().catch(console.error);
