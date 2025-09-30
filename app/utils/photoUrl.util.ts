/**
 * Photo URL utilities for handling both legacy (/uploads/) and new (/photos/) paths
 * Provides consistent URL handling across the application
 */

import { toAbsoluteUrl as envToAbsoluteUrl } from '@/app/lib/env';

/**
 * Normalizes photo URLs to use the current storage path format
 * @param url - The photo URL (can be relative or absolute)
 * @returns Normalized absolute URL
 */
export const normalizePhotoUrl = (url?: string | null): string | null => {
  if (!url || typeof url !== 'string') return null;
  
  // If already absolute HTTP URL, return as-is
  if (url.startsWith('http')) return url;
  
  // Convert legacy /uploads/ paths to /photos/ for consistency
  // This helps during the migration period
  let normalizedUrl = url;
  if (url.startsWith('/uploads/accounts/')) {
    // Convert /uploads/accounts/... to /photos/accounts/...
    normalizedUrl = url.replace('/uploads/', '/photos/');
  }
  
  return envToAbsoluteUrl(normalizedUrl);
};

/**
 * Extracts photo metadata from URL
 * @param url - The photo URL
 * @returns Photo metadata object
 */
export const getPhotoMetadata = (url?: string | null) => {
  if (!url) return null;
  
  const isLegacyPath = url.includes('/uploads/');
  const isNewPath = url.includes('/photos/');
  
  if (!isLegacyPath && !isNewPath) return null;
  
  // Extract account ID, profile ID, and filename from URL
  const pathRegex = /\/(uploads|photos)\/accounts\/(\d+)\/profiles\/(\d+)\/photos?\/(.+)/;
  const match = url.match(pathRegex);
  
  if (!match) return null;
  
  return {
    storageType: match[1], // 'uploads' or 'photos'
    accountId: match[2],
    profileId: match[3],
    filename: match[4],
    isLegacy: match[1] === 'uploads'
  };
};

/**
 * Checks if a photo URL is using the new Render persistent storage format
 * @param url - The photo URL
 * @returns Boolean indicating if it's using new format
 */
export const isNewPhotoFormat = (url?: string | null): boolean => {
  if (!url) return false;
  return url.includes('/photos/accounts/');
};

/**
 * Checks if a photo URL is using the legacy uploads format
 * @param url - The photo URL
 * @returns Boolean indicating if it's using legacy format
 */
export const isLegacyPhotoFormat = (url?: string | null): boolean => {
  if (!url) return false;
  return url.includes('/uploads/accounts/');
};

/**
 * Gets the preferred photo URL format for new uploads
 * @param accountId - Account ID
 * @param profileId - Profile ID
 * @param filename - Photo filename
 * @returns Formatted photo URL
 */
export const getPreferredPhotoUrl = (
  accountId: string | number,
  profileId: string | number,
  filename: string
): string => {
  return `/photos/accounts/${accountId}/profiles/${profileId}/photos/${filename}`;
};

/**
 * Validates if a photo URL follows the expected format
 * @param url - The photo URL to validate
 * @returns Boolean indicating if URL is valid
 */
export const isValidPhotoUrl = (url?: string | null): boolean => {
  if (!url) return false;
  
  const metadata = getPhotoMetadata(url);
  return metadata !== null;
};

export default {
  normalizePhotoUrl,
  getPhotoMetadata,
  isNewPhotoFormat,
  isLegacyPhotoFormat,
  getPreferredPhotoUrl,
  isValidPhotoUrl
};