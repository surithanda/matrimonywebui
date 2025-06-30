"use client";
import { createAddressAsync, createPersonalProfileAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { getNextRoute } from "@/app/utils/routeOrder";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const FormSection = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    city: "City",
    state: "state",
    country: "country",
    zip: "zip", // Changed from `zipcode` to `zip`
    address_line1: "address_line1", // Changed from `address` to `address_line1`
    address_line2: "address_line2",
    phone: "phone",
    landmark1: "landmark1",
    landmark2: "landmark2",
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

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const addressData = {
      profile_id: 51, // You might want to get this dynamically
      address_type: 1,
      address_line1: formData.address_line1,
      address_line2: formData.address_line2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip: formData.zip, // Corrected field name
      phone: formData.phone || "",
      landmark1: formData.landmark1 || "",
      landmark2: formData.landmark2 || "",
    };

    await dispatch(createAddressAsync(addressData)).then(() => {
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
      <form className="w-full box-border md:px-6" onSubmit={handleAddAddress}>
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
                name="zip"
                value={formData.zip} // Fixed from `zipcode`
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Complete Address</label>
              <textarea
                name="address_line1"
                placeholder="Complete Address"
                value={formData.address_line1}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={1}
              />
              <button 
                type="submit"
                className="gray-btn mt-[20px] hover:bg-gray-400"
              >
                Add Address
              </button>
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