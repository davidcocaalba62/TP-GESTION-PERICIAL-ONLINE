import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Interceptor de peticiones: se ejecuta antes de cada request
api.interceptors.request.use((config) => {
  // Buscamos el token JWT guardado al iniciar sesión
  const token = localStorage.getItem('token');
  if (token) {
    // Si existe, lo inyectamos automáticamente en los headers
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;