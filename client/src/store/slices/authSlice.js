import { createSlice } from '@reduxjs/toolkit';

// Load auth state from localStorage
const loadAuthFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false };
  }
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return {
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
      };
    }
    return { user: null, token: null, isAuthenticated: false };
  } catch (error) {
    console.error('Error loading auth from localStorage:', error);
    return { user: null, token: null, isAuthenticated: false };
  }
};

// Save auth state to localStorage
const saveAuthToLocalStorage = (user, token) => {
  if (typeof window === 'undefined') return;
  try {
    if (user && token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Error saving auth to localStorage:', error);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthFromLocalStorage(),
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      saveAuthToLocalStorage(user, token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      saveAuthToLocalStorage(null, null);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
