"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FormSection = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    property: "",
    ownership: "",
    area: "",
    propertystatus: "",
    address: "",
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
  }
  return (
    <section className="md:py-5 w-4/5">
      <form className="w-full box-border md:px-6" onSubmit={handleSubmit}>
        <div className="flex flex-wrap justify-between">
          {/* First Name, Middle Name, Last Name */}
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Property Type</label>
              <select
                name="country"
                value={formData.property}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Property Type</option>
                <option value="Apartment/Flat">Apartment/Flat</option>
                <option value="Independent House/Villa">
                  Independent House/Villa
                </option>
                <option value="Studio Apartment">Studio Apartment</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Duplex">Duplex</option>
              </select>
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Ownership Type</label>
              <select
                name="gender"
                value={formData.ownership}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Ownership Type</option>
                <option value="Freehold">Freehold</option>
                <option value="Leasehold">Leasehold</option>
                <option value="Joint Ownership">Joint Ownership</option>
              </select>
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
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Size/Area</label>
              <select
                name="gender"
                value={formData.area}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Size/Area</option>
                <option value="500 sq. ft">500 sq. ft</option>
                <option value="1000 sq. ft">1000 sq. ft</option>
                <option value="1500 sq. ft.">1500 sq. ft.</option>
                <option value="1500 sq. ft.">2000 sq. ft.</option>
              </select>
              <button className="gray-btn mt-[20px] hover:bg-gray-400">
                Add Address
              </button>
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">
                Property Status
              </label>
              <select
                name="gender"
                value={formData.propertystatus}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Property Status</option>
                <option
                  value="Ready to Move
"
                >
                  Ready to Move
                </option>
                <option value="Under Construction">Under Construction</option>
                <option value="New Launch">New Launch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <button className="yellow-btn hover:bg-orange-600">Continue</button>
            <button className="gray-btn hover:bg-gray-400">Cancel</button>
          </div>
          <button className="gray-btn hover:bg-gray-400" onClick={() => router.push("/createprofile/photos")}>Skip</button>
        </div>
      </form>
    </section>
  );
};

export default FormSection;
