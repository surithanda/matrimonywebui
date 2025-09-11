"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoIosSave, IoMdCloseCircle } from "react-icons/io";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { createPhotoAsync, getProfilePhotosAsync } from "@/app/store/features/profileSlice";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/store/store";
import { toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";

const photoTypes = [
  "Clear Headshot",
  "Full-body shot",
  "Casual or Lifestyle Shot",
  "Family Photo",
  "Candid or Fun Moment",
  "Hobby or Activity Photo",
  "Other",
];

interface ImageFile {
  url: string;
  file?: File | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function AddPhotosModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSelect = (value: string) => {
    setSelectedType(value);
    setFile(null); // reset previous file if any
  };

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
      const photos: any[] = response?.data || [];
      const resolved = photos
        .map((p: any) => ({
          ...p,
          _src: toAbsoluteUrl(p?.url),
        }))
        .filter((p: any) => !!p._src);

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
    }
  }, [dispatch, selectedProfileID, toAbsoluteUrl]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Validate file before processing
  const validateFile = (file: File): { valid: boolean; message?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        message: "Only JPG, PNG, and WebP images are allowed",
      };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, message: "Image size must be less than 5MB" };
    }
    return { valid: true };
  };

  // For single image uploads (Profile & Cover)
  const handleImageUpload = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      currentImage: ImageFile | null,
      setImage: (value: ImageFile | null) => void
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Only count as addition if there's no image yet (i.e. it's not a replacement)
      if (!currentImage && totalPhotos >= 8) {
        toast.error("Maximum of 8 photos reached");
        return;
      }

      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.message || "Invalid file");
        return;
      }

      const url = URL.createObjectURL(file);
      setImage({ url, file });
      setError(null);
    },
    [totalPhotos]
  );

  // For uploading multiple individual images
  const handleMultipleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;

      const remaining = 8 - totalPhotos;
      if (remaining <= 0) {
        toast.error("Maximum of 8 photos reached");
        return;
      }

      const files = Array.from(e.target.files).slice(0, remaining);
      const validFiles: ImageFile[] = [];

      files.forEach((file) => {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push({
            url: URL.createObjectURL(file),
            file,
          });
        } else {
          toast.warning(`Skipped ${file.name}: ${validation.message}`);
        }
      });

      if (validFiles.length > 0) {
        setIndividualImages((prev) => [...prev, ...validFiles]);
        setError(null);
      }
    },
    [totalPhotos]
  );

  const removeImage = useCallback(
    (image: ImageFile | null, setImage: (value: ImageFile | null) => void) => {
      if (image && image.url.startsWith("blob:")) {
        URL.revokeObjectURL(image.url);
      }
      setImage(null);
    },
    []
  );

  const removeIndividualImage = useCallback((index: number) => {
    setIndividualImages((prev) => {
      const newImages = [...prev];
      if (newImages[index]?.url?.startsWith("blob:"))
        URL.revokeObjectURL(newImages[index].url);
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Upload profile photo if exists and newly selected
      if (profileImage && profileImage.file) {
        const profileFormData = new FormData();
        // Append fields before the file so multer can access them during validation
        profileFormData.append("profile_id", selectedProfileID.toString());
        profileFormData.append(
          "photo_type",
          photoTypeAssociation.profile.toString()
        ); // 450 for profile
        profileFormData.append("photo", profileImage.file as File);
        profileFormData.append(
          "caption",
          findPhotoTypeFromID(photoTypeAssociation.profile)?.name ||
            "Profile Photo"
        );
        profileFormData.append(
          "description",
          findPhotoTypeFromID(photoTypeAssociation.profile)?.description ||
            "Profile picture"
        );

        await dispatch(createPhotoAsync(profileFormData)).unwrap();
      }

      // Upload cover photo if exists and newly selected
      if (coverImage && coverImage.file) {
        const coverFormData = new FormData();
        // Append fields before the file so multer can access them during validation
        coverFormData.append("profile_id", selectedProfileID.toString());
        coverFormData.append(
          "photo_type",
          photoTypeAssociation.cover.toString()
        ); // 454 for cover
        coverFormData.append("photo", coverImage.file as File);
        coverFormData.append(
          "caption",
          findPhotoTypeFromID(photoTypeAssociation.cover)?.name || "Cover Photo"
        );
        coverFormData.append(
          "description",
          findPhotoTypeFromID(photoTypeAssociation.cover)?.description ||
            "Cover image"
        );

        await dispatch(createPhotoAsync(coverFormData)).unwrap();
      }

      // Upload individual images
      for (const img of individualImages.filter((x) => !!x.file)) {
        const imgFormData = new FormData();
        // Append fields before the file so multer can access them during validation
        imgFormData.append("profile_id", selectedProfileID.toString());
        imgFormData.append(
          "photo_type",
          photoTypeAssociation.individual.toString()
        ); // 456 for additional photos
        imgFormData.append("photo", img.file as File);
        imgFormData.append(
          "caption",
          findPhotoTypeFromID(photoTypeAssociation.individual)?.name ||
            "Additional Photo"
        );
        imgFormData.append(
          "description",
          findPhotoTypeFromID(photoTypeAssociation.individual)?.description ||
            "Additional image"
        );

        await dispatch(createPhotoAsync(imgFormData)).unwrap();
      }

      toast.success("Photos uploaded successfully!");
      await loadPhotos();
      // Handle successful upload (e.g., redirect or show success message)

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error("Upload failed:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload photos. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form>
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
                  className="border-0 px-2 bg-white text-black hover:bg-transparent hover:text-orange-400 gap-2"
                  variant={"outline"}
                  size={"sm"}
                >
                  <IoIosSave size={20} />
                  Save
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

          <div className="px-4 pt-2 pb-4">
            <div className="mt-4 space-y-4">
              {/* Select one photo type */}
              <Select onValueChange={handleSelect} value={selectedType || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select photo type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {photoTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Show file input if a type is selected */}
              {selectedType && (
                <div className="grid border rounded-lg px-3 py-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="file-input">{selectedType}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => {
                        setSelectedType(null);
                        setFile(null);
                      }}
                    >
                      <RiDeleteBin6Line size={20} />
                    </Button>
                  </div>
                  <Input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer h-10"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
