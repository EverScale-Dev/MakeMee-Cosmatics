import api from './api';

export const metricsService = {
  async getMetrics() {
    const response = await api.get('/metrics');
    return response.data;
  },

  async getChartData() {
    const response = await api.get('/metrics/charts');
    return response.data;
  },
};

export default metricsService;
