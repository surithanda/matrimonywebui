import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';
// const isProduction = true;

export const api = axios.create({
  baseURL: 'https://matrimonyservicesapi-tdcu.onrender.com/api',
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
    config.headers['Content-Type'] = 'multipart/form-data';
    // Remove Content-Type to let the browser set it with the proper boundary
    // delete config.headers['Content-Type'];
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