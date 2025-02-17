"use client";
import { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    nationality: "",
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
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            {/* Gender */}
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            {/* Email */}
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Nationality</label>
              <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {/* Primary and Secondary Phone */}
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Religion</label>
              <input
                type="text"
                name="religion"
                placeholder="Religion"
                value={formData.religion}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            {/* Primary and Secondary Phone */}
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Primary Phone</label>
              <input
                type="text"
                name="primaryPhone"
                placeholder="Primary Phone"
                value={formData.primaryPhone}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            {/* Primary and Secondary Phone */}
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Height</label>
              <input
                type="text"
                name="height"
                placeholder="Height"
                value={formData.height}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Weight</label>
              <input
                type="text"
                name="Weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            {/* Primary and Secondary Phone */}
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Disability</label>
              <input
                type="text"
                name="disability"
                placeholder="Disability"
                value={formData.disability}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Profession</label>
              <input
                type="text"
                name="profession"
                placeholder="Profession"
                value={formData.profession}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex w-full justify-between">
            {/* Primary and Secondary Phone */}
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Marital Status</label>
              <input
                type="text"
                name="maritalStatus"
                placeholder="Marital Status"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">
                Emergency Phone
              </label>
              <input
                type="text"
                name="emergencyPhone"
                placeholder="Emergency Phone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">
                Brief summary about you
              </label>
              <textarea
                name="summary"
                placeholder="A success story, achievement, divorce information or any other information that your partner should know before getting connected"
                value={formData.summary}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-start gap-4 mt-6">
          <button className="yellow-btn hover:bg-orange-600">Continue</button>
          <button className="gray-btn hover:bg-gray-400">Cancel</button>
        </div>
      </form>
    </section>
  );
};

export default Page;
