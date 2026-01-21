import api from './api';

export const customerService = {
  async create(data) {
    const response = await api.post('/customers', data);
    return response.data;
  },
};

export default customerService;
