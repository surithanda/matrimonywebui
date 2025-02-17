import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
function adminpartner() {
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
  return (
    <div className="mainAdminPanel">
      <div className="partnerupperDiv flex justify-between items-center self-stretch">
        <h3 className="BRCobane32600">Partner Management</h3>
        <Link href="/adminpartnerdetails" className="YellowBtn">
          Add Partner
        </Link>
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

export default adminpartner;
