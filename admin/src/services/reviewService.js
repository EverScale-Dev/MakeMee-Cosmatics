import api from './api';

export const reviewService = {
  async getAll() {
    const response = await api.get('/review/admin/all');
    return response.data;
  },

  async getByProduct(productId) {
    const response = await api.get(`/review/${productId}`);
    return response.data;
  },

  async approve(id) {
    const response = await api.put(`/review/admin/approve/${id}`);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/review/admin/delete/${id}`);
    return response.data;
  },
};

export default reviewService;
