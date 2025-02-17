import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
function adminprofiles() {
  const profiles = [
    {
      id: "P1239",
      name: "Sudha Vishwakumari",
      age: 21,
      location: "Houston, TX, USA",
      status: "Not Verified",
    },
    {
      id: "P1139",
      name: "Zara Abbas",
      age: 24,
      location: "New Jersey",
      status: "Verified",
    },
    {
      id: "P1039",
      name: "Anaya Patel",
      age: 27,
      location: "Los Angeles, CA, USA",
      status: "Verified",
    },
    {
      id: "P1929",
      name: "Aarav Gupta",
      age: 30,
      location: "Miami, FL, USA",
      status: "Verified",
    },
    {
      id: "P1279",
      name: "Mila Chang",
      age: 33,
      location: "Chicago, IL, USA",
      status: "Verified",
    },
    {
      id: "P1179",
      name: "Kian Singh",
      age: 36,
      location: "Seattle, WA, USA",
      status: "Verified",
    },
    {
      id: "P1269",
      name: "Rohan Kumar",
      age: 39,
      location: "Boston, MA, USA",
      status: "Verified",
    },
    {
      id: "P1119",
      name: "Ayaan Shah",
      age: 42,
      location: "Denver, CO, USA",
      status: "Verified",
    },
    {
      id: "P1109",
      name: "Nina Patel",
      age: 45,
      location: "Atlanta, GA, USA",
      status: "Verified",
    },
    {
      id: "P1339",
      name: "Rhea Sharma",
      age: 48,
      location: "Dallas, TX, USA",
      status: "Verified",
    },
    {
      id: "P1009",
      name: "Aadi Mehta",
      age: 51,
      location: "San Francisco, CA, USA",
      status: "Verified",
    },
  ];
  return (
    <div className="mainAdminPanel">
      <div className="partnerupperDiv flex justify-between items-center self-stretch">
        <h3 className="BRCobane32600">Partner Management</h3>
        <Link href="/register" className="YellowBtn">
          Add Partner
        </Link>
      </div>
      <div className="overflow-x-auto p-6 w-full">
        <table className="w-full border border-gray-300 rounded-lg text-sm text-gray-700">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="p-[12px_16px] w-[100px] border-r">Profile ID</th>
              <th className="p-[12px_16px] w-[600px] border-r">Name</th>
              <th className="p-[12px_16px] w-[80px] border-r">Age</th>
              <th className="p-[12px_16px] w-[200px] border-r">Location</th>
              <th className="p-[12px_16px] w-[130px] border-r">Status</th>
              <th className="p-[12px_16px] w-[80px] text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {profiles.map((profile, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="p-[12px_16px] border-r">{profile.id}</td>
                <td className="p-[12px_16px] border-r">{profile.name}</td>
                <td className="p-[12px_16px] border-r">{profile.age}</td>
                <td className="p-[12px_16px] border-r">{profile.location}</td>
                <td
                  className={`px-5 py-4 border-r font-medium ${
                    profile.status === "Verified"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {profile.status}
                </td>
                <td className="px-5 py-4 flex justify-center space-x-3">
                  <FaEdit className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg" />
                  <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer text-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default adminprofiles;
