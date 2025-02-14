"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaBook,
  FaBriefcase,
  FaPaintBrush,
  FaRegNewspaper,
  FaRunning,
  FaUsers,
  FaHome,
  FaImages,
  FaLink,
} from "react-icons/fa";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Personal");

  const menuItems = [
    { name: "Personal", icon: <FaUser />, link: "#personal" },
    {
      name: "Primary Contact",
      icon: <FaPhone />,
      link: "primarycontact",
    },
    { name: "Education", icon: <FaBook />, link: "education" },
    {
      name: "Profession",
      icon: <FaBriefcase />,
      link: "profession",
    },
    { name: "Hobbies", icon: <FaPaintBrush />, link: "hobbies" },
    // { name: "Interests", icon: <FaRegNewspaper />, link: "#interests" },
    { name: "Lifestyle", icon: <FaRunning />, link: "lifestyle" },
    { name: "Family", icon: <FaUsers />, link: "family" },
    { name: "References", icon: <FaHome />, link: "references" },
    { name: "Property", icon: <FaImages />, link: "property" },
    { name: "Photos", icon: <FaImages />, link: "photos" },
    { name: "Partner", icon: <FaLink />, link: "partner" },
  ];

  return (
    <div className="w-1/5 border-r border-[#E6E6E6]">
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            onClick={() => setActiveItem(item.name)}
            className={`flex items-center py-3 px-5 BRCobane18500 hover:bg-gray-200 ${
              activeItem === item.name ? "bg-[#F5F5F5]" : ""
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
