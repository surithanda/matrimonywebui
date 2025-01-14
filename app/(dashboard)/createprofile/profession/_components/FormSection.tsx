"use client";
import React, { useState } from "react";

const FormSection = () => {
  const [formData, setFormData] = useState({
    position: "",
    company: "",
    startdate: "",
    enddate: "",
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
              <label className="block text-gray-700 mb-2">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Position"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Company</label>
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="position"
                value={formData.startdate}
                onChange={handleChange}
                placeholder="Position"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Ending Date</label>
              <input
                type="date"
                name="company"
                placeholder="Company"
                value={formData.enddate}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <div className="flex gap-2">
                <input type="checkbox" />
                <span>Working here currently</span>
              </div>

              <button className="gray-btn mt-[20px] hover:bg-gray-400">
                Add Another
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
