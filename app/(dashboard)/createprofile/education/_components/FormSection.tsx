"use client";
import { submitEducationAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { getNextRoute } from "@/app/utils/routeOrder";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const FormSection = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: localStorage.getItem("userEmail") || "",
    degree: "",
    institution_name: "",
    year_of_passing: "",
    complete_address: "",
    city: "",
    state: "",
    country: "",
    zip_code: ""
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

  const handleSubmitEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(submitEducationAsync(formData)).unwrap();
      moveToNext(); 
    } catch (error: any) {
      console.error('Education submission error:', error);
    }
  };

  const moveToNext = () => {
    const nextRoute = getNextRoute("/createprofile/education");
    router.push(nextRoute);
  };

  return (
    <section className="md:py-5 w-4/5">
      <form className="flex flex-col justify-between h-full w-full box-border md:px-6" onSubmit={handleSubmitEducation}>
        <div className="flex flex-wrap justify-between">
          
          {/* Email and Degree */}
          <div className="flex w-full justify-between mb-4">
            <div className="w-full">
              <label className="block text-gray-700 mb-2">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g., MSc IT, B.Tech, etc."
                required
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Institution Name and Year of Passing */}
          <div className="flex w-full justify-between mb-4">
            <div className="w-[49%]">
              <label className="block text-gray-700 mb-2">Institution Name</label>
              <input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                placeholder="Institution Name"
                required
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%]">
              <label className="block text-gray-700 mb-2">Year of Passing</label>
              <input
                type="text"
                name="year_of_passing"
                value={formData.year_of_passing}
                onChange={handleChange}
                placeholder="Year of Passing"
                required
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Complete Address */}
          <div className="flex w-full justify-between mb-4">
            <div className="w-full">
              <label className="block text-gray-700 mb-2">Complete Address</label>
              <textarea
                name="complete_address"
                value={formData.complete_address}
                onChange={handleChange}
                placeholder="Complete Institution Address"
                required
                rows={3}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>
          </div>

          {/* City, State, Country, Zip Code */}
          <div className="flex w-full justify-between mb-4 gap-4">
            <div className="w-1/4">
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-1/4">
              <label className="block text-gray-700 mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
                className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-1/4">
              <label className="block text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                required
                className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-1/4">
              <label className="block text-gray-700 mb-2">ZIP Code</label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="ZIP Code"
                required
                className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600">Submit Education</button>
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
