"use client";
import { createPrimaryContactAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { getNextRoute } from "@/app/utils/routeOrder";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const FormSection = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: localStorage.getItem("userEmail") || "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    complete_address: "",
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

  const handleSubmitPrimaryContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryContactData = {
      email: formData.email,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip_code: formData.zip_code,
      complete_address: formData.complete_address,
    };

    await dispatch(createPrimaryContactAsync(primaryContactData)).then(() => {
      moveToNext();
    }).catch((error: any) => {  
      console.error(error);
    });
  };

  const moveToNext = () => {
    const nextRoute = getNextRoute("/createprofile/primarycontact");
    router.push(nextRoute);
  };

  return (
    <section className="md:py-5 w-4/5">
      <form className="w-full box-border md:px-6" onSubmit={handleSubmitPrimaryContact}>
        <div className="flex flex-wrap justify-between">
          {/* City & State */}
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">State</label>
              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* Country & Zip */}
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Zip Code</label>
              <input
                placeholder="Enter zip code"
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Complete Address</label>
              <textarea
                name="complete_address"
                placeholder="Enter your complete address"
                value={formData.complete_address}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <button className="yellow-btn hover:bg-orange-600">Continue</button>
            <button className="gray-btn hover:bg-gray-400">Cancel</button>
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