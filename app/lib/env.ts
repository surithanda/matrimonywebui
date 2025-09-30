/**
 * Environment configuration utility
 * Centralizes all environment variable access and provides consistent API URLs
 */

// Environment detection
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// API Configuration
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY;

// API Base URLs
const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8080/api';
};

export const API_BASE_URL = getApiBaseUrl();

// For file uploads and static assets, we need the base URL without /api
export const API_ORIGIN = API_BASE_URL.replace('/api', '');

// Utility function to convert relative paths to absolute URLs
export const toAbsoluteUrl = (url?: string | null): string | null => {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith('http')) return url; // Already absolute
  
  // For API endpoints, use full API base URL
  if (url.startsWith('/api/')) {
    return `${API_ORIGIN}${url}`;
  }
  
  // For photos (new Render persistent storage) and uploads (legacy), use origin
  if (url.startsWith('/photos/') || url.startsWith('/uploads/') || url.startsWith('/static/')) {
    return `${API_ORIGIN}${url}`;
  }
  
  // Default behavior - prepend API origin
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Log configuration in development
if (isDevelopment) {
  console.log('Environment Configuration:', {
    NODE_ENV: process.env.NODE_ENV,
    API_BASE_URL,
    API_ORIGIN,
    // API_KEY is only available server-side, don't log it in client
  });
}
