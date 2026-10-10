import api from "./api";

export const pharmacyOwnerService = {
  async getProfile() {
    const response = await api.get("/pharmacy-owner/profile");
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put("/pharmacy-owner/profile", profileData);
    return response.data;
  },

  async getInventory() {
    const response = await api.get("/pharmacy-owner/inventory");
    return response.data;
  },

  async addOrUpdateInventory(inventoryData) {
    const response = await api.post("/pharmacy-owner/inventory", inventoryData);
    return response.data;
  },

  async adjustStockAndPrice(data) {
    const response = await api.patch("/pharmacy-owner/inventory/adjust", data);
    return response.data;
  },

  async getInventoryAuditLogs() {
    const response = await api.get("/pharmacy-owner/inventory/audit-logs");
    return response.data;
  },

  async getOrders() {
    const response = await api.get("/pharmacy-owner/orders");
    return response.data;
  },

  async updateOrderStatus(orderId, status) {
    const response = await api.patch(`/pharmacy-owner/orders/${orderId}/status`, { status });
    return response.data;
  },

  async getPrescriptions() {
    const response = await api.get("/pharmacy-owner/prescriptions");
    return response.data;
  },

  async reviewPrescription(id, reviewData) {
    const response = await api.patch(`/pharmacy-owner/prescriptions/${id}/review`, reviewData);
    return response.data;
  },

  async submitCatalogMedicine(medicineData) {
    const response = await api.post("/pharmacy-owner/catalog-submissions", medicineData);
    return response.data;
  },

  async getStaff() {
    const response = await api.get("/pharmacy-owner/staff");
    return response.data;
  },

  async addStaff(staffData) {
    const response = await api.post("/pharmacy-owner/staff", staffData);
    return response.data;
  },

  async updateStaffPermissions(staffId, data) {
    const response = await api.patch(`/pharmacy-owner/staff/${staffId}`, data);
    return response.data;
  },
};

export default pharmacyOwnerService;
