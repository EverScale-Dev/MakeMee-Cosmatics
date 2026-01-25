import api from './api';

export const deliveryService = {
  async getSettings() {
    const response = await api.get('/delivery');
    return response.data;
  },
};

export default deliveryService;
