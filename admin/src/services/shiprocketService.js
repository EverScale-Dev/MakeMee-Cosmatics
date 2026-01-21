import api from './api';

export const shiprocketService = {
  async createShipment(orderId) {
    const response = await api.post(`/shiprocket/ship/${orderId}`);
    return response.data;
  },

  async assignAwb(orderId) {
    const response = await api.post(`/shiprocket/assign-awb/${orderId}`);
    return response.data;
  },

  async generateLabel(orderId) {
    const response = await api.post(`/shiprocket/generate-label/${orderId}`);
    return response.data;
  },

  async trackOrder(orderId) {
    const response = await api.get(`/shiprocket/track/${orderId}`);
    return response.data;
  },

  async trackByAwb(awb) {
    const response = await api.get(`/shiprocket/track/awb/${awb}`);
    return response.data;
  },

  async getShipmentStatus(orderId) {
    const response = await api.get(`/shiprocket/status/${orderId}`);
    return response.data;
  },
};

export default shiprocketService;
