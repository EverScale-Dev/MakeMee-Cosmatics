import api from './api';

export const productService = {
  async getAll(options = {}) {
    // Options: { search, badge, featured, limit }
    const params = {};
    if (options.search) params.search = options.search;
    if (options.badge) params.badge = options.badge;
    if (options.featured) params.featured = options.featured;
    if (options.limit) params.limit = options.limit;

    const response = await api.get('/products', {
      params,
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.data;
  },

  async getFeatured(limit = 4) {
    return this.getAll({ featured: 'true', limit });
  },

  async getBestsellers(limit = 4) {
    return this.getAll({ badge: 'BEST SELLER', limit });
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
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
