import api from './api';

export const cartService = {
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async mergeCart(guestCart) {
    const response = await api.post('/cart/merge', { guestCart });
    return response.data;
  },

  async syncCart(items) {
    const response = await api.post('/cart/sync', { items });
    return response.data;
  },

  async addItem(item) {
    const response = await api.post('/cart/update', { action: 'add', item });
    return response.data;
  },

  async removeItem(item) {
    const response = await api.post('/cart/update', { action: 'remove', item });
    return response.data;
  },

  async updateItem(item) {
    const response = await api.post('/cart/update', { action: 'update', item });
    return response.data;
  },

  async clearCart() {
    const response = await api.post('/cart/update', { action: 'clear' });
    return response.data;
  },
};

export default cartService;
