import axios from 'axios';
import { API_BASE_URL, API_KEY } from './env';
import { getAuthToken } from '../utils/authToken';
import { showUnauthorizedModal } from '../components/UnauthorizedModal';
import './env-validator'; // Auto-validate environment in development

// Helper function to get current route info
const getCurrentRouteInfo = () => {
  if (typeof window === 'undefined') return null;
  
  return {
    href: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    fullRoute: window.location.pathname + window.location.search,
  };
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

// Request interceptor for auth token and content type handling
api.interceptors.request.use((config) => {
  // Log request details for debugging
  // console.log('🚀 API Request:', {
  //   method: config.method?.toUpperCase(),
  //   url: config.url,
  //   fullUrl: config.baseURL + config.url,
  //   data: config.data,
  //   headers: {
  //     'Content-Type': config.headers['Content-Type'],
  //     'Authorization': config.headers.Authorization ? 'Bearer [TOKEN]' : 'None'
  //   }
  // });

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

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    // console.log('✅ API Success:', {
    //   method: response.config.method?.toUpperCase(),
    //   url: response.config.url,
    //   status: response.status,
    //   statusText: response.statusText
    // });
    return response;
  },
  (error) => {
    // Enhanced error logging for debugging
    const routeInfo = getCurrentRouteInfo();
    const apiUrl = error.config?.url || 'unknown';
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    
    console.error('❌ API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      method: method,
      url: apiUrl,
      fullApiUrl: error.config?.baseURL + apiUrl,
      currentRoute: routeInfo?.pathname,
      requestData: error.config?.data,
      responseData: error.response?.data,
      message: error.message
    });

    // Detailed 400 error logging
    if (error.response?.status === 400) {
      console.error('🔍 400 Bad Request Details:', {
        url: apiUrl,
        requestData: error.config?.data,
        validationErrors: error.response?.data?.errors,
        message: error.response?.data?.message,
        details: error.response?.data
      });
    }
    
    // Handle 401 Unauthorized errors with route-specific logic
    if (error?.response?.status === 401 && routeInfo) {
      console.warn('Unauthorized access detected on route:', routeInfo.pathname);
      
      // Define routes where we shouldn't show the modal
      const excludedRoutes = ['/login', '/register', '/forgot-password', '/'];
      const publicRoutes = ['/about', '/contact', '/terms', '/privacy'];
      
      // Only show modal if not on excluded routes
      if (!excludedRoutes.includes(routeInfo.pathname) && 
          !publicRoutes.includes(routeInfo.pathname)) {
        
        console.warn('Showing unauthorized modal for protected route');
        showUnauthorizedModal();
      } else {
        console.log('Skipping modal for public/auth route:', routeInfo.pathname);
      }
    }
    
    return Promise.reject(error);
  }
);  