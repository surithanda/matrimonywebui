/**
 * Environment validation utility
 * Use this to debug environment variable issues
 */

import { API_BASE_URL, API_ORIGIN, API_KEY, isProduction, isDevelopment } from './env';

export const validateEnvironmentConfig = () => {
  const config = {
    NODE_ENV: process.env.NODE_ENV,
    isProduction,
    isDevelopment,
    API_BASE_URL,
    API_ORIGIN,
    API_KEY: API_KEY ? 'Set' : 'Missing',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'Missing',
    NEXT_PUBLIC_PROD_URL: process.env.NEXT_PUBLIC_PROD_URL || 'Missing',
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY ? 'Set' : 'Missing',
  };

  console.table(config);
  
  // Validation checks
  const errors = [];
  if (!process.env.NEXT_PUBLIC_API_URL) {
    errors.push('NEXT_PUBLIC_API_URL is not set');
  }
  if (!process.env.NEXT_PUBLIC_API_KEY) {
    errors.push('NEXT_PUBLIC_API_KEY is not set');
  }
  if (isProduction && !process.env.NEXT_PUBLIC_PROD_URL) {
    errors.push('NEXT_PUBLIC_PROD_URL is required for production');
  }

  if (errors.length > 0) {
    console.error('Environment Configuration Errors:', errors);
    return false;
  }

  console.log('✅ Environment configuration is valid');
  return true;
};

// Auto-run validation in development
if (isDevelopment && typeof window !== 'undefined') {
  validateEnvironmentConfig();
}
