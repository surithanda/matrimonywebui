"use client";
import { useState } from "react";

const PreferencesSection = () => {
  const [ageRange, setAgeRange] = useState(24); // Default age range
  const [religion, setReligion] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");

  return (
    <>
      <h2 className="dmserif32600 text-left w-full">Preferences</h2>

      <div className="age-range-slider">
        <label className="block BRCobane20600 text-gray-950 mb-2">
          Age Range
        </label>
        <div className="age-slider-background flex w-full">
          <div className=" text-gray-600 w-[5%]">{`24-${ageRange}`}</div>
          <input
            type="range"
            min="0"
            max="60"
            value={ageRange}
            onChange={(e) => setAgeRange(Number(e.target.value))}
            className="w-[95%] bg-[#CDCDCD] rounded-full h-1"
          />
        </div>
      </div>

      {/* Select Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Religion */}
        <div className="mb-6 age-range-slider">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Religion
          </label>
          <select
            value={religion}
            onChange={(e) => setReligion(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Religion</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Christian">Christian</option>
            <option value="Sikh">Sikh</option>
          </select>
        </div>

        {/* Education */}
        <div className="mb-6 age-range-slider">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Education
          </label>
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Education</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
            <option value="Postgraduate">Postgraduate</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        {/* Occupation */}
        <div className="mb-6 age-range-slider">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Occupation
          </label>
          <select
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Occupation</option>
            <option value="Engineer">Engineer</option>
            <option value="Doctor">Doctor</option>
            <option value="Teacher">Teacher</option>
            <option value="Artist">Artist</option>
          </select>
        </div>

        {/* Location */}
        <div className="mb-6 age-range-slider">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Chicago">Chicago</option>
            <option value="Austin">Austin</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-start gap-3 mt-8 w-full">
        <button className="yellow-btn hover:bg-orange-600">Save Changes</button>
        <button className="white-btn hover:bg-gray-400">Cancel</button>
      </div>
    </>
  );
};

export default PreferencesSection;
