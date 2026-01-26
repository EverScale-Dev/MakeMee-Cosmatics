import api from './api';

export const paymentService = {
  /**
   * Initiate online payment - stores order data and creates Razorpay order
   * Order is NOT created until payment is verified
   */
  async initiatePayment(orderData) {
    const response = await api.post('/payment/razorpay/initiate', orderData);
    return response.data;
  },

  /**
   * Verify payment and create order
   * Order is created ONLY after successful payment verification
   */
  async verifyPayment(data) {
    const response = await api.post('/payment/razorpay/verify', data);
    return response.data;
  },

  /**
   * @deprecated Use initiatePayment instead
   */
  async createRazorpayOrder(amount, currency = 'INR', receipt) {
    const response = await api.post('/payment/razorpay/order', {
      amount,
      currency,
      receipt,
    });
    return response.data;
  },

  async getOrderStatus(orderId) {
    const response = await api.get(`/payment/order-status/${orderId}`);
    return response.data;
  },
};

export default paymentService;
