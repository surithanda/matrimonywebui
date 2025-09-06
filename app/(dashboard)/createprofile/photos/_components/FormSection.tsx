"use client";
import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPhotoAsync, getProfilePhotosAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useDispatch } from "react-redux";
import process from "process";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";

interface ImageFile {
  url: string;
  file?: File | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const FormSection = () => {
  const router = useRouter();
   const dispatch = useDispatch<AppDispatch>();
  const [profileImage, setProfileImage] = useState<ImageFile | null>(null);
  const [coverImage, setCoverImage] = useState<ImageFile | null>(null);
  const [individualImages, setIndividualImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedProfileID } = useProfileContext();

  const photoTypeAssociation = {
    'profile' : 450,     // Frontend standard for profile
    'cover' : 454,       // Frontend standard for cover  
    'individual' : 456   // Frontend standard for additional
  };

  const { findPhotoTypeFromID } = useMetaDataLoader();
  
  const toAbsoluteUrl = useCallback((u?: string | null) => {
    return envToAbsoluteUrl(u);
  }, []);

  // Helper to compute total number of photos
  const totalPhotos = useMemo(() => {
    return (profileImage ? 1 : 0) + (coverImage ? 1 : 0) + individualImages.length;
  }, [profileImage, coverImage, individualImages]);

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      if (profileImage && profileImage.url.startsWith('blob:')) URL.revokeObjectURL(profileImage.url);
      if (coverImage && coverImage.url.startsWith('blob:')) URL.revokeObjectURL(coverImage.url);
      individualImages.forEach(img => { if (img.url.startsWith('blob:')) URL.revokeObjectURL(img.url); });
    };
  }, [profileImage, coverImage, individualImages]);

  // Load existing photos for this profile
  const loadPhotos = useCallback(async () => {
    if (!selectedProfileID || selectedProfileID === 0) return;
    try {
      const response: any = await dispatch(getProfilePhotosAsync(selectedProfileID)).unwrap();
      const photos: any[] = response?.data || [];
      const resolved = photos.map((p: any) => ({
        ...p,
        _src: toAbsoluteUrl(p?.url)
      })).filter((p: any) => !!p._src);

      const prof = resolved.find((p: any) => Number(p.photo_type) === photoTypeAssociation.profile);
      const cov = resolved.find((p: any) => Number(p.photo_type) === photoTypeAssociation.cover);
      const others = resolved.filter((p: any) => Number(p.photo_type) === photoTypeAssociation.individual);

      setProfileImage(prof ? { url: prof._src, file: null } : null);
      setCoverImage(cov ? { url: cov._src, file: null } : null);
      setIndividualImages(others.map((p: any) => ({ url: p._src, file: null })));
    } catch (e) {
      // non-fatal
    }
  }, [dispatch, selectedProfileID, toAbsoluteUrl]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Validate file before processing
  const validateFile = (file: File): { valid: boolean; message?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, message: 'Only JPG, PNG, and WebP images are allowed' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, message: 'Image size must be less than 5MB' };
    }
    return { valid: true };
  };

  // For single image uploads (Profile & Cover)
  const handleImageUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    currentImage: ImageFile | null,
    setImage: (value: ImageFile | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only count as addition if there's no image yet (i.e. it's not a replacement)
    if (!currentImage && totalPhotos >= 8) {
      toast.error('Maximum of 8 photos reached');
      return;
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.message || 'Invalid file');
      return;
    }

    const url = URL.createObjectURL(file);
    setImage({ url, file });
    setError(null);
  }, [totalPhotos]);

  // For uploading multiple individual images
  const handleMultipleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const remaining = 8 - totalPhotos;
    if (remaining <= 0) {
      toast.error('Maximum of 8 photos reached');
      return;
    }

    const files = Array.from(e.target.files).slice(0, remaining);
    const validFiles: ImageFile[] = [];
    
    files.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          url: URL.createObjectURL(file),
          file
        });
      } else {
        toast.warning(`Skipped ${file.name}: ${validation.message}`);
      }
    });

    if (validFiles.length > 0) {
      setIndividualImages(prev => [...prev, ...validFiles]);
      setError(null);
    }
  }, [totalPhotos]);

  const removeImage = useCallback((image: ImageFile | null, setImage: (value: ImageFile | null) => void) => {
    if (image && image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
  }, []);

  const removeIndividualImage = useCallback((index: number) => {
    setIndividualImages(prev => {
      const newImages = [...prev];
      if (newImages[index]?.url?.startsWith('blob:')) URL.revokeObjectURL(newImages[index].url);
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Upload profile photo if exists and newly selected
      if (profileImage && profileImage.file) {
        const profileFormData = new FormData();
        // Append fields before the file so multer can access them during validation
        profileFormData.append('profile_id', selectedProfileID.toString());
        profileFormData.append('photo_type', photoTypeAssociation.profile.toString()); // 450 for profile
        profileFormData.append('photo', profileImage.file as File);
        profileFormData.append('caption', findPhotoTypeFromID(photoTypeAssociation.profile)?.name || 'Profile Photo');
        profileFormData.append('description', findPhotoTypeFromID(photoTypeAssociation.profile)?.description || 'Profile picture');
        
        await dispatch(createPhotoAsync(profileFormData)).unwrap();
      }
      
      // Upload cover photo if exists and newly selected
      if (coverImage && coverImage.file) {
        const coverFormData = new FormData();
        // Append fields before the file so multer can access them during validation
        coverFormData.append('profile_id', selectedProfileID.toString());
        coverFormData.append('photo_type', photoTypeAssociation.cover.toString()); // 454 for cover
        coverFormData.append('photo', coverImage.file as File);
        coverFormData.append('caption', findPhotoTypeFromID(photoTypeAssociation.cover)?.name || 'Cover Photo');
        coverFormData.append('description', findPhotoTypeFromID(photoTypeAssociation.cover)?.description || 'Cover image');

        await dispatch(createPhotoAsync(coverFormData)).unwrap();
      }
      
      // Upload individual images
      for (const img of individualImages.filter(x => !!x.file)) {
        const imgFormData = new FormData();
        // Append fields before the file so multer can access them during validation
        imgFormData.append('profile_id', selectedProfileID.toString());
        imgFormData.append('photo_type', photoTypeAssociation.individual.toString()); // 456 for additional photos
        imgFormData.append('photo', img.file as File);
        imgFormData.append('caption', findPhotoTypeFromID(photoTypeAssociation.individual)?.name || 'Additional Photo');
        imgFormData.append('description', findPhotoTypeFromID(photoTypeAssociation.individual)?.description || 'Additional image');

        await dispatch(createPhotoAsync(imgFormData)).unwrap();
      }

      toast.success('Photos uploaded successfully!');
      await loadPhotos();
      // Handle successful upload (e.g., redirect or show success message)

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to upload photos. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="md:py-5 w-4/5 ms-[50px]" aria-live="polite">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Profile Picture</p>
          <div className="border-2 border-dashed rounded-lg w-[265px] h-[265px] flex justify-center items-center relative bg-gray-50 overflow-hidden">
            {!profileImage ? (
              <label className="cursor-pointer text-gray-500 text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, profileImage, setProfileImage)}
                />
                <p className="text-sm">Upload Photo</p>
                <p className="text-xs">(265 x 265)</p>
              </label>
            ) : (
              <div className="w-full h-full relative">
                <Image
                  src={profileImage.url}
                  alt="Profile preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 265px"
                  className="object-cover"
                  priority
                />
                <button
                  type="button"
                  onClick={() => removeImage(profileImage, setProfileImage)}
                  className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Remove profile picture"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cover Photo */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Cover Photo</p>
          <div className="border-2 border-dashed rounded-lg w-[520px] h-[192px] flex justify-center items-center relative bg-gray-50 overflow-hidden">
            {!coverImage ? (
              <label className="cursor-pointer text-gray-500 text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, coverImage, setCoverImage)}
                />
                <p className="text-sm">Upload Photo</p>
                <p className="text-xs">(520 x 192)</p>
              </label>
            ) : (
              <div className="w-full h-full relative">
                <Image
                  src={coverImage.url}
                  alt="Cover preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 550px"
                  className="object-cover"
                  priority
                />
                <button
                  type="button"
                  onClick={() => removeImage(coverImage, setCoverImage)}
                  className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Remove cover photo"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Individual Pictures */}
      <div className="mt-8">
        <h3 className="text-lg text-start font-semibold mb-4">Individual Pictures</h3>
        <div className="flex flex-wrap gap-4">
          {individualImages.map((image, index) => (
            <div key={index} className="relative w-[200px] h-[250px] border-2 border-dashed rounded-lg bg-gray-50 overflow-hidden">
              <Image
                src={image.url}
                alt={`Individual photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 200px, 200px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeIndividualImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Remove photo ${index + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
          
          {totalPhotos < 8 && (
            <div className="border-2 border-dashed rounded-lg w-[200px] h-[250px] flex justify-center items-center bg-gray-50">
              <label className="cursor-pointer text-gray-500 text-center p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleMultipleImageUpload}
                />
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm">Add Photos</p>
                  <p className="text-xs">({8 - totalPhotos} remaining)</p>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading || totalPhotos === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Photos'}
            </button>
            <button
              type="button"
              onClick={() => {
                setProfileImage(null);
                setCoverImage(null);
                setIndividualImages([]);
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          </div>
          {/* <button
            type="button"
            onClick={() => router.push('/createprofile/partner')}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip
          </button> */}
        </div>
      </form>
    </section>
  );
};

export default FormSection;