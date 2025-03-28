import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';
// const isProduction = true;

export const api = axios.create({
  baseURL: isProduction
    ? 'https://backend-production-fa60.up.railway.app/api'
    : 'http://localhost:8080/api',
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') { // Prevent error in SSR
    const token = localStorage.getItem('matrimony token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});