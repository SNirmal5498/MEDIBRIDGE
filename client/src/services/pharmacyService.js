import api from "./api";

export const pharmacyService = {
  /**
   * Get list of pharmacies with search, filter, sort, lat, lng
   */
  async getPharmacies(params = {}) {
    const response = await api.get("/pharmacies", { params });
    const data = response.data || {};
    return {
      pharmacies: data.pharmacies || [],
      data: data.pharmacies || [],
    };
  },

  /**
   * Get pharmacy details by ID
   */
  async getById(id) {
    const response = await api.get(`/pharmacies/${id}`);
    const data = response.data || {};
    return {
      pharmacy: data.pharmacy || data,
      data: data.pharmacy || data,
    };
  },

  /**
   * Get pharmacy inventory by pharmacy ID
   */
  async getInventory(id) {
    const response = await api.get(`/pharmacies/${id}/inventory`);
    const data = response.data || {};
    return {
      inventory: data.inventory || [],
      data: data.inventory || [],
    };
  },

  /**
   * Get availability of a medicine across pharmacies
   */
  async getMedicineAvailability(medicineId, params = {}) {
    const response = await api.get(`/pharmacies/availability/${medicineId}`, { params });
    const data = response.data || {};
    return {
      medicine: data.medicine || null,
      pharmacies: data.pharmacies || [],
      data: data.pharmacies || [],
    };
  },
};

export default pharmacyService;
