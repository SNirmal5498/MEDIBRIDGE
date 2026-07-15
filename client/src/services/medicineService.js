import api from "./api";

// Real endpoints for when the backend is live. The Medicine page currently
// reads from utils/constants.js (mock data) — swap those calls for these
// once /api/medicines exists, the shape below is what the UI already expects.
export const medicineService = {
  async search(query) {
    const { data } = await api.get("/medicines", { params: { q: query } });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/medicines/${id}`);
    return data;
  },

  async getAlternatives(id) {
    const { data } = await api.get(`/medicines/${id}/alternatives`);
    return data;
  },
};