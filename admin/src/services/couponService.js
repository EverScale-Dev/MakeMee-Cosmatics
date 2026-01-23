import api from './api';

const couponService = {
  getAll: async () => {
    const response = await api.get('/coupons');
    return response.data;
  },

  create: async (couponData) => {
    const response = await api.post('/coupons', couponData);
    return response.data;
  },

  update: async (id, couponData) => {
    const response = await api.put(`/coupons/${id}`, couponData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  },
};

export default couponService;
