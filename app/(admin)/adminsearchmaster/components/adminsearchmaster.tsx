"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

function AdminSearchMaster() {
  const religions = [
    {
      id: "01",
      name: "Sikhism",
      created: "10-10-2024",
      modified: "10-10-2024",
    },
    {
      id: "02",
      name: "Jainism",
      created: "10-10-2024",
      modified: "10-10-2024",
    },
    { id: "03", name: "Shinto", created: "10-10-2024", modified: "10-10-2024" },
    { id: "04", name: "Taoism", created: "10-10-2024", modified: "10-10-2024" },
    {
      id: "05",
      name: "Zoroastrianism",
      created: "10-10-2024",
      modified: "10-10-2024",
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
              <Link href="/adminsearchmaster">Master Data</Link>
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
              <th className="px-5 py-3 w-[100px] border-r">ID</th>
              <th className="px-5 py-3 w-[300px] border-r">Name</th>
              <th className="px-5 py-3 w-[200px] border-r">Created</th>
              <th className="px-5 py-3 w-[200px] border-r">Last Modified</th>
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
                <td className="px-5 py-4 border-r">{religion.modified}</td>
                <td className="px-5 py-4 flex justify-center">
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

export default AdminSearchMaster;
