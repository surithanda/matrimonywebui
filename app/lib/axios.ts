import axios from 'axios';

// const isProduction = process.env.NODE_ENV === 'production';
const isProduction = true;
// console.log('API Environment:', process.env.NODE_ENV);

export const api = axios.create({
  baseURL: isProduction?'https://matrimonyservicesapi-tdcu.onrender.com/api':'http://localhost:8080/api',
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  },
});

// Request interceptor for auth token and content type handling
api.interceptors.request.use((config) => {
  // Set default Content-Type for non-FormData requests
  if (config.data && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  } else if (config.data instanceof FormData) {
    // Let the browser/axios set the boundary automatically for multipart
    delete (config.headers as any)['Content-Type'];
  }

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('matrimony token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});