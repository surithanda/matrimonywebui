"use client";
import React, { useState } from "react";

const FormSection = () => {
  const [formData, setFormData] = useState({
    selectpartner: "",
    referalcode: "",
    referaldate: "",
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
          <div className="flex w-full justify-between">
            {/* Gender */}
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Select Partner</label>
              <select
                name="selectPartner"
                value={formData.selectpartner}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Partner</option>
                <option value="Google">Google</option>
                <option value="Consulting Firm">Consulting Firm</option>
                <option value="Event Booth">Event Booth</option>
              </select>
            </div>
          </div>
          {/* First Name, Middle Name, Last Name */}
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Referal Code</label>
              <input
                type="text"
                name="referalCode"
                value={formData.referalcode}
                onChange={handleChange}
                placeholder="Referal Code"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Referal Date</label>
              <input
                type="date"
                name="lastName"
                placeholder="Last Name"
                value={formData.referaldate}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-[200px]">
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
