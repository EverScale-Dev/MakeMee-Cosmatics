import api from './api';

export const orderService = {
  async getAll(limit = 10, skip = 0) {
    const response = await api.get('/orders', { params: { limit, skip } });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/orders/${id}`);
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
