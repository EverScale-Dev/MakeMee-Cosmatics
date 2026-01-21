import api from './api';

export const productService = {
  async getAll(search = '') {
    const params = search ? { search } : {};
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async create(formData) {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async update(id, formData) {
    const response = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
