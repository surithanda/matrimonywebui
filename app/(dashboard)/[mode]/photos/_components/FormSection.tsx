"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { getProfilePhotosAsync } from "@/app/store/features/profileSlice";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import AddPhotosModal from "./photos-modals/AddPhotosModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/app/(dashboard)/_components/Loader";

const FormSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProfileID } = useProfileContext();
  const [photos, setPhotos] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState({ add: false, edit: false });
  const { loading } = useAppSelector((state) => state.profile);
  const photoTypeAssociation = {
    profile: 450,
    cover: 454,
    individual: 456,
  };

  const toAbsoluteUrl = useCallback((u?: string | null) => {
    return envToAbsoluteUrl(u);
  }, []);

  // Load photos
  const loadPhotos = useCallback(async () => {
    if (!selectedProfileID || selectedProfileID === 0) return;
    try {
      const response: any = await dispatch(
        getProfilePhotosAsync(selectedProfileID)
      ).unwrap();

      const resolved = (response?.data?.photos || [])
        .map((p: any) => ({ ...p, _src: toAbsoluteUrl(p?.url) }))
        .filter((p: any) => !!p._src);

      setPhotos(resolved);
    } catch (e) {
      console.log("error", e);
    } finally {
    }
  }, [dispatch, selectedProfileID, toAbsoluteUrl]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleAfterUpload = () => {
    loadPhotos();
  };

  // Find specific types
  const profilePhoto = photos.find(
    (p) => Number(p.photo_type) === photoTypeAssociation.profile
  );
  const coverPhoto = photos.find(
    (p) => Number(p.photo_type) === photoTypeAssociation.cover
  );
  const otherPhotos = photos.filter(
    (p) => Number(p.photo_type) === photoTypeAssociation.individual
  );

  const closeAddModal = () => setOpenModal((prev) => ({ ...prev, add: false }));

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <section className="px-4 py-5 md:px-0 md:py-2 w-full">
        <div className="mb-6">
          <div className="flex justify-end items-center mb-3 mt-3">
            <Button
              onClick={() => setOpenModal((prev) => ({ ...prev, add: true }))}
              className=" gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-shrink-0"
            >
              <FaPlus />
              Add Photos
            </Button>
          </div>
        </div>

        {/* Profile & Cover */}
        <div className="grid grid-cols-4 gap-2 h-full">
          {/* Profile */}
          <div className="col-span-1 bg-gray-100 rounded px-3 py-2 h-full">
            <h2
              className="text-base font-bold"
              style={{ fontFamily: "BR Cobane" }}
            >
              Profile Picture
            </h2>
            <div className="bg-white p-2 rounded relative group">
              {profilePhoto ? (
                <>
                  <Image
                    src={profilePhoto._src}
                    alt="Profile"
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded"
                    onClick={() => setPreviewImage(profilePhoto._src)}
                  />
                  <button
                    onClick={() =>
                      console.log(
                        "Delete Profile",
                        profilePhoto.profile_photo_id
                      )
                    }
                    className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No profile picture</p>
              )}
              <p className="text-base py-1" style={{ fontFamily: "BR Cobane" }}>
                {profilePhoto?.description ||
                  "Upload your profile picture here."}
              </p>
            </div>
          </div>

          {/* Cover */}
          <div className="col-span-3 bg-gray-100 rounded px-3 py-2 h-full">
            <h2
              className="text-base font-bold"
              style={{ fontFamily: "BR Cobane" }}
            >
              Cover Picture
            </h2>
            <div className="bg-white p-2 rounded relative group">
              {coverPhoto ? (
                <>
                  <Image
                    src={coverPhoto._src}
                    alt="Cover"
                    width={800}
                    height={250}
                    className="w-full h-56 object-cover rounded"
                    onClick={() => setPreviewImage(coverPhoto._src)}
                  />
                  <button
                    onClick={() =>
                      console.log("Delete Cover", coverPhoto.profile_photo_id)
                    }
                    className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No cover picture</p>
              )}
              <p className="text-base py-1" style={{ fontFamily: "BR Cobane" }}>
                {coverPhoto?.description || "Upload your cover picture here."}
              </p>
            </div>
          </div>
        </div>

        {/* Other's Images */}
        <div className="bg-gray-100 rounded px-3 py-2 h-full mt-4">
          <h2
            className="text-base font-bold"
            style={{ fontFamily: "BR Cobane" }}
          >
            Other's Images
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 bg-white gap-3 mt-2 p-2 rounded">
            {otherPhotos.length > 0 ? (
              otherPhotos.map((photo: any) => (
                <div key={photo.profile_photo_id} className="relative group">
                  <Image
                    src={photo._src}
                    alt={photo.caption || "Photo"}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded"
                    onClick={() => setPreviewImage(photo._src)}
                  />
                  <div className="mt-2 text-sm text-gray-700 px-1">
                    <p className="text-xs mt-2">{photo.description || "-"}</p>
                  </div>
                  <button
                    onClick={() =>
                      console.log("Delete", photo.profile_photo_id)
                    }
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No other images uploaded
              </p>
            )}
          </div>
        </div>

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

      {/* Add Photos Modal */}
      <AddPhotosModal
        profileId={selectedProfileID}
        open={openModal.add}
        onOpenChange={closeAddModal}
        onUploadSuccess={handleAfterUpload}
        uploadedPhotos={photos}
      />

      {/* Preview Modal */}
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
