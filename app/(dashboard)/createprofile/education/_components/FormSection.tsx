"use client";
import React, { useState } from "react";

const FormSection = () => {
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    completiondate: "",
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
      <form className="flex flex-col justify-between h-full w-full box-border md:px-6">
        <div className="flex flex-wrap justify-between">
          {/* First Name, Middle Name, Last Name */}
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">
                Degree Completion
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.degree}
                onChange={handleChange}
                placeholder="Degree Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Instituion</label>
              <input
                type="text"
                name="lastName"
                placeholder="Institution"
                value={formData.institution}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">
                Completion Date
              </label>
              <textarea
                name="summary"
                placeholder="Completion Date"
                value={formData.completiondate}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={1}
              />
              <button className="gray-btn mt-[20px] hover:bg-gray-400">
                Add Another
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
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
