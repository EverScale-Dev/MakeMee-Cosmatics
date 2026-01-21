import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/admin-login', { email, password });
    if (response.data.token) {
      localStorage.setItem('adminUser', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('adminUser');
  },

  getUser() {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn() {
    const user = this.getUser();
    return !!user?.token;
  },
};

export default authService;
