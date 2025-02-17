import React from "react";
import Image from "next/image";
import Link from "next/link";
import solarUser from "@/public/images/solar-user.png";
import analysisCard from "@/public/images/analysisCard.png";

function adminlogexception() {
  const logs = [
    {
      timestamp: "Mar 05 14:15:30",
      type: "Network Failure",
      message: "Server unreachable due to high latency",
      module: "Infrastructure",
      impact: "High",
      status: "Resolved",
    },
    {
      timestamp: "Mar 05 14:16:10",
      type: "Database Overload",
      message: "High query load causing slow response",
      module: "Database",
      impact: "High",
      status: "Open",
    },
    {
      timestamp: "Mar 05 14:16:40",
      type: "File Processing",
      message: "Corrupt file detected during parsing",
      module: "Media",
      impact: "Medium",
      status: "Resolved",
    },
    {
      timestamp: "Mar 05 14:17:00",
      type: "Cache Sync Issue",
      message: "Cache not updating across distributed nodes",
      module: "Search",
      impact: "Low",
      status: "Closed",
    },
    {
      timestamp: "Mar 05 14:17:30",
      type: "Backend Crash",
      message: "Unexpected system crash due to memory spike",
      module: "Backend",
      impact: "High",
      status: "Open",
    },
    {
      timestamp: "Mar 05 14:18:00",
      type: "Login Authentication",
      message: "Multiple login failures detected",
      module: "Security",
      impact: "Medium",
      status: "Resolved",
    },
    {
      timestamp: "Mar 05 14:18:20",
      type: "API Downtime",
      message: "External API not responding",
      module: "Integration",
      impact: "Medium",
      status: "Closed",
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
            <Link href="#">Payment Failure</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="#">Exception</Link>
          </li>
        </ul>
      </div>
      <div className="overflow-x-auto p-6 w-full">
        <table className="w-full border border-gray-300 rounded-lg text-sm text-gray-700">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="px-5 py-3 w-[200px] border-r">Timestamp</th>
              <th className="px-5 py-3 w-[200px] border-r">Exception Type</th>
              <th className="px-5 py-3 w-[350px] border-r">Error Message</th>
              <th className="px-5 py-3 w-[150px] border-r">Module</th>
              <th className="px-5 py-3 w-[120px] border-r">User Impact</th>
              <th className="px-5 py-3 w-[120px]">Status</th>
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
                <td className="px-5 py-4 border-r">{log.type}</td>
                <td className="px-5 py-4 border-r">{log.message}</td>
                <td className="px-5 py-4 border-r">{log.module}</td>
                <td
                  className={`px-5 py-4 border-r font-medium ${
                    log.impact === "High"
                      ? "text-red-600"
                      : log.impact === "Medium"
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  {log.impact}
                </td>
                <td
                  className={`px-5 py-4 font-medium ${
                    log.status === "Open"
                      ? "text-red-600"
                      : log.status === "Resolved"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default adminlogexception;
