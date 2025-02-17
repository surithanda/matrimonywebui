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
      link: "createprofile/primarycontact",
    },
    { name: "Education", icon: <FaBook />, link: "createprofile/education" },
    {
      name: "Profession",
      icon: <FaBriefcase />,
      link: "createprofile/profession",
    },
    { name: "Hobbies", icon: <FaPaintBrush />, link: "createprofile/hobbies" },
    // { name: "Interests", icon: <FaRegNewspaper />, link: "#interests" },
    { name: "Lifestyle", icon: <FaRunning />, link: "createprofile/lifestyle" },
    { name: "Family", icon: <FaUsers />, link: "createprofile/family" },
    { name: "References", icon: <FaHome />, link: "createprofile/references" },
    { name: "Property", icon: <FaImages />, link: "createprofile/property" },
    { name: "Photos", icon: <FaImages />, link: "createprofile/photos" },
    { name: "Partner", icon: <FaLink />, link: "createprofile/partner" },
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
