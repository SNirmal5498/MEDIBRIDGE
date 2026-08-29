import api from "./api";

export const medicineService = {
  /**
   * Search and filter medicines with pagination
   * @param {Object|string} params Query string or params object { q, search, page, limit, category, filter, sort, manufacturer }
   */
  async search(params) {
    const queryParams = typeof params === "string" ? { q: params } : params;
    const { data } = await api.get("/medicines", { params: queryParams });
    return data;
  },

  /**
   * Get medicine by ID or slug
   * @param {string} id
   */
  async getById(id) {
    const { data } = await api.get(`/medicines/${id}`);
    return data;
  },

  /**
   * Get generic alternatives for a medicine
   * @param {string} id
   */
  async getAlternatives(id) {
    const { data } = await api.get(`/medicines/${id}/alternatives`);
    return data;
  },

  /**
   * Get popular medicines
   * @param {number} limit
   */
  async getPopular(limit = 4) {
    const { data } = await api.get("/medicines/popular", { params: { limit } });
    return data;
  },

  /**
   * Get list of categories with active medicine counts
   */
  async getCategories() {
    const { data } = await api.get("/medicines/categories");
    return data;
  },

  /**
   * Compare two medicines
   * @param {string} idA
   * @param {string} idB
   */
  async compare(idA, idB) {
    const { data } = await api.get("/medicines/compare", { params: { a: idA, b: idB } });
    return data;
  },
};

export default medicineService;