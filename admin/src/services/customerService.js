import api from './api';

export const customerService = {
  async getAll(page = 1, limit = 10) {
    const response = await api.get('/customers', { params: { page, limit } });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};

export default customerService;
