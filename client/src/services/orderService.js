import api from './api';

export const orderService = {
  async create(data) {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async getMyOrders() {
    const response = await api.get('/orders/my');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async trackOrder(orderId) {
    const response = await api.get(`/shiprocket/track/${orderId}`);
    return response.data;
  },

  async getShipmentStatus(orderId) {
    const response = await api.get(`/shiprocket/status/${orderId}`);
    return response.data;
  },

  async generateInvoice(orderId) {
    const response = await api.post('/orders/generate-invoice', { orderId });
    return response.data;
  },

  async downloadInvoice(orderId) {
    const response = await api.get(`/orders/${orderId}/download-invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default orderService;
