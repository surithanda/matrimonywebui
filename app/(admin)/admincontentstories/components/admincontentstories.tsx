"use client"; // Required for using useState

import React, { useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdVerified, MdPending, MdVisibility } from "react-icons/md";
import { GiLoveLetter } from "react-icons/gi"; // Used for the new icon in actions

function AdminContentStories() {
  // Success Stories data stored in state
  const [stories, setStories] = useState([
    {
      id: "S12310",
      coupleNames: "Rahul & Pooja Sharma",
      marriageDate: "19-10-2020",
      photos: 5,
      featured: "Yes",
      submissionDate: "19-10-2020",
      verification: "Verified",
    },
    {
      id: "S12310",
      coupleNames: "Amit & Neha Verma",
      marriageDate: "19-10-2020",
      photos: 3,
      featured: "No",
      submissionDate: "19-10-2020",
      verification: "Pending",
    },
    {
      id: "S12310",
      coupleNames: "John & Sarah D’souza",
      marriageDate: "19-10-2020",
      photos: 6,
      featured: "Yes",
      submissionDate: "19-10-2020",
      verification: "Verified",
    },
    {
      id: "S12310",
      coupleNames: "Arjun & Meera Patel",
      marriageDate: "19-10-2020",
      photos: 4,
      featured: "No",
      submissionDate: "19-10-2020",
      verification: "Pending",
    },
    {
      id: "S12310",
      coupleNames: "Karan & Simran Singh",
      marriageDate: "19-10-2020",
      photos: 8,
      featured: "No",
      submissionDate: "19-10-2020",
      verification: "Pending",
    },
  ]);

  // Function to handle delete action
  const handleDelete = (index) => {
    const updatedStories = [...stories];
    updatedStories.splice(index, 1);
    setStories(updatedStories);
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
            <Link href="/admincontentstories">Success Stories</Link>
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
              <th className="px-5 py-3 w-[250px] border-r">Couple Names</th>
              <th className="px-5 py-3 w-[150px] border-r">Marriage Date</th>
              <th className="px-5 py-3 w-[100px] border-r">Photos</th>
              <th className="px-5 py-3 w-[100px] border-r">Featured</th>
              <th className="px-5 py-3 w-[150px] border-r">Submission Date</th>
              <th className="px-5 py-3 w-[120px] border-r">Verification</th>
              <th className="px-5 py-3 w-[120px] text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {stories.map((story, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{story.id}</td>
                <td className="px-5 py-4 border-r font-semibold">
                  {story.coupleNames}
                </td>
                <td className="px-5 py-4 border-r">{story.marriageDate}</td>
                <td className="px-5 py-4 border-r">{story.photos}</td>
                <td className="px-5 py-4 border-r">{story.featured}</td>
                <td className="px-5 py-4 border-r">{story.submissionDate}</td>
                <td
                  className={`px-5 py-4 border-r font-medium ${
                    story.verification === "Verified"
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {story.verification}
                </td>
                <td className="px-5 py-4 flex justify-center space-x-3">
                  {/* Verification Icon */}
                  {story.verification === "Verified" ? (
                    <MdVerified className="text-green-600 text-lg" />
                  ) : (
                    <MdPending className="text-orange-500 text-lg" />
                  )}

                  {/* View Icon */}
                  <MdVisibility className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg" />

                  {/* Edit Icon */}
                  <FaEdit className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg" />

                  {/* Custom Icon for Action (GiLoveLetter) */}
                  <GiLoveLetter className="text-black hover:text-gray-700 cursor-pointer text-lg" />

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

export default AdminContentStories;
