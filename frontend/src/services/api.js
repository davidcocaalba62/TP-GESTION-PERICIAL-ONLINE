import axios from 'axios';

// Creamos la instancia con la URL base de tu backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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