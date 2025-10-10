import { createSlice } from '@reduxjs/toolkit';

// Function to load the cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return { items: [], totalQuantity: 0 }; // Default state if no cart exists in localStorage
    }
    return JSON.parse(serializedCart);
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return { items: [], totalQuantity: 0 }; // Default state in case of error
  }
};

// Function to save the cart to localStorage
const saveCartToLocalStorage = (state) => {
  try {
    const serializedCart = JSON.stringify(state);
    localStorage.setItem('cart', serializedCart);
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromLocalStorage(), // Load cart state from localStorage on initialization
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity = newItem.quantity;
      } else {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: newItem.quantity,
          image: newItem.image,
          weight: newItem.weight,
        });
      }

      // Update total quantity
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);

      // Save the updated cart state to localStorage
      saveCartToLocalStorage(state);
    },
    
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.items = state.items.filter(item => item.id !== id);
      }

      // Save the updated cart state to localStorage
      saveCartToLocalStorage(state);
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      saveCartToLocalStorage(state); // Don't forget to save to local storage
    },

    
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
