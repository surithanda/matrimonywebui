"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/app/store/store";
import {
  createPhotoAsync,
  getProfilePhotosAsync,
} from "@/app/store/features/profileSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { IoIosSave, IoMdCloseCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import Image from "next/image";

// Constants
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PHOTOS = 8;

const photoTypeAssociation: Record<string, number> = {
  "Clear Headshot": 450,
  "Full-body shot": 456,
  "Cover Photo": 454,
  "Casual or Lifestyle Shot": 456,
  "Family Photo": 456,
  "Candid or Fun Moment": 456,
  "Hobby or Activity Photo": 456,
  Other: 456,
};

interface AddPhotosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: number;
  onUploadSuccess: any;
  uploadedPhotos: any[];
}

const AddPhotosModal: React.FC<AddPhotosModalProps> = ({
  open,
  onOpenChange,
  profileId,
  onUploadSuccess,
  uploadedPhotos,
}) => {
  const dispatch = useAppDispatch();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.startsWith("blob:")) URL.revokeObjectURL(p);
      });
    };
  }, [previews]);

  // Get already uploaded photo type IDs
  const uploadedTypeIds = new Set(
    uploadedPhotos.map((photo) => Number(photo.photo_type))
  );

  // Filter dropdown photo types based on uploaded photos
  const photoOptions = Object.entries(photoTypeAssociation).filter(
    ([label, id]) => {
      if (id === 456) return true; // allow multiple
      return !uploadedTypeIds.has(id); // exclude if already uploaded
    }
  );

  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(fileList).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`File type not allowed: ${file.name}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File too large: ${file.name}`);
        return;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (selectedType === "Individual Photo") {
      setFiles((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setFiles(newFiles);
      setPreviews(newPreviews);
    }
  };

  const removeSelection = (index?: number) => {
    if (index !== undefined) {
      const updatedFiles = [...files];
      const updatedPreviews = [...previews];

      if (updatedPreviews[index]?.startsWith("blob:"))
        URL.revokeObjectURL(updatedPreviews[index]);

      updatedFiles.splice(index, 1);
      updatedPreviews.splice(index, 1);

      setFiles(updatedFiles);
      setPreviews(updatedPreviews);
    } else {
      previews.forEach((p) => {
        if (p.startsWith("blob:")) URL.revokeObjectURL(p);
      });
      setFiles([]);
      setPreviews([]);
      setSelectedType(null);
      setDescription("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length || !selectedType) {
      toast.error("Please select photo type and upload file(s)");
      return;
    }

    setIsLoading(true);
    try {
      const typeId = photoTypeAssociation[selectedType] || 456;

      for (const file of files) {
        const formData = new FormData();
        formData.append("profile_id", profileId.toString());
        formData.append("photo_type", typeId.toString());
        formData.append("photo", file);
        formData.append("caption", selectedType);
        formData.append("description", description || "Photo upload");

        await dispatch(createPhotoAsync(formData)).unwrap();
      }

      toast.success("Photo(s) uploaded successfully!");

      if (onUploadSuccess) {
        onUploadSuccess(); // Refresh photos
      }

      removeSelection();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle
                className="text-white text-xl"
                style={{ fontFamily: "BR Cobane" }}
              >
                Add Photo
              </DialogTitle>

              <div className="flex items-center gap-3">
                <Button
                  className="px-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 gap-2 rounded-md shadow-md transition-colors"
                  variant="default"
                  size="sm"
                  disabled={isLoading}
                >
                  <IoIosSave size={20} />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="border-0 p-0 bg-transparent text-white hover:bg-transparent hover:text-red-500"
                    variant="outline"
                  >
                    <IoMdCloseCircle size={20} />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>

          <div className="px-4 pb-4">
            {/* Select Type */}
            <div>
              <Label>
                Photo Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedType ?? ""}
                onValueChange={(val) => {
                  setSelectedType(val);
                  setFiles([]);
                  setPreviews([]);
                  setDescription("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {photoOptions.map(([label]) => (
                    <SelectItem key={label} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="mt-2">
              <Label>
                Upload File{selectedType === "Other" ? "s" : ""}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple={selectedType === "Other"}
                onChange={(e) => handleFileChange(e.target.files)}
              />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 my-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={preview}
                      alt="Preview"
                      className="h-32 w-full object-cover rounded border"
                      width={100}
                      height={100}
                    />
                    <button
                      type="button"
                      onClick={() => removeSelection(index)}
                      className="absolute top-1 right-1 bg-white rounded-full shadow p-1"
                    >
                      <RiDeleteBin6Line className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mt-2">
              <Label>Description</Label>
              <Input
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotosModal;
