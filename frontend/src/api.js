import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔌 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Expenses API
export const expensesAPI = {
  getAll: async () => {
    const res = await api.get('/expenses');
    return res.data || [];
  },
  getByMonth: async (month) => {
    const res = await api.get(`/expenses/month/${month}`);
    return res.data || [];
  },
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Members API
export const membersAPI = {
  getAll: async () => {
    const res = await api.get('/auth/users');
    return res.data || [];
  },
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};

// Calculations API
export const calculationsAPI = {
  getMonthly: async (month) => {
    const res = await api.get(`/calculations/monthly/${month}`);
    return res.data || [];
  },
  getSummary: async (month) => {
    const res = await api.get(`/calculations/summary/${month}`);
    return res.data || [];
  },
};

export default api;
