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

  async getReviews(productId) {
    const response = await api.get(`/review/${productId}`);
    return response.data;
  },

  async submitReview(data) {
    const response = await api.post('/review', data);
    return response.data;
  },
};

export default productService;
