import axiosInstance from '../utils/axiosInstance';
import { setAuth, clearAuth } from '../utils/auth';

const AuthService = {
  async login(username, password) {
    const response = await axiosInstance.post('/auth/login', { username, password });
    const { token, ...user } = response.data;
    setAuth(token, user);
    return response.data;
  },

  async register(data) {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  logout() {
    clearAuth();
    window.location.href = '/login';
  },
};

export default AuthService;
