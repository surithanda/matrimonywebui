"use client"; // Required for using useState

import React, { useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdVerified, MdPending } from "react-icons/md";
import { GiRotaryPhone } from "react-icons/gi"; // Used for the new icon in actions

function AdminContentReviews() {
  // Reviews data stored in state
  const [reviews, setReviews] = useState([
    {
      id: "R21310",
      userName: "Vikram Singh",
      rating: 5,
      reviewText: "Found my perfect match within 2 months",
      reports: 0,
      datePosted: "19-10-2020",
      status: "Approved",
    },
    {
      id: "R21310",
      userName: "Meera Kapoor",
      rating: 4,
      reviewText: "Good experience, helpful customer service",
      reports: 0,
      datePosted: "19-10-2020",
      status: "Approved",
    },
    {
      id: "R21310",
      userName: "Raj Kumar",
      rating: 2,
      reviewText: "Limited profiles in my area",
      reports: 1,
      datePosted: "19-10-2020",
      status: "Pending",
    },
    {
      id: "R21310",
      userName: "Puja Malhotra",
      rating: 5,
      reviewText: "Premium membership worth every penny",
      reports: 0,
      datePosted: "19-10-2020",
      status: "Approved",
    },
    {
      id: "R21310",
      userName: "Arun Sharma",
      rating: 4,
      reviewText: "Easy to use interface, good matches",
      reports: 3,
      datePosted: "19-10-2020",
      status: "Approved",
    },
  ]);

  // Function to handle delete action
  const handleDelete = (index: any) => {
    const updatedReviews = [...reviews];
    updatedReviews.splice(index, 1);
    setReviews(updatedReviews);
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
            <Link href="#">Offers</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Success Stories</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="/admincontentreviews">Reviews</Link>
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
              <th className="px-5 py-3 w-[200px] border-r">User Name</th>
              <th className="px-5 py-3 w-[100px] border-r">Rating</th>
              <th className="px-5 py-3 w-[350px] border-r">Review Text</th>
              <th className="px-5 py-3 w-[100px] border-r">Reports</th>
              <th className="px-5 py-3 w-[150px] border-r">Date Posted</th>
              <th className="px-5 py-3 w-[120px] border-r">Status</th>
              <th className="px-5 py-3 w-[120px] text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {reviews.map((review, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{review.id}</td>
                <td className="px-5 py-4 border-r">{review.userName}</td>
                <td className="px-5 py-4 border-r text-center">
                  {review.rating}
                </td>
                <td className="px-5 py-4 border-r">{review.reviewText}</td>
                <td className="px-5 py-4 border-r text-center">
                  {review.reports}
                </td>
                <td className="px-5 py-4 border-r">{review.datePosted}</td>
                <td
                  className={`px-5 py-4 border-r font-medium ${
                    review.status === "Approved"
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {review.status}
                </td>
                <td className="px-5 py-4 flex justify-center space-x-3">
                  {/* Status Icon */}
                  {review.status === "Approved" ? (
                    <MdVerified className="text-green-600 text-lg" />
                  ) : (
                    <MdPending className="text-orange-500 text-lg" />
                  )}

                  {/* Call Icon */}
                  <GiRotaryPhone className="text-black hover:text-gray-700 cursor-pointer text-lg" />

                  {/* Edit Icon */}
                  <FaEdit className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg" />

                  {/* Delete Icon */}
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

export default AdminContentReviews;
