"use client"; // Required for using useState

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

function AdminMasterData() {
  // Master Data - Religion Data stored in state
  const [religions, setReligions] = useState([
    {
      id: "01",
      name: "Hinduism",
      created: "09-09-2024",
      modified: "09-09-2024",
    },
    {
      id: "02",
      name: "Buddhism",
      created: "09-10-2024",
      modified: "09-10-2024",
    },
    {
      id: "03",
      name: "Christianity",
      created: "09-11-2024",
      modified: "09-11-2024",
    },
    { id: "04", name: "Islam", created: "09-12-2024", modified: "09-12-2024" },
    {
      id: "05",
      name: "Judaism",
      created: "09-13-2024",
      modified: "09-13-2024",
    },
  ]);

  // Function to handle delete action
  const handleDelete = (index: any) => {
    const updatedReligions = [...religions];
    updatedReligions.splice(index, 1);
    setReligions(updatedReligions);
  };

  return (
    <div className="mainAdminPanel">
      <div className="adminmainInnerDiv flex flex-col items-start gap-[16px] self-stretch">
        <h2 className="BRCobane32600 mb-[34px]">Master Data</h2>
        {/* White Container */}
        <div className="bg-white shadow-md rounded-lg w-[100%] flex p-6">
          {/* Sidebar */}
          <div className="w-[237px] pr-5 border-r">
            <ul className="space-y-4 text-gray-600 text-[14px] flex flex-col gap-[10px]">
              <li className="BRCobane18500 cursor-pointer">Religion Data</li>
              <li className="BRCobane18500 cursor-pointer">Caste/Community</li>
              <li className="BRCobane18500 cursor-pointer">
                Education Qualifications
              </li>
              <li className="BRCobane18500 cursor-pointer">Professions</li>
              <li className="BRCobane18500 cursor-pointer">Locations</li>
              <li className="BRCobane18500 cursor-pointer">Languages</li>
              <li className="BRCobane18500 cursor-pointer">Star Signs</li>
              <li className="BRCobane18500 cursor-pointer">Diet Preferences</li>
              <li className="BRCobane18500 cursor-pointer">
                Marital Status Types
              </li>
              <li className="BRCobane18500 cursor-pointer">Membership Plans</li>
              <li className="BRCobane18500 cursor-pointer">Payment Types</li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-[100%] pl-6">
            {/* Breadcrumb */}
            <div className="text-gray-600 text-sm mb-5">
              <span className="font-semibold">Master Data</span> &gt;{" "}
              <span className="text-black font-semibold">Religion Data</span>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full text-sm text-gray-700">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#EBEBEB] border border-gray-300 text-left text-[14px] font-semibold">
                    <th className="px-5 py-3 w-[50px] border-r">ID</th>
                    <th className="px-5 py-3 w-[250px] border-r">Name</th>
                    <th className="px-5 py-3 w-[150px] border-r">Created</th>
                    <th className="px-5 py-3 w-[150px] border-r">
                      Last Modified
                    </th>
                    <th className="px-5 py-3 w-[100px] text-center">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {religions.map((religion, index) => (
                    <tr
                      key={index}
                      className="bg-white text-[14px] border border-gray-300"
                    >
                      <td className="px-5 py-4 border-r">{religion.id}</td>
                      <td className="px-5 py-4 border-r">{religion.name}</td>
                      <td className="px-5 py-4 border-r">{religion.created}</td>
                      <td className="px-5 py-4 border-r">
                        {religion.modified}
                      </td>
                      <td className="px-5 py-4 flex justify-center">
                        <FaTrash
                          className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
                          onClick={() => handleDelete(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Entry Button */}
            <div className="mt-6">
              <button className="px-4 py-2 bg-[#F5F5F5] text-black rounded-lg border border-gray-300 hover:bg-[#F3DBCE]">
                Add Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMasterData;
