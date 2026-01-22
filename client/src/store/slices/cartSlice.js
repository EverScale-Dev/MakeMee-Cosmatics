import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosClient';

// Default empty cart state
const defaultCartState = {
  items: [],
  totalQuantity: 0,
  _hydrated: false,
  loading: false,
  error: null,
};

// Helper: Save cart to localStorage (for guests only)
const saveCartToLocalStorage = (state) => {
  if (typeof window === 'undefined') return;
  try {
    const cartData = { items: state.items, totalQuantity: state.totalQuantity };
    localStorage.setItem('cart', JSON.stringify(cartData));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Helper: Load cart from localStorage
const loadCartFromLocalStorage = () => {
  if (typeof window === 'undefined') return { items: [], totalQuantity: 0 };
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart) {
      const cart = JSON.parse(serializedCart);
      return { items: cart.items || [], totalQuantity: cart.totalQuantity || 0 };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return { items: [], totalQuantity: 0 };
};

// Helper: Clear guest cart from localStorage
const clearGuestCart = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('cart');
  } catch (error) {
    console.error('Error clearing guest cart:', error);
  }
};

// Helper: Check if user is logged in
const isLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Async thunk: Fetch cart from backend
export const fetchCartFromBackend = createAsyncThunk(
  'cart/fetchFromBackend',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// Async thunk: Merge guest cart on login
export const mergeCartOnLogin = createAsyncThunk(
  'cart/mergeOnLogin',
  async (_, { rejectWithValue }) => {
    try {
      const guestCart = loadCartFromLocalStorage();
      const response = await api.post('/api/cart/merge', { guestCart: guestCart.items });
      // Clear guest cart after successful merge
      clearGuestCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to merge cart');
    }
  }
);

// Async thunk: Sync cart item to backend
export const syncCartToBackend = createAsyncThunk(
  'cart/syncToBackend',
  async ({ action, item }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/cart/update', { action, item });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: defaultCartState,
  reducers: {
    // Add to cart (guest or logged-in)
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

      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);

      // Only save to localStorage if NOT logged in
      if (!isLoggedIn()) {
        saveCartToLocalStorage(state);
      }
    },

    // Remove from cart (guest or logged-in)
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.items = state.items.filter(item => item.id !== id);
      }

      if (!isLoggedIn()) {
        saveCartToLocalStorage(state);
      }
    },

    // Clear cart
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      if (!isLoggedIn()) {
        saveCartToLocalStorage(state);
      }
    },

    // Hydrate cart from localStorage (for guests on app load)
    hydrateCart(state) {
      if (typeof window === 'undefined') return;
      if (state._hydrated) return;

      // Only hydrate from localStorage if NOT logged in
      if (!isLoggedIn()) {
        const savedCart = loadCartFromLocalStorage();
        if (savedCart.items.length > 0) {
          state.items = savedCart.items;
          state.totalQuantity = savedCart.totalQuantity;
        }
      }
      state._hydrated = true;
    },

    // Set cart directly (used after backend fetch)
    setCart(state, action) {
      const { items, totalQuantity } = action.payload;
      state.items = items || [];
      state.totalQuantity = totalQuantity || 0;
      state._hydrated = true;
    },

    // Reset hydration flag (for testing/logout)
    resetHydration(state) {
      state._hydrated = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart from backend
    builder
      .addCase(fetchCartFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
        state._hydrated = true;
      })
      .addCase(fetchCartFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state._hydrated = true;
      });

    // Merge cart on login
    builder
      .addCase(mergeCartOnLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCartOnLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
        state._hydrated = true;
      })
      .addCase(mergeCartOnLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sync cart to backend
    builder
      .addCase(syncCartToBackend.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
      })
      .addCase(syncCartToBackend.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  hydrateCart,
  setCart,
  resetHydration,
} = cartSlice.actions;

export default cartSlice.reducer;
