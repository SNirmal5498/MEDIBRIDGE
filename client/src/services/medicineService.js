import api from "./api";

export const medicineService = {
  /**
   * Search and filter medicines with pagination
   * @param {Object|string} params Query string or params object { q, search, page, limit, category, filter, sort, manufacturer }
   */
  async search(params) {
    const queryParams = typeof params === "string" ? { q: params } : params;
    const response = await api.get("/medicines", { params: queryParams });
    const data = response.data || {};
    return {
      medicines: data.medicines || [],
      pagination: data.pagination || {
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        limit: data.limit || 12,
      },
      data: data.medicines || [],
    };
  },

  /**
   * Get medicine by ID or slug
   * @param {string} id
   */
  async getById(id) {
    const response = await api.get(`/medicines/${id}`);
    const data = response.data || {};
    return {
      medicine: data.medicine || data,
      data: data.medicine || data,
    };
  },

  /**
   * Get generic alternatives for a medicine
   * @param {string} id
   */
  async getAlternatives(id) {
    const response = await api.get(`/medicines/${id}/alternatives`);
    const data = response.data || {};
    return {
      alternatives: data.alternatives || [],
      data: data.alternatives || [],
    };
  },

  /**
   * Get popular medicines
   * @param {number} limit
   */
  async getPopular(limit = 4) {
    const response = await api.get("/medicines/popular", { params: { limit } });
    const data = response.data || {};
    return {
      medicines: data.medicines || [],
      data: data.medicines || [],
    };
  },

  /**
   * Get list of categories with active medicine counts
   */
  async getCategories() {
    const response = await api.get("/medicines/categories");
    const data = response.data || {};
    return {
      categories: data.categories || [],
      data: data.categories || [],
    };
  },

  /**
   * Compare two medicines
   * @param {string} idA
   * @param {string} idB
   */
  async compare(idA, idB) {
    const response = await api.get("/medicines/compare", { params: { a: idA, b: idB } });
    const data = response.data || {};
    return {
      medicines: data.medicines || [],
      data: data.medicines || [],
    };
  },
};

export default medicineService;