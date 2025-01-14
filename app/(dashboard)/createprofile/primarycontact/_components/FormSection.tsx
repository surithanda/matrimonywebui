"use client";
import React, { useState } from "react";

const FormSection = () => {
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "",
    zipcode: "",
    address: "",
    religion: "",
    primaryPhone: "",
    email: "",
    height: "",
    weight: "",
    disability: "",
    profession: "",
    maritalStatus: "",
    emergencyPhone: "",
    summary: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <section className="md:py-5 w-4/5">
      <form className="w-full box-border md:px-6">
        <div className="flex flex-wrap justify-between">
          {/* First Name, Middle Name, Last Name */}
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="firstName"
                value={formData.city}
                onChange={handleChange}
                placeholder="First Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">State</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.state}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            {/* Gender */}
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Country</label>
              <select
                name="gender"
                value={formData.country}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Country</option>
                <option value="America">America</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Zip Code</label>
              <input
                placeholder="Zip Code"
                type="text"
                name="birthDate"
                value={formData.zipcode}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">
                Complete Address
              </label>
              <textarea
                name="summary"
                placeholder="Complete Address"
                value={formData.address}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={1}
              />
              <button className="gray-btn mt-[20px] hover:bg-gray-400">
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
          <button className="gray-btn hover:bg-gray-400">Skip</button>
        </div>
      </form>
    </section>
  );
};

export default FormSection;
