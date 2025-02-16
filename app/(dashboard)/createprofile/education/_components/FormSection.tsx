"use client";
import { createEducationAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { getNextRoute } from "@/app/utils/routeOrder";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const FormSection = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    education_level: 1,
    year_completed: "",
    institution_name: "",
    address_line1: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    field_of_study: 1
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    const educationData = {
      profile_id: 51, // You might want to get this dynamically
      ...formData,
      year_completed: parseInt(formData.year_completed)
    };
    
    await dispatch(createEducationAsync(educationData)).then(() => {
      moveToNext(); 
    }).catch((error: any) => {
      console.error(error);
    });
  };

  const moveToNext = () => {
    const nextRoute = getNextRoute("/createprofile/employment");
    router.push(nextRoute);
  };

  return (
    <section className="md:py-5 w-4/5">
      <form className="flex flex-col justify-between h-full w-full box-border md:px-6" onSubmit={handleAddEducation}>
        <div className="flex flex-wrap justify-between">
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Institution Name</label>
              <input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                placeholder="Institution Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Year Completed</label>
              <input
                type="number"
                name="year_completed"
                value={formData.year_completed}
                onChange={handleChange}
                placeholder="Year of completion"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Address Fields */}
          <div className="flex w-full justify-between mt-4">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleChange}
                placeholder="Institution Address"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* City, State, Country, Zip */}
          <div className="flex w-full justify-between mt-4 gap-4">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="account-input-field w-1/4"
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="account-input-field w-1/4"
            />
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="account-input-field w-1/4"
            />
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="ZIP"
              className="account-input-field w-1/4"
            />
          </div>

          <button
            type="submit"
            className="gray-btn mt-[20px] hover:bg-gray-400"
          >
            Add Education
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600">Continue</button>
            <button type="button" className="gray-btn hover:bg-gray-400">Cancel</button>
          </div>
          <button 
            type="button" 
            onClick={moveToNext}
            className="gray-btn hover:bg-gray-400"
          >
            Skip
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormSection;
