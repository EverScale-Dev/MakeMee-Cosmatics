import api from './api';

const couponService = {
  async validate(code, subtotal = 0, deliveryCharge = 0) {
    const response = await api.post('/coupons/validate', {
      code,
      subtotal,
      deliveryCharge,
    });
    return response.data;
  },
};

export default couponService;
