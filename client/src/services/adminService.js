import api from "./api";

export const adminService = {
  async getOverview() {
    const response = await api.get("/admin/overview");
    return response.data;
  },

  async getUsers() {
    const response = await api.get("/admin/users");
    return response.data;
  },

  async updateUserStatus(id, accountStatus) {
    const response = await api.patch(`/admin/users/${id}/status`, { accountStatus });
    return response.data;
  },

  async addMedicine(medicineData) {
    const response = await api.post("/admin/medicines", medicineData);
    return response.data;
  },

  async updateMedicine(id, medicineData) {
    const response = await api.put(`/admin/medicines/${id}`, medicineData);
    return response.data;
  },

  async deleteMedicine(id) {
    const response = await api.delete(`/admin/medicines/${id}`);
    return response.data;
  },

  async getPharmacies() {
    const response = await api.get("/admin/pharmacies");
    return response.data;
  },

  async addPharmacy(pharmacyData) {
    const response = await api.post("/admin/pharmacies", pharmacyData);
    return response.data;
  },

  async updatePharmacy(id, pharmacyData) {
    const response = await api.put(`/admin/pharmacies/${id}`, pharmacyData);
    return response.data;
  },

  async deletePharmacy(id) {
    const response = await api.delete(`/admin/pharmacies/${id}`);
    return response.data;
  },

  async getInventory(includeInactive = false) {
    const response = await api.get(`/admin/inventory${includeInactive ? "?includeInactive=true" : ""}`);
    return response.data;
  },

  async updateInventory(data) {
    const response = await api.post("/admin/inventory", data);
    return response.data;
  },

  async getOrders() {
    const response = await api.get("/admin/orders");
    return response.data;
  },

  async updateOrderStatus(orderId, status) {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  async getPrescriptions() {
    const response = await api.get("/admin/prescriptions");
    return response.data;
  },

  async reviewPrescription(id, status, rejectionReason = "") {
    const response = await api.patch(`/prescriptions/${id}/review`, { status, rejectionReason });
    return response.data;
  },

  async getReviews() {
    const response = await api.get("/admin/reviews");
    return response.data;
  },

  async moderateReview(id, status) {
    const response = await api.patch(`/admin/reviews/${id}`, { status });
    return response.data;
  },

  async getAnalytics() {
    const response = await api.get("/admin/analytics");
    return response.data;
  },

  async getSettings() {
    const response = await api.get("/admin/settings");
    return response.data;
  },

  async updateSettings(settingsData) {
    const response = await api.put("/admin/settings", settingsData);
    return response.data;
  },

  async getAuditLogs() {
    const response = await api.get("/admin/audit-logs");
    return response.data;
  },

  async getSystemHealth() {
    const response = await api.get("/admin/system-health");
    return response.data;
  },
};

export default adminService;
