import api from "./api";

export const orderService = {
  async createOrder(orderData) {
    const { data } = await api.post("/orders", orderData);
    return data;
  },

  async getUserOrders() {
    const { data } = await api.get("/orders");
    return data;
  },

  async getOrderById(orderId) {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },

  async updateOrderStatus(orderId, status) {
    const { data } = await api.put(`/orders/${orderId}/status`, { status });
    return data;
  },
};
