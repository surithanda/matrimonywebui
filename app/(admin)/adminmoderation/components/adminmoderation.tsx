import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegComment, FaUserSlash } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

function adminmoderation() {
  const messages = [
    {
      id: "MSG2189",
      preview: "Hey, contact me at 98xxx...",
      sender: "Raj_Kumar",
      receiver: "Priya_S",
      flag: "High",
      timestamp: "19-01-2024 10:30",
      status: "Pending",
    },
    {
      id: "MSG2189",
      preview: "You look **** why did...",
      sender: "neha1995",
      receiver: "Amit_Shah",
      flag: "High",
      timestamp: "19-01-2024 10:30",
      status: "Pending",
    },
    {
      id: "MSG2189",
      preview: "Check my business at ...",
      sender: "kiran_P",
      receiver: "Maria_F",
      flag: "Medium",
      timestamp: "19-01-2024 10:30",
      status: "Reviewed",
    },
    {
      id: "MSG2189",
      preview: "Your profile is fake...",
      sender: "Poojas",
      receiver: "SureshM",
      flag: "Low",
      timestamp: "19-01-2024 10:30",
      status: "Pending",
    },
  ];
  return (
    <div className="mainAdminPanel">
      <div className="adminmainInnerDiv flex flex-col items-start gap-[16px] self-stretch">
        <h1 className="BRCobane28600">Moderation</h1>
        <div className="adminDashCardDiv flex flex-col items-start gap-[16px] self-stretch">
          <div className="adminDashCardRowOne flex items-center gap-[16px] self-stretch">
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Total Flagged Messages</span>
                <h4 className="BRCobane20600">45</h4>
              </div>
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Messages Reviewed Today</span>
                <h4 className="BRCobane20600">23</h4>
              </div>
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">High Priority Flags</span>
                <h4 className="BRCobane20600">12</h4>
              </div>
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Active Moderators</span>
                <h4 className="BRCobane20600">8</h4>
              </div>
            </div>
          </div>
        </div>
        <ul className="adminsearchUl flex h-[47px] p-[4px] items-center gap-[8px] mt-[20px]">
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Message Moderation</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Role Management</Link>
          </li>
        </ul>
      </div>
      <div className="overflow-x-auto p-6">
        <table className="w-full border border-gray-300 rounded-lg text-sm text-gray-700">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="px-5 py-3 w-[100px] border-r">ID</th>
              <th className="px-5 py-3 w-[250px] border-r">Message Preview</th>
              <th className="px-5 py-3 w-[150px] border-r">Sender</th>
              <th className="px-5 py-3 w-[150px] border-r">Receiver</th>
              <th className="px-5 py-3 w-[100px] border-r">Flag</th>
              <th className="px-5 py-3 w-[170px] border-r">Timestamp</th>
              <th className="px-5 py-3 w-[120px] border-r">Status</th>
              <th className="px-5 py-3 w-[120px] text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {messages.map((message, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{message.id}</td>
                <td className="px-5 py-4 border-r truncate">
                  {message.preview}
                </td>
                <td className="px-5 py-4 border-r">{message.sender}</td>
                <td className="px-5 py-4 border-r">{message.receiver}</td>
                <td className="px-5 py-4 border-r">{message.flag}</td>
                <td className="px-5 py-4 border-r">{message.timestamp}</td>
                <td
                  className={`px-5 py-4 border-r font-medium ${
                    message.status === "Pending"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {message.status}
                </td>
                <td className="px-5 py-4 flex justify-center space-x-3">
                  <FaRegComment className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg" />
                  <MdVerified className="text-green-500 hover:text-green-700 cursor-pointer text-lg" />
                  <FaUserSlash className="text-red-500 hover:text-red-700 cursor-pointer text-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default adminmoderation;
