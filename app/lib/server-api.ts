/**
 * Server-side API utility
 * Use this for API calls from API routes or server-side functions
 */
import axios from 'axios';
import { API_BASE_URL, API_KEY } from './env';

export const serverApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

// Server-side request interceptor
serverApi.interceptors.request.use((config) => {
  // Ensure API key is always present for server-side requests
  if (API_KEY) {
    config.headers['x-api-key'] = API_KEY;
  }
  
  return config;
});

// Validate server-side configuration
export const validateServerConfig = () => {
  const errors = [];
  
  if (!API_BASE_URL) {
    errors.push('API_BASE_URL is not configured');
  }
  
  if (!API_KEY) {
    errors.push('API_KEY is not set for server-side usage');
  }
  
  if (errors.length > 0) {
    console.error('Server Configuration Errors:', errors);
    throw new Error(`Server configuration error: ${errors.join(', ')}`);
  }
  
  return true;
};
