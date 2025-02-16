"use client";
import { createEmploymentAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const FormSection = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    institution_name: "",
    address_line1: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    start_year: "",
    end_year: "",
    job_title: "",
    last_salary_drawn: "",
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

  const handleAddEmployment = async (e: React.FormEvent) => {
    e.preventDefault();
    const employmentData = {
      profile_id: 51, // You might want to get this dynamically
      ...formData,
      start_year: parseInt(formData.start_year),
      end_year: parseInt(formData.end_year),
    };
    
    try {
      const result = await dispatch(createEmploymentAsync(employmentData)).unwrap();
      if (result) {
        toast.success("Employment details saved successfully!");
        router.push("/createprofile/education");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save employment details");
    }
  };

  return (
    <section className="md:py-5 w-4/5">
      <form className="flex flex-col justify-between h-full w-full box-border md:px-6" onSubmit={handleAddEmployment}>
        <div className="flex flex-wrap justify-between">
          {/* Company and Job Title */}
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                placeholder="Company Name"
                className="account-input-field stretch w-full"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="Job Title"
                className="account-input-field stretch w-full"
              />
            </div>
          </div>

          {/* Start Year and End Year */}
          <div className="flex w-full justify-between mt-4">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Start Year</label>
              <input
                type="number"
                name="start_year"
                value={formData.start_year}
                onChange={handleChange}
                placeholder="Start Year"
                className="account-input-field stretch w-full"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">End Year</label>
              <input
                type="number"
                name="end_year"
                value={formData.end_year}
                onChange={handleChange}
                placeholder="End Year"
                className="account-input-field stretch w-full"
              />
            </div>
          </div>

          {/* Last Salary and Address */}
          <div className="flex w-full justify-between mt-4">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Last Salary Drawn</label>
              <input
                type="text"
                name="last_salary_drawn"
                value={formData.last_salary_drawn}
                onChange={handleChange}
                placeholder="Last Salary"
                className="account-input-field stretch w-full"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleChange}
                placeholder="Company Address"
                className="account-input-field stretch w-full"
              />
            </div>
          </div>

          {/* City, State, Country, Zip */}
          <div className="flex w-full justify-between mt-4 gap-4">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="account-input-field w-1/4"
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="account-input-field w-1/4"
            />
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="account-input-field w-1/4"
            />
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="ZIP"
              className="account-input-field w-1/4"
            />
          </div>

          <button
            type="submit"
            className="gray-btn mt-[20px] hover:bg-gray-400"
          >
            Add Employment
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600">Continue</button>
            <button type="button" className="gray-btn hover:bg-gray-400">Cancel</button>
          </div>
          <button type="button" className="gray-btn hover:bg-gray-400" onClick={() =>router.push("/createprofile/education")}>Skip</button>
        </div>
      </form>
    </section>
  );
};

export default FormSection;
