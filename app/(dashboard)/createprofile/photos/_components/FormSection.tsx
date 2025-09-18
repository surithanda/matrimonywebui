"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createPhotoAsync,
  getProfilePhotosAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useDispatch } from "react-redux";
import process from "process";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import AddPhotosModal from "./photos-modals/AddPhotosModal";
import { Table } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageFile {
  url: string;
  file?: File | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const FormSection = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [profileImage, setProfileImage] = useState<ImageFile | null>(null);
  const [coverImage, setCoverImage] = useState<ImageFile | null>(null);
  const [individualImages, setIndividualImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedProfileID } = useProfileContext();
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
  });

  const [photos, setPhotos] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const photoTypeAssociation = {
    profile: 450, // Frontend standard for profile
    cover: 454, // Frontend standard for cover
    individual: 456, // Frontend standard for additional
  };

  const { findPhotoTypeFromID } = useMetaDataLoader();

  const toAbsoluteUrl = useCallback((u?: string | null) => {
    return envToAbsoluteUrl(u);
  }, []);

  // Helper to compute total number of photos
  const totalPhotos = useMemo(() => {
    return (
      (profileImage ? 1 : 0) + (coverImage ? 1 : 0) + individualImages.length
    );
  }, [profileImage, coverImage, individualImages]);

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      if (profileImage && profileImage.url.startsWith("blob:"))
        URL.revokeObjectURL(profileImage.url);
      if (coverImage && coverImage.url.startsWith("blob:"))
        URL.revokeObjectURL(coverImage.url);
      individualImages.forEach((img) => {
        if (img.url.startsWith("blob:")) URL.revokeObjectURL(img.url);
      });
    };
  }, [profileImage, coverImage, individualImages]);

  // Load existing photos for this profile
  const loadPhotos = useCallback(async () => {
    if (!selectedProfileID || selectedProfileID === 0) return;
    try {
      const response: any = await dispatch(
        getProfilePhotosAsync(selectedProfileID)
      ).unwrap();

      console.log("photo response", response.data);

      const photos: any[] = response?.data?.photos || [];
      const resolved = photos
        .map((p: any) => ({
          ...p,
          _src: toAbsoluteUrl(p?.url),
        }))
        .filter((p: any) => !!p._src);

      setPhotos(resolved); // ✅ store in state
      console.log("resolved", resolved);

      const prof = resolved.find(
        (p: any) => Number(p.photo_type) === photoTypeAssociation.profile
      );
      const cov = resolved.find(
        (p: any) => Number(p.photo_type) === photoTypeAssociation.cover
      );
      const others = resolved.filter(
        (p: any) => Number(p.photo_type) === photoTypeAssociation.individual
      );

      setProfileImage(prof ? { url: prof._src, file: null } : null);
      setCoverImage(cov ? { url: cov._src, file: null } : null);

      setIndividualImages(
        others.map((p: any) => ({ url: p._src, file: null }))
      );
    } catch (e) {
      // non-fatal
      console.log("error", e);
    }
  }, [
    dispatch,
    selectedProfileID,
    toAbsoluteUrl,
    photoTypeAssociation.profile,
    photoTypeAssociation.cover,
    photoTypeAssociation.individual,
  ]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const closeAddModal = () => {
    setOpenModal((prev) => ({
      ...prev,
      add: false,
    }));
  };

  return (
    <>
      <section className="px-4 py-5 md:px-0 md:py-2 w-full">
        <div className="mb-6">
          <div className="flex justify-end items-center mb-3 mt-3">
            <Button
              onClick={() =>
                setOpenModal((prev) => ({
                  ...prev,
                  add: true,
                }))
              }
              className=" gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-shrink-0"
            >
              <FaPlus />
              Add Photos
            </Button>
          </div>
        </div>

        <table className="min-w-full border rounded-md text-sm sm:text-base mt-2">
          <thead className="">
            <tr className="text-left">
              <th className="px-6 py-2 border-b text-base font-bold">
                Photo Type
              </th>
              <th className="px-6 py-2 border-b text-base font-bold">
                Description
              </th>
              <th className="px-6 py-2 border-b text-base font-bold">Images</th>
              <th className="px-6 py-2 border-b text-base font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {photos.length > 0 ? (
              photos.map((photo: any, index: number) => (
                <tr
                  key={photo.profile_photo_id || index}
                  className="hover:bg-gray-50 transition-colors text-sm"
                >
                  <td className="px-6 py-3 border-b">
                    {photo.photo_type?.name || photo.caption || "-"}
                  </td>
                  <td className="px-6 py-3 border-b">
                    {photo.description || "-"}
                  </td>
                  <td className="px-6 py-3 border-b">
                    <div
                      className="w-16 h-16 relative cursor-pointer"
                      onClick={() => setPreviewImage(photo._src)}
                    >
                      <Image
                        src={photo._src}
                        alt={photo.caption || "Photo"}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3 border-b">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        console.log("Delete", photo.profile_photo_id)
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 border-b text-center text-gray-500"
                >
                  No photos uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* {error && (
          <div
            className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
            role="alert"
          >
            {error}
          </div>
        )}
          
        <div className="flex flex-col md:flex-row gap-6">
          <div className="mb-4">
            <p className="font-semibold mb-2">Profile Picture</p>
            <div className="border-2 border-dashed rounded-lg w-[265px] h-[265px] flex justify-center items-center relative bg-gray-50 overflow-hidden">
              {!profileImage ? (
                <label className="cursor-pointer text-gray-500 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e, profileImage, setProfileImage)
                    }
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
          <div className="mb-4">
            <p className="font-semibold mb-2">Cover Photo</p>
            <div className="border-2 border-dashed rounded-lg w-[520px] h-[192px] flex justify-center items-center relative bg-gray-50 overflow-hidden">
              {!coverImage ? (
                <label className="cursor-pointer text-gray-500 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e, coverImage, setCoverImage)
                    }
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

        <div className="mt-8">
          <h3 className="text-lg text-start font-semibold mb-4">
            Individual Pictures
          </h3>
          <div className="flex flex-wrap gap-4">
            {individualImages.map((image, index) => (
              <div
                key={index}
                className="relative w-[200px] h-[250px] border-2 border-dashed rounded-lg bg-gray-50 overflow-hidden"
              >
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
                    <svg
                      className="w-8 h-8 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
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
                {isLoading ? "Saving..." : "Save Photos"}
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
          </div>
        </form> */}
      </section>
      <AddPhotosModal
        profileId={selectedProfileID}
        open={openModal.add}
        onOpenChange={closeAddModal}
      />
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="relative w-full h-[500px]">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormSection;
