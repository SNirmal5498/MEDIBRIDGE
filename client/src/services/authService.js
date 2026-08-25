import api from "./api";

export const authService = {
  async register({ name, email, password }) {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data;
  },

  async login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },

  async getProfile() {
    const { data } = await api.get("/auth/profile");
    return data;
  },

  async updateProfile(payload) {
    const { data } = await api.put("/auth/profile", payload);
    return data;
  },

  async changePassword({ currentPassword, newPassword }) {
    const { data } = await api.put("/auth/password", { currentPassword, newPassword });
    return data;
  },

  async deleteAccount() {
    const { data } = await api.delete("/auth/account");
    return data;
  },
};
