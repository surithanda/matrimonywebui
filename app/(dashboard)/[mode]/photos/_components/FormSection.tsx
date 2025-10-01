"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { getProfilePhotosAsync } from "@/app/store/features/profileSlice";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";
import { normalizePhotoUrl } from "@/app/utils/photoUrl.util";
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
    return normalizePhotoUrl(u); // Use the new photo URL utility
  }, []);

  // Load photos
  const loadPhotos = useCallback(async () => {
    if (!selectedProfileID || selectedProfileID === 0) return;
    try {
      const response: any = await dispatch(
        getProfilePhotosAsync(selectedProfileID)
      ).unwrap();

      const resolved = (response?.data?.photos || [])
        .map((p: any) => ({ ...p, _src: normalizePhotoUrl(p.url) }))
        .filter((p: any) => !!p._src);

      console.log("resolved photos", resolved);
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-full">
          {/* Profile */}
          <div className="lg:col-span-1 bg-gray-100 rounded px-3 py-2 h-full">
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
          <div className="lg:col-span-3 bg-gray-100 rounded px-3 py-2 h-full">
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
