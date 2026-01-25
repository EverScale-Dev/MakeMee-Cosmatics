import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice.js';
import authReducer from './slices/authSlice.js';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

export default store;
