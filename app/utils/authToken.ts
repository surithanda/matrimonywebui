/**
 * Authentication token utilities
 * Manages both localStorage and cookies for client-server sync
 */

const TOKEN_KEY = "matrimony token";
const COOKIE_NAME = "matrimony-token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Set authentication token in both localStorage and cookies
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    // Set in localStorage for client-side access
    localStorage.setItem(TOKEN_KEY, token);
    
    // Set in cookies for middleware access
    document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
    
    console.log("Auth token set in localStorage and cookies");
  }
};

/**
 * Get authentication token from localStorage (client-side)
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Remove authentication token from both localStorage and cookies
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    // Remove from localStorage
    localStorage.removeItem(TOKEN_KEY);
    
    // Remove from cookies by setting expired date
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    
    console.log("Auth token removed from localStorage and cookies");
  }
};

/**
 * Clear all authentication data
 */
export const clearAllAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    
    // Remove the specific auth cookie
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    
    console.log("All auth data cleared");
  }
};

/**
 * Get token from cookies (for server-side access)
 */
export const getTokenFromCookies = (cookieString?: string): string | null => {
  if (!cookieString && typeof document !== 'undefined') {
    cookieString = document.cookie;
  }
  
  if (cookieString) {
    const match = cookieString.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    return match ? match[2] : null;
  }
  
  return null;
};

/**
 * Sync existing localStorage token to cookies (for users already logged in)
 * Call this on app initialization to ensure existing users have cookies set
 */
export const syncTokenToCookies = (): void => {
  if (typeof window !== 'undefined') {
    const existingToken = localStorage.getItem(TOKEN_KEY);
    const cookieToken = getTokenFromCookies();
    
    // If there's a token in localStorage but not in cookies, sync it
    if (existingToken && !cookieToken) {
      document.cookie = `${COOKIE_NAME}=${existingToken}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
      console.log("Synced existing localStorage token to cookies");
    }
  }
};