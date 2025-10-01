# Frontend Photo URL Migration

This document outlines the changes made to the frontend to support the new Render persistent storage for photos.

## Changes Overview

The matrimony web UI has been updated to handle the transition from legacy `/uploads/` URLs to the new `/photos/` URLs used by Render's persistent storage.

## Files Modified

### 1. `app/lib/env.ts`
- **Change**: Added support for `/photos/` URLs in the `toAbsoluteUrl` function
- **Purpose**: Ensures photo URLs are correctly converted to absolute URLs
- **Impact**: All photo URLs will now work with both legacy and new storage paths

### 2. `next.config.js`
- **Change**: Added remote patterns for `/photos/**` paths
- **Purpose**: Allows Next.js Image component to load photos from the new storage location
- **Impact**: Both local development and production deployments will work with new photo paths

### 3. `app/utils/photoUrl.util.ts` (NEW)
- **Purpose**: Centralized utility for handling photo URL transformations
- **Features**:
  - `normalizePhotoUrl()`: Converts legacy URLs to new format
  - `getPhotoMetadata()`: Extracts account ID, profile ID, etc. from URLs
  - `isNewPhotoFormat()`: Checks if URL uses new format
  - `isLegacyPhotoFormat()`: Checks if URL uses legacy format
  - `getPreferredPhotoUrl()`: Generates URLs in the preferred format

### 4. `app/(dashboard)/profiles/[id]/page.tsx`
- **Change**: Updated to use `normalizePhotoUrl` instead of direct `envToAbsoluteUrl`
- **Impact**: Profile photos will display correctly regardless of storage format

### 5. `app/(dashboard)/_components/ProfileSection.tsx`
- **Change**: Updated to use `normalizePhotoUrl` utility
- **Impact**: Profile sections will display photos correctly

### 6. `app/utils/utility.ts`
- **Change**: Updated `useURLFormatter` hook to use `normalizePhotoUrl`
- **Impact**: All components using this hook will automatically handle both URL formats

## URL Format Changes

### Legacy Format (Still Supported)
```
/uploads/accounts/{accountId}/profiles/{profileId}/photos/{filename}
```

### New Format (Preferred)
```
/photos/accounts/{accountId}/profiles/{profileId}/photos/{filename}
```

## Backward Compatibility

- ✅ Legacy `/uploads/` URLs continue to work
- ✅ New `/photos/` URLs are fully supported
- ✅ Automatic migration from legacy to new format
- ✅ Both development and production environments supported

## Key Benefits

1. **Seamless Migration**: Existing photos continue to display while new uploads use persistent storage
2. **Automatic URL Normalization**: Legacy URLs are automatically converted to the new format
3. **Environment Awareness**: Works correctly in both development and production
4. **Future-Proof**: Ready for complete migration to persistent storage

## Testing Scenarios

### 1. Existing Photos (Legacy URLs)
- Photos uploaded before the migration should continue to display correctly
- URLs starting with `/uploads/accounts/...` should be automatically converted

### 2. New Photos (Render Storage)
- New photo uploads should use `/photos/accounts/...` URLs
- These should display correctly across all components

### 3. Mixed Environment
- Pages with both legacy and new photo URLs should work correctly
- No broken images or URL conflicts

## Developer Notes

### Using the Photo URL Utility

```typescript
import { normalizePhotoUrl, getPhotoMetadata } from '@/app/utils/photoUrl.util';

// Convert any photo URL to the correct format
const photoUrl = normalizePhotoUrl(rawUrl);

// Get metadata from a photo URL
const metadata = getPhotoMetadata(photoUrl);
if (metadata) {
  console.log('Account ID:', metadata.accountId);
  console.log('Profile ID:', metadata.profileId);
  console.log('Filename:', metadata.filename);
  console.log('Is Legacy:', metadata.isLegacy);
}
```

### Environment Variables

Make sure these are set correctly:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Production
NEXT_PUBLIC_API_URL=https://matrimonyservicesapi-tdcu.onrender.com/api
```

## Rollback Plan

If issues arise, the changes can be easily rolled back:

1. Revert `app/lib/env.ts` to only handle `/uploads/`
2. Remove `/photos/**` patterns from `next.config.js`
3. Update components to use `envToAbsoluteUrl` directly
4. Remove the `photoUrl.util.ts` file

## Migration Timeline

1. **Phase 1**: Deploy frontend changes (backward compatible)
2. **Phase 2**: Deploy backend changes to use Render storage
3. **Phase 3**: Monitor for any issues with photo display
4. **Phase 4**: Optionally migrate existing photos to new storage

## Monitoring

Watch for:
- Broken image displays on photo components
- Console errors related to image loading
- Network requests failing for photo URLs
- Performance impact of URL conversions