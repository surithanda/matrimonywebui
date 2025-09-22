import axios from 'axios';
import { API_BASE_URL, API_KEY } from './env';
import { getAuthToken } from '../utils/authToken';
import './env-validator'; // Auto-validate environment in development

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
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
    const token = getAuthToken(); // Use the new utility function
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});