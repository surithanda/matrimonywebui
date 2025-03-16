"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

function AdminSearch() {
  const partners = [
    {
      id: "P1239",
      name: "Shaadi.com",
      referral: "shaadi290",
      location: "Delhi, India",
      date: "09-09-2024",
      status: "Active",
    },
    {
      id: "P1139",
      name: "Holymatrimony",
      referral: "holy29",
      location: "Houston, TX",
      date: "09-09-2024",
      status: "Active",
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
        <table className="w-full border border-gray-300 rounded-[10px] text-sm text-gray-700">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="p-[12px_16px] w-[110px] border-r">Partner ID</th>
              <th className="p-[12px_16px] w-[556px] h-[21px] border-r">
                Partner Name
              </th>
              <th className="p-[12px_16px] w-[130px] border-r">
                Referral Code
              </th>
              <th className="p-[12px_16px] w-[150px] border-r">Location</th>
              <th className="p-[12px_16px] w-[160px] border-r">Join Date</th>
              <th className="p-[12px_16px] border-r">Status</th>
              <th className="p-[12px_16px] text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {partners.map((partner, index) => (
              <tr
                key={index}
                className="bg-white text-[16px] border border-gray-300"
              >
                <td className="p-[12px_16px] border-r">{partner.id}</td>
                <td className="p-[12px_16px] border-r">{partner.name}</td>
                <td className="p-[12px_16px] border-r">{partner.referral}</td>
                <td className="p-[12px_16px] border-r">{partner.location}</td>
                <td className="p-[12px_16px] border-r font-semibold">
                  {partner.date}
                </td>
                <td className="px-5 py-4 border-r font-medium text-green-600">
                  {partner.status}
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

export default AdminSearch;
