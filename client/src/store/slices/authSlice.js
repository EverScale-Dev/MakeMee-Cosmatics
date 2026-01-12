import { createSlice } from '@reduxjs/toolkit';

// Default empty auth state (SSR-safe)
const defaultAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  _hydrated: false,
};

// Load auth state from localStorage
const loadAuthFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return { user: JSON.parse(user), token };
    }
    return { user: null, token: null };
  } catch (error) {
    console.error('Error loading auth from localStorage:', error);
    return { user: null, token: null };
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
  initialState: defaultAuthState,
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state._hydrated = true;
      saveAuthToLocalStorage(user, token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      saveAuthToLocalStorage(null, null);
    },
    hydrateAuth(state) {
      if (state._hydrated) return;
      const { user, token } = loadAuthFromLocalStorage();
      if (user && token) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
      state._hydrated = true;
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveAuthToLocalStorage(state.user, state.token);
      }
    },
  },
});

export const { setCredentials, logout, hydrateAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
