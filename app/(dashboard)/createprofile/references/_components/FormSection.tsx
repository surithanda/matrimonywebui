"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FormSection = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: "",
    dob: "",
    contactnumber: "",
    email: "",
    relationshiptoyou: "",
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Navigate to '/createprofile/property'
    router.push("/createprofile/property");
  };

  return (
    <section className="md:py-5 w-4/5">
      <form onSubmit={handleSubmit} className="w-full box-border md:px-6">
        <div className="flex flex-wrap justify-between">
          {/* First Name and Date of Birth */}
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Full</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">date of Birth</label>
              <input
                type="date"
                name="dateofbirth"
                value={formData.dob}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Contact Number</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactnumber}
                onChange={handleChange}
                placeholder="Contact Number"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            {/* Relationship */}
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">
                Relationship to you
              </label>
              <select
                name="relationship"
                value={formData.relationshiptoyou}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Relationship to you</option>
                <option value="Professional">Professional</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <button type="button" className="gray-btn mt-[20px] hover:bg-gray-400">
                Add Another
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600">
              Continue
            </button>
            <button type="button" className="gray-btn hover:bg-gray-400">
              Cancel
            </button>
          </div>
          <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => router.push("/createprofile/property")}>
            Skip
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormSection;