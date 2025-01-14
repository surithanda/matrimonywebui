"use client";
import { useState } from "react";

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log(formData);
  };

  return (
    <section className="account-details-box w-full">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Current Password */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2">Current Password</label>
          <input
            type="text"
            name="firstName"
            // value={formData.firstName}
            placeholder="Current Password"
            onChange={handleChange}
            className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* New Password */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2">New Password</label>
          <input
            type="text"
            name="firstName"
            // value={formData.firstName}
            placeholder="New Password"
            onChange={handleChange}
            className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Re-enter New Password */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2">
            Re-enter New Password
          </label>
          <input
            type="text"
            name="firstName"
            // value={formData.firstName}
            placeholder="Re-enter New Password"
            onChange={handleChange}
            className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="yellow-btn hover:bg-orange-600">Submit</button>
          <button className="white-btn hover:bg-gray-400">Cancel</button>
        </div>
      </form>
    </section>
  );
};

export default ChangePasswordForm;
