import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔌 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Expenses API
export const expensesAPI = {
  getAll: () => api.get('/expenses'),
  getByMonth: (month) => api.get(`/expenses/month/${month}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Members API
export const membersAPI = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};

// Calculations API
export const calculationsAPI = {
  getMonthly: (month) => api.get(`/calculations/monthly/${month}`),
  getSummary: (month) => api.get(`/calculations/summary/${month}`),
};

export default api;
