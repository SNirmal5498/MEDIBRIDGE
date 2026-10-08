import api from "./api";

export const medicineService = {
  /**
   * Search and filter medicines with pagination
   * @param {Object|string} params Query string or params object { q, search, page, limit, category, filter, sort, manufacturer, lang }
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
   * @param {string} lang
   */
  async getById(id, lang = "en") {
    const response = await api.get(`/medicines/${id}`, { params: { lang } });
    const data = response.data || {};
    return {
      medicine: data.medicine || data,
      data: data.medicine || data,
    };
  },

  /**
   * Get generic alternatives for a medicine
   * @param {string} id
   * @param {string} lang
   */
  async getAlternatives(id, lang = "en") {
    const response = await api.get(`/medicines/${id}/alternatives`, { params: { lang } });
    const data = response.data || {};
    return {
      alternatives: data.alternatives || [],
      data: data.alternatives || [],
    };
  },

  /**
   * Get popular medicines
   * @param {number} limit
   * @param {string} lang
   */
  async getPopular(limit = 4, lang = "en") {
    const response = await api.get("/medicines/popular", { params: { limit, lang } });
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
   * @param {string} lang
   */
  async compare(idA, idB, lang = "en") {
    const response = await api.get("/medicines/compare", { params: { a: idA, b: idB, lang } });
    const data = response.data || {};
    return {
      medicines: data.medicines || [],
      data: data.medicines || [],
    };
  },
};

export default medicineService;