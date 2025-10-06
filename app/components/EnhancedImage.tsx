/**
 * Enhanced Image component for handling Google Drive and other external image sources
 * Provides better error handling and fallback options for production environments
 */

'use client';
import Image from 'next/image';
import { useState, useCallback } from 'react';

interface EnhancedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  onError?: () => void;
  onLoad?: () => void;
  [key: string]: any; // For other Next.js Image props
}

const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = '/images/nodata.png',
  priority = false,
  fill = false,
  sizes,
  onError,
  onLoad,
  ...otherProps
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Google Drive URLs to direct view URLs
  const getOptimizedGoogleDriveUrl = useCallback((url: string): string => {
    if (!url) return fallbackSrc;

    // If it's already a direct Google Drive URL, return as-is
    if (url.includes('drive.google.com/uc?') || url.includes('googleusercontent.com')) {
      return url;
    }

    // Convert Google Drive share URLs to direct URLs
    if (url.includes('drive.google.com/file/d/')) {
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        // Use the direct download URL format
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
    }

    // If it's a Google Drive view URL, convert it
    if (url.includes('drive.google.com/open?id=')) {
      const fileIdMatch = url.match(/id=([a-zA-Z0-9-_]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
    }

    return url;
  }, [fallbackSrc]);

  const handleError = useCallback(() => {
    console.warn(`Failed to load image: ${imgSrc}`);
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback if we haven't already
    if (imgSrc !== fallbackSrc && !hasError) {
      setImgSrc(fallbackSrc);
    }

    if (onError) {
      onError();
    }
  }, [imgSrc, fallbackSrc, hasError, onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Get the optimized URL
  const optimizedSrc = getOptimizedGoogleDriveUrl(imgSrc);

  // Image props setup
  const imageProps = {
    src: optimizedSrc,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    sizes,
    ...otherProps,
  };

  // Add width/height or fill based on props
  if (fill) {
    imageProps.fill = true;
  } else {
    imageProps.width = width || 400;
    imageProps.height = height || 300;
  }

  return (
    <div className="relative">
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse rounded ${className}`}
          style={fill ? {} : { width, height }}
        />
      )}
      
      {/* Main image */}
      <Image {...imageProps} />
      
      {/* Error state */}
      {hasError && imgSrc === fallbackSrc && (
        <div 
          className={`absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm ${className}`}
          style={fill ? {} : { width, height }}
        >
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p>Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedImage;