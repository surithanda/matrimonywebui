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
    API_URL: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL ? 'Set' : 'Missing',
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY ? 'Set' : 'Missing',
  };

  console.table(config);
  
  // Validation checks
  const errors = [];
  if (!process.env.API_URL && !process.env.NEXT_PUBLIC_API_URL) {
    errors.push('API_URL is not set');
  }
  if (!API_KEY) {
    errors.push('API_KEY is not set');
  }
//   if (isProduction && !process.env.PROD_URL) {
//     errors.push('PROD_URL is required for production');
//   }

  if (errors.length > 0) {
    console.error('Environment Configuration Errors:', errors);
    return false;
  }

  console.log('✅ Environment configuration is valid');
  return true;
};

// Auto-run validation in development
if (isDevelopment && typeof window !== 'undefined') {
  const validate = validateEnvironmentConfig();
  if(!validate) {
    console.log('❌ Invalid environment configuration. Please check the errors above.');
    throw new Error('Invalid environment configuration. Check console for details.');
  }
}
