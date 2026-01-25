import api from './api';

export const contactService = {
  async getAll(page = 1, limit = 20) {
    const response = await api.get(`/contact?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/contact/unread-count');
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.patch(`/contact/${id}/read`);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};

export default contactService;
