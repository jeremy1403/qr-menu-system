import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

// API functions
export const categoriesApi = {
  getAll: () => api.get('/categories').then((r) => r.data),
  getOne: (id: string) => api.get(`/categories/${id}`).then((r) => r.data),
};

export const menuItemsApi = {
  getAll: (categoryId?: string) =>
    api.get('/menu-items', { params: { categoryId } }).then((r) => r.data),
  getFeatured: () => api.get('/menu-items/featured').then((r) => r.data),
  getPopular: () => api.get('/menu-items/popular').then((r) => r.data),
  search: (q: string) => api.get('/menu-items/search', { params: { q } }).then((r) => r.data),
  getOne: (id: string) => api.get(`/menu-items/${id}`).then((r) => r.data),
};

export const ingredientsApi = {
  getAll: () => api.get('/ingredients').then((r) => r.data),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  getProfile: () => api.get('/auth/profile').then((r) => r.data),
};