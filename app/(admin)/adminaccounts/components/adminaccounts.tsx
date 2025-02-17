import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
function adminaccounts() {
  const users = [
    {
      id: "U1239",
      name: "Sudha Vishwakumari",
      lastLogin: "09-09-2024 12:00:00 AM",
      status: "Active",
    },
    {
      id: "U1139",
      name: "Zara Abbas",
      lastLogin: "09-09-2024 01:00:00 AM",
      status: "Active",
    },
    {
      id: "U1039",
      name: "Anaya Patel",
      lastLogin: "09-09-2024 02:00:00 AM",
      status: "Active",
    },
    {
      id: "U1929",
      name: "Aarav Gupta",
      lastLogin: "09-09-2024 03:00:00 AM",
      status: "Active",
    },
    {
      id: "U1279",
      name: "Mila Chang",
      lastLogin: "09-09-2024 04:00:00 AM",
      status: "Active",
    },
    {
      id: "U1179",
      name: "Kian Singh",
      lastLogin: "09-09-2024 05:00:00 AM",
      status: "Active",
    },
    {
      id: "U1269",
      name: "Rohan Kumar",
      lastLogin: "09-09-2024 06:00:00 AM",
      status: "Active",
    },
    {
      id: "U1119",
      name: "Ayaan Shah",
      lastLogin: "09-09-2024 07:00:00 AM",
      status: "Active",
    },
    {
      id: "U1109",
      name: "Nina Patel",
      lastLogin: "09-09-2024 08:00:00 AM",
      status: "Active",
    },
    {
      id: "U1339",
      name: "Rhea Sharma",
      lastLogin: "09-09-2024 09:00:00 AM",
      status: "Active",
    },
    {
      id: "U1009",
      name: "Aadi Mehta",
      lastLogin: "09-09-2024 10:00:00 AM",
      status: "Active",
    },
  ];
  return (
    <div className="mainAdminPanel">
      <div className="partnerupperDiv flex justify-between items-center self-stretch">
        <h3 className="BRCobane32600">Account Management</h3>
        <Link href="/register" className="YellowBtn">
          Add Partner
        </Link>
      </div>
      <div className="overflow-x-auto p-6 w-full">
        <table className="w-full border border-gray-300 rounded-lg text-sm text-gray-700">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="px-5 py-3 w-[100px] border-r">User ID</th>
              <th className="px-5 py-3 w-[556px] border-r">User Name</th>
              <th className="px-5 py-3 w-[250px] border-r">Last Login</th>
              <th className="px-5 py-3 w-[120px] border-r">Status</th>
              <th className="px-5 py-3 w-[80px] text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{user.id}</td>
                <td className="px-5 py-4 border-r">{user.name}</td>
                <td className="px-5 py-4 border-r">{user.lastLogin}</td>
                <td className="px-5 py-4 border-r font-medium text-green-600">
                  {user.status}
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

export default adminaccounts;
