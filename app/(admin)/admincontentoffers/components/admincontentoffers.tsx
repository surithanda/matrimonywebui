"use client"; // Required for using useState

import React, { useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";

function AdminContentOffers() {
  // Offers data stored in state
  const [offers, setOffers] = useState([
    {
      id: "Q3109",
      title: "New Year Special",
      discount: "25% Off",
      validFrom: "19-10-2020",
      validUntil: "29-10-2020",
      usage: 234,
      status: "Active",
    },
    {
      id: "Q3109",
      title: "Premium Membership Discount",
      discount: "$200 Off",
      validFrom: "19-10-2020",
      validUntil: "29-10-2020",
      usage: 56,
      status: "Active",
    },
    {
      id: "Q3109",
      title: "Valentine's Day Offer",
      discount: "30% Off",
      validFrom: "19-10-2020",
      validUntil: "29-10-2020",
      usage: 0,
      status: "Scheduled",
    },
    {
      id: "Q3109",
      title: "First Time User Bonus",
      discount: "15% Off",
      validFrom: "19-10-2020",
      validUntil: "29-10-2020",
      usage: 789,
      status: "Active",
    },
    {
      id: "Q3109",
      title: "Referral Discount",
      discount: "10% Off",
      validFrom: "19-10-2020",
      validUntil: "29-10-2020",
      usage: 123,
      status: "Active",
    },
  ]);

  // Function to handle delete action
  const handleDelete = (index: any) => {
    const updatedOffers = [...offers];
    updatedOffers.splice(index, 1);
    setOffers(updatedOffers);
  };

  return (
    <div className="mainAdminPanel">
      <div className="adminmainInnerDiv flex flex-col items-start gap-[16px] self-stretch">
        <h1 className="BRCobane28600">Content Management</h1>
        <ul className="adminsearchUl flex h-[47px] p-[4px] items-center gap-[8px] mt-[20px]">
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Latest News</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Events</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="/admincontentoffers">Offers</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Success Stories</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Reviews</Link>
          </li>
        </ul>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto p-6 w-full">
        <table className="w-full border border-gray-300 rounded-lg text-sm text-gray-700">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="px-5 py-3 w-[100px] border-r">ID</th>
              <th className="px-5 py-3 w-[300px] border-r">Title</th>
              <th className="px-5 py-3 w-[150px] border-r">Discount</th>
              <th className="px-5 py-3 w-[150px] border-r">Valid From</th>
              <th className="px-5 py-3 w-[150px] border-r">Valid Until</th>
              <th className="px-5 py-3 w-[100px] border-r">Usage</th>
              <th className="px-5 py-3 w-[120px] border-r">Status</th>
              <th className="px-5 py-3 w-[100px] text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {offers.map((offer, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{offer.id}</td>
                <td className="px-5 py-4 border-r">{offer.title}</td>
                <td className="px-5 py-4 border-r">{offer.discount}</td>
                <td className="px-5 py-4 border-r">{offer.validFrom}</td>
                <td className="px-5 py-4 border-r">{offer.validUntil}</td>
                <td className="px-5 py-4 border-r">{offer.usage}</td>
                <td
                  className={`px-5 py-4 border-r font-medium ${
                    offer.status === "Active"
                      ? "text-green-600"
                      : offer.status === "Scheduled"
                      ? "text-orange-500"
                      : "text-gray-500"
                  }`}
                >
                  {offer.status}
                </td>
                <td className="px-5 py-4 flex justify-center space-x-3">
                  <MdVisibility className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg" />
                  <FaEdit className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg" />
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
    </div>
  );
}

export default AdminContentOffers;
