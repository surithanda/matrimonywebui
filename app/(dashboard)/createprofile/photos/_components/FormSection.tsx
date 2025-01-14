"use client";
import React, { useState } from "react";

const FormSection = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [individualImages, setIndividualImages] = useState<string[]>([]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (value: string | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const handleMultipleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setIndividualImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (setImage: (value: string | null) => void) => {
    setImage(null);
  };

  const removeIndividualImage = (index: number) => {
    setIndividualImages(individualImages.filter((_, i) => i !== index));
  };

  return (
    <section className="md:py-5 w-4/5 ms-[50px]">
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
                  onChange={(e) => handleImageUpload(e, setProfileImage)}
                />
                <p className="text-sm">Upload Photo</p>
                <p className="text-xs">(265 x 265)</p>
              </label>
            ) : (
              <div className="w-full h-full">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => removeImage(setProfileImage)}
                  className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
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
                  onChange={(e) => handleImageUpload(e, setCoverImage)}
                />
                <p className="text-sm">Upload Photo</p>
                <p className="text-xs">(520 x 192)</p>
              </label>
            ) : (
              <div className="w-full h-full">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => removeImage(setCoverImage)}
                  className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Individual Pictures */}
      <h3 className="text-lg text-start font-semibold mt-6 mb-3 BRCobane18600">
        Individual Pictures
      </h3>
      <div className="flex gap-4 flex-wrap">
        {individualImages.map((image, index) => (
          <div
            key={index}
            className="relative w-[200px] h-[250px] border-2 border-dashed rounded-lg bg-gray-50 overflow-hidden"
          >
            <img
              src={image}
              alt={`Individual ${index + 1}`}
              className="object-cover w-full h-full"
            />
            <button
              onClick={() => removeIndividualImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="border-2 border-dashed rounded-lg w-[200px] h-[250px] flex justify-center items-center bg-gray-50">
          <label className="cursor-pointer text-gray-500 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleMultipleImageUpload}
            />
            <p className="text-sm">Upload Another</p>
          </label>
        </div>
      </div>
      <div className="flex justify-between mt-[100px]">
        <div className="flex justify-start gap-4">
          <button className="yellow-btn hover:bg-orange-600">Continue</button>
          <button className="gray-btn hover:bg-gray-400">Cancel</button>
        </div>
        <button className="gray-btn hover:bg-gray-400">Skip</button>
      </div>
    </section>
  );
};

export default FormSection;
