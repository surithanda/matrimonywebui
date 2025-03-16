"use client"; // Add this line at the top

import React, { useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";

function AdminContentEvents() {
  const [events, setEvents] = useState([
    {
      id: "E21301",
      title: "Speed Dating",
      datetime: "19-10-2020 18:00",
      capacity: 80,
      registrations: 75,
      status: "Upcoming",
    },
    {
      id: "E21301",
      title: "Virtual Matchmaking Fair",
      datetime: "19-10-2020 18:00",
      capacity: 100,
      registrations: 89,
      status: "Upcoming",
    },
    {
      id: "E21301",
      title: "Wedding Planning Workshop",
      datetime: "19-10-2020 18:00",
      capacity: 120,
      registrations: 50,
      status: "Completed",
    },
    {
      id: "E21301",
      title: "Parents Meet and Greet",
      datetime: "19-10-2020 18:00",
      capacity: 200,
      registrations: 9,
      status: "Upcoming",
    },
    {
      id: "E21301",
      title: "Online Relationship Seminar",
      datetime: "19-10-2020 18:00",
      capacity: 500,
      registrations: 399,
      status: "Upcoming",
    },
  ]);

  const handleDelete = (index: any) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
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
            <Link href="/admincontentevents">Events</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Offers</Link>
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
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="px-5 py-3 w-[100px] border-r">ID</th>
              <th className="px-5 py-3 w-[300px] border-r">Title</th>
              <th className="px-5 py-3 w-[180px] border-r">Datetime</th>
              <th className="px-5 py-3 w-[120px] border-r">Capacity</th>
              <th className="px-5 py-3 w-[150px] border-r">Registrations</th>
              <th className="px-5 py-3 w-[150px] border-r">Status</th>
              <th className="px-5 py-3 w-[100px] text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{event.id}</td>
                <td className="px-5 py-4 border-r">{event.title}</td>
                <td className="px-5 py-4 border-r">{event.datetime}</td>
                <td className="px-5 py-4 border-r">{event.capacity}</td>
                <td className="px-5 py-4 border-r">{event.registrations}</td>
                <td
                  className={`px-5 py-4 border-r font-medium ${
                    event.status === "Completed"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {event.status}
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

export default AdminContentEvents;
