import React from "react";
import Image from "next/image";
import Link from "next/link";
import solarUser from "@/public/images/solar-user.png";
import analysisCard from "@/public/images/analysisCard.png";

function adminlogs() {
  const logs = [
    {
      timestamp: "Jan 20 11:15:10",
      email: "john.doe@gmail.com",
      ip: "192.168.1.10",
      device: "Desktop",
      browser: "Chrome",
      location: "California",
      reason: "Invalid Password",
    },
    {
      timestamp: "Jan 20 11:15:12",
      email: "jane.smith@gmail.com",
      ip: "175.162.45.23",
      device: "Laptop",
      browser: "Firefox",
      location: "Texas",
      reason: "Account Locked",
    },
    {
      timestamp: "Jan 20 11:15:14",
      email: "michael.brown@gmail.com",
      ip: "85.126.100.210",
      device: "Mobile (iOS)",
      browser: "Safari",
      location: "New York",
      reason: "Suspicious Activity",
    },
    {
      timestamp: "Jan 20 11:15:16",
      email: "emma.jones@gmail.com",
      ip: "154.200.215.198",
      device: "Tablet",
      browser: "Edge",
      location: "Florida",
      reason: "Invalid Password",
    },
    {
      timestamp: "Jan 20 11:15:18",
      email: "david.miller@gmail.com",
      ip: "220.198.136.65",
      device: "Mobile (Android)",
      browser: "Opera",
      location: "Arizona",
      reason: "Invalid Password",
    },
    {
      timestamp: "Jan 20 11:15:20",
      email: "sophia.wilson@gmail.com",
      ip: "193.175.102.89",
      device: "All",
      browser: "Brave",
      location: "Ohio",
      reason: "Account Locked",
    },
    {
      timestamp: "Jan 20 11:15:22",
      email: "william.anderson@gmail.com",
      ip: "198.102.77.24",
      device: "Desktop",
      browser: "Vivaldi",
      location: "Colorado",
      reason: "Invalid Password",
    },
    {
      timestamp: "Jan 20 11:15:24",
      email: "olivia.thomas@gmail.com",
      ip: "203.180.92.17",
      device: "Laptop",
      browser: "Samsung Internet",
      location: "Nevada",
      reason: "Invalid Password",
    },
  ];
  return (
    <div className="mainAdminPanel">
      <div className="adminmainInnerDiv flex flex-col items-start gap-[16px] self-stretch">
        <h1 className="BRCobane28600">Admin Dashboard</h1>
        <div className="adminDashCardDiv flex flex-col items-start gap-[16px] self-stretch">
          <div className="adminDashCardRowOne flex items-center gap-[16px] self-stretch">
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Login Failures (Today)</span>
                <h4 className="BRCobane20600">80</h4>
              </div>
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Failed Payments (24h)</span>
                <h4 className="BRCobane20600">8</h4>
              </div>
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Active Users Count</span>
                <h4 className="BRCobane20600">802</h4>
              </div>
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Server Response Time</span>
                <h4 className="BRCobane20600">180s</h4>
              </div>
            </div>
          </div>
        </div>
        <ul className="adminsearchUl flex h-[47px] p-[4px] items-center gap-[8px] mt-[20px]">
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Log Failure</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="/adminlogpayfails">Payment Failure</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="/adminlogexception">Exception</Link>
          </li>
        </ul>
      </div>
      <div className="overflow-x-auto p-6 w-full">
        <table className="w-full border border-gray-300 rounded-lg text-sm text-gray-700">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="px-5 py-3 w-[150px] border-r">Timestamp</th>
              <th className="px-5 py-3 w-[200px] border-r">Email</th>
              <th className="px-5 py-3 w-[150px] border-r">IP Address</th>
              <th className="px-5 py-3 w-[180px] border-r">Device Info</th>
              <th className="px-5 py-3 w-[160px] border-r">Browser</th>
              <th className="px-5 py-3 w-[140px] border-r">Location</th>
              <th className="px-5 py-3 w-[160px]">Reason</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {logs.map((log, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{log.timestamp}</td>
                <td className="px-5 py-4 border-r">{log.email}</td>
                <td className="px-5 py-4 border-r">{log.ip}</td>
                <td className="px-5 py-4 border-r">{log.device}</td>
                <td className="px-5 py-4 border-r">{log.browser}</td>
                <td className="px-5 py-4 border-r">{log.location}</td>
                <td className="px-5 py-4">{log.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default adminlogs;
