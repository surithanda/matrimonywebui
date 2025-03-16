"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

function AdminSearchIndividual() {
  const profiles = [
    {
      id: "P2239",
      name: "Liam Anderson",
      age: 29,
      location: "San Diego, CA, USA",
      status: "Verified",
    },
    {
      id: "P2139",
      name: "Sophia Martinez",
      age: 26,
      location: "Austin, TX, USA",
      status: "Verified",
    },
    {
      id: "P2039",
      name: "Noah Wilson",
      age: 31,
      location: "New York, NY, USA",
      status: "Not Verified",
    },
    {
      id: "P2929",
      name: "Olivia Brown",
      age: 34,
      location: "Chicago, IL, USA",
      status: "Verified",
    },
    {
      id: "P2279",
      name: "William Taylor",
      age: 28,
      location: "San Francisco, CA, USA",
      status: "Verified",
    },
    {
      id: "P2179",
      name: "Isabella Thomas",
      age: 32,
      location: "Boston, MA, USA",
      status: "Verified",
    },
    {
      id: "P2269",
      name: "James Rodriguez",
      age: 36,
      location: "Seattle, WA, USA",
      status: "Not Verified",
    },
    {
      id: "P2119",
      name: "Emma White",
      age: 40,
      location: "Denver, CO, USA",
      status: "Verified",
    },
    {
      id: "P2109",
      name: "Benjamin Harris",
      age: 38,
      location: "Atlanta, GA, USA",
      status: "Verified",
    },
  ];

  const [status, setStatus] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="mainAdminPanel">
      <div className="partnerupperDiv flex justify-between items-center self-stretch">
        <h3 className="BRCobane32600">Search</h3>
        <div className="flex gap-[10px]">
          <ul className="adminsearchUl flex h-[47px] p-[4px] items-center gap-[8px]">
            <li className="flex p-[12px] items-center gap-[8px]">
              <Link href="#">Partner</Link>
            </li>
            <li className="flex p-[12px] items-center gap-[8px]">
              <Link href="/adminsearchindividual">Individual</Link>
            </li>
            <li className="flex p-[12px] items-center gap-[8px]">
              <Link href="#">Master Data</Link>
            </li>
            <li className="flex p-[12px] items-center gap-[8px]">
              <Link href="#">Payments</Link>
            </li>
          </ul>
          <Link href="#" className="ctm-btn-black">
            Save Changes
          </Link>
          <Link href="#" className="ctm-btn-w">
            <FaFilter className="text-gray-700 text-sm" />
            Filter
          </Link>
        </div>
      </div>
      <div className="partnerlowerDiv flex h-[56px] items-center gap-[12px] self-stretch">
        <div className="relative w-[300px]">
          <select
            className="appearance-none w-full px-4 py-3 border border-transparent bg-[#FDECE4] hover:bg-white text-gray-600 hover:text-black text-sm rounded-lg focus:outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" disabled selected>
              Status
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FaChevronDown className="text-gray-500 text-sm" />
          </div>
        </div>
        <div className="relative w-[300px]">
          <select
            className="appearance-none w-full px-4 py-3 border border-transparent bg-[#FDECE4] hover:bg-white text-gray-600 hover:text-black text-sm rounded-lg focus:outline-none"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
          >
            <option value="" disabled selected>
              Join Date
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FaChevronDown className="text-gray-500 text-sm" />
          </div>
        </div>
        <div className="relative w-[300px]">
          <select
            className="appearance-none w-full px-4 py-3 border border-transparent bg-[#FDECE4] hover:bg-white text-gray-600 hover:text-black text-sm rounded-lg focus:outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="" disabled selected>
              Location
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FaChevronDown className="text-gray-500 text-sm" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto p-6 w-full">
        <table className="w-full border border-gray-300 rounded-lg text-sm text-gray-700">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="px-5 py-3 w-[120px] border-r">Profile ID</th>
              <th className="px-5 py-3 w-[250px] border-r">Name</th>
              <th className="px-5 py-3 w-[80px] border-r">Age</th>
              <th className="px-5 py-3 w-[200px] border-r">Location</th>
              <th className="px-5 py-3 w-[120px] border-r">Status</th>
              <th className="px-5 py-3 w-[100px] text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {profiles.map((profile, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{profile.id}</td>
                <td className="px-5 py-4 border-r">{profile.name}</td>
                <td className="px-5 py-4 border-r">{profile.age}</td>
                <td className="px-5 py-4 border-r">{profile.location}</td>
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

export default AdminSearchIndividual;
