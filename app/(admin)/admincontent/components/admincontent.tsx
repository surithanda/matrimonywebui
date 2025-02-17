import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";

function admincontent() {
  const articles = [
    {
      id: "N21831",
      title: "Top 10 Wedding Trends 2024",
      postDate: "19-10-2020",
      publishDate: "19-10-2020",
      views: "1,293",
      status: "Published",
    },
    {
      id: "N21831",
      title: "How to Plan a Destination Wedding",
      postDate: "19-10-2020",
      publishDate: "19-10-2020",
      views: "839",
      status: "Published",
    },
    {
      id: "N21831",
      title: "Budget Wedding Tips",
      postDate: "19-10-2020",
      publishDate: "—",
      views: "0",
      status: "Draft",
    },
    {
      id: "N21831",
      title: "Modern Matrimony Success Rate Study",
      postDate: "19-10-2020",
      publishDate: "—",
      views: "0",
      status: "Draft",
    },
    {
      id: "N21831",
      title: "Cultural Wedding Ceremonies Guide",
      postDate: "19-10-2020",
      publishDate: "19-10-2020",
      views: "89",
      status: "Published",
    },
  ];

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
            <Link href="/admincontentoffers">Offers</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="/admincontentstories">Success Stories</Link>
          </li>
          <li className="flex p-[12px] items-center gap-[8px]">
            <Link href="/admincontentreviews">Reviews</Link>
          </li>
        </ul>
      </div>
      <div className="overflow-x-auto p-6 w-full">
        <table className="w-full border border-gray-300 rounded-lg text-sm text-gray-700">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border border-gray-300 text-left text-[14px] font-semibold">
              <th className="px-5 py-3 w-[100px] border-r">ID</th>
              <th className="px-5 py-3 w-[300px] border-r">Title</th>
              <th className="px-5 py-3 w-[150px] border-r">Post Date</th>
              <th className="px-5 py-3 w-[150px] border-r">Publish Date</th>
              <th className="px-5 py-3 w-[100px] border-r">Views</th>
              <th className="px-5 py-3 w-[120px] border-r">Status</th>
              <th className="px-5 py-3 w-[100px] text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {articles.map((article, index) => (
              <tr
                key={index}
                className="bg-white text-[14px] border border-gray-300"
              >
                <td className="px-5 py-4 border-r">{article.id}</td>
                <td className="px-5 py-4 border-r">{article.title}</td>
                <td className="px-5 py-4 border-r">{article.postDate}</td>
                <td className="px-5 py-4 border-r">{article.publishDate}</td>
                <td className="px-5 py-4 border-r">{article.views}</td>
                <td
                  className={`px-5 py-4 border-r font-medium ${
                    article.status === "Published"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {article.status}
                </td>
                <td className="px-5 py-4 flex justify-center space-x-3">
                  <MdVisibility className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg" />
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

export default admincontent;
