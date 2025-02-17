"use client";
import { useState } from "react";
import Image from "next/image";
import dp from "/public/images/dashboard/dp.png";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
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
    <section className="account-details-box w-full">
      <div className="flex justify-between items-end w-full">
        <div className="flex items-end gap-4">
          <Image src={dp} alt="Profile" className="md:h-24 md:w-24" />
          <button className="white-btn hover:bg-gray-200">Change Photo</button>
        </div>
        <button className="red-btn hover:bg-red-600">Deactivate Account</button>
      </div>

      <form className="w-full">
        <div className="flex justify-between flex-wrap gap-y-4">
          {/* First Name, Middle Name, Last Name */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Gender */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Email */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Primary and Secondary Phone */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Primary Phone</label>
            <input
              type="text"
              name="primaryPhone"
              value={formData.primaryPhone}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Secondary Phone</label>
            <input
              type="text"
              name="secondaryPhone"
              value={formData.secondaryPhone}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Address */}
          <div className="w-full">
            <label className="block text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
            />
          </div>

          {/* City, State, Zipcode, Country */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Zipcode</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="yellow-btn hover:bg-orange-600">
            Save Changes
          </button>
          <button className="white-btn hover:bg-gray-400">Cancel</button>
        </div>
      </form>
    </section>
  );
};

export default AccountSettings;
