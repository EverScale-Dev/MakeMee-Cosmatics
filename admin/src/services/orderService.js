import api from './api';

export const orderService = {
  async getAll(page = 1, itemsPerPage = 10) {
    const skip = (page - 1) * itemsPerPage;
    const response = await api.get('/orders', { params: { limit: itemsPerPage, skip } });
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
