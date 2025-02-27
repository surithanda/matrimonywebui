import React from "react";
import Image from "next/image";
import Link from "next/link";
import solarUser from "@/public/images/solar-user.png";
import analysisCard from "@/public/images/analysisCard.png";

function adminlogs() {
  const transactions = [
    {
      timestamp: "Feb 10 14:12:05",
      transactionId: "T020103025",
      userId: "U3208745",
      amount: "$12",
      reason: "Insufficient Funds",
    },
    {
      timestamp: "Feb 10 14:12:10",
      transactionId: "T020103026",
      userId: "U3208745",
      amount: "$5",
      reason: "Gateway Timeout",
    },
    {
      timestamp: "Feb 10 14:11:59",
      transactionId: "T020103027",
      userId: "U3208745",
      amount: "$0",
      reason: "Card Declined",
    },
    {
      timestamp: "Feb 10 14:11:40",
      transactionId: "T020103028",
      userId: "U3208745",
      amount: "$4",
      reason: "Invalid OTP",
    },
    {
      timestamp: "Feb 10 14:11:30",
      transactionId: "T020103029",
      userId: "U3208745",
      amount: "$3",
      reason: "Insufficient Funds",
    },
    {
      timestamp: "Feb 10 14:11:20",
      transactionId: "T020103030",
      userId: "U3208745",
      amount: "$6",
      reason: "Insufficient Funds",
    },
    {
      timestamp: "Feb 10 14:11:10",
      transactionId: "T020103031",
      userId: "U3208745",
      amount: "$10",
      reason: "Insufficient Funds",
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
              <th className="px-5 py-3 w-[200px] border-r">Transaction ID</th>
              <th className="px-5 py-3 w-[150px] border-r">User ID</th>
              <th className="px-5 py-3 w-[150px] border-r">Payment Amount</th>
              <th className="px-5 py-3 w-[200px]">Reason</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{transaction.timestamp}</td>
                <td className="px-5 py-4 border-r">
                  {transaction.transactionId}
                </td>
                <td className="px-5 py-4 border-r">{transaction.userId}</td>
                <td className="px-5 py-4 border-r">{transaction.amount}</td>
                <td className="px-5 py-4">{transaction.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default adminlogs;
