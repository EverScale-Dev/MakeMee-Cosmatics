import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

const AuthContext = createContext(undefined);

// Store cart sync callback
let cartSyncCallback = null;

export const setCartSyncCallback = (callback) => {
  cartSyncCallback = callback;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data);
    // Sync cart after login
    if (cartSyncCallback) {
      setTimeout(() => cartSyncCallback(), 100);
    }
    return data;
  };

  const register = async (fullName, email, password) => {
    const data = await authService.register({ fullName, email, password });
    setUser(data);
    // Sync cart after registration
    if (cartSyncCallback) {
      setTimeout(() => cartSyncCallback(), 100);
    }
    return data;
  };

  const googleLogin = async (credential) => {
    const data = await authService.googleAuth(credential);
    setUser(data);
    // Sync cart after Google login
    if (cartSyncCallback) {
      setTimeout(() => cartSyncCallback(), 100);
    }
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
