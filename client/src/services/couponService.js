import api from './api';

const couponService = {
  async validate(code, subtotal = 0, deliveryCharge = 0, cartItems = []) {
    const response = await api.post('/coupons/validate', {
      code,
      subtotal,
      deliveryCharge,
      cartItems,
    });
    return response.data;
  },

  async getVisibleCoupons() {
    const response = await api.get('/coupons/visible');
    return response.data;
  },
};

export default couponService;
