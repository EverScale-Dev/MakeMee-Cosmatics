import api from './api';

export const paymentService = {
  async createRazorpayOrder(amount, currency = 'INR', receipt) {
    const response = await api.post('/payment/razorpay/order', {
      amount,
      currency,
      receipt,
    });
    return response.data;
  },

  async verifyPayment(data) {
    const response = await api.post('/payment/razorpay/verify', data);
    return response.data;
  },

  async getOrderStatus(orderId) {
    const response = await api.get(`/payment/order-status/${orderId}`);
    return response.data;
  },
};

export default paymentService;
