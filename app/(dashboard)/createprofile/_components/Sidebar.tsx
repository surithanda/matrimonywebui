"use client";
import { useProfileContext } from "@/app/utils/useProfileContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
  const { selectedProfileID } = useProfileContext();

  const menuItems = [
    { name: "Personal", icon: <FaUser />, link: "/createprofile", disabled: false },
    {
      name: "Primary Contact",
      icon: <FaPhone />,
      link: "/createprofile/primarycontact",
      disabled: true
    },
    { name: "Education", icon: <FaBook />, link: "/createprofile/education", disabled: true },
    {
      name: "Employment",
      icon: <FaBriefcase />,
      link: "/createprofile/employment",
      disabled: true
    },
    { name: "Hobbies", icon: <FaPaintBrush />, link: "/createprofile/hobbies", disabled: true },
    { name: "Lifestyle", icon: <FaRunning />, link: "/createprofile/lifestyle", disabled: true },
    { name: "Family", icon: <FaUsers />, link: "/createprofile/family", disabled: true },
    { name: "References", icon: <FaHome />, link: "/createprofile/references", disabled: true },
    { name: "Property", icon: <FaImages />, link: "/createprofile/property", disabled: true },
    { name: "Photos", icon: <FaImages />, link: "/createprofile/photos", disabled: true },
    // { name: "Partner", icon: <FaLink />, link: "/createprofile/partner" },
  ];

  const [menu, setMenu] = useState(menuItems);
  
  useEffect(() => {
    if(selectedProfileID) {
      let refreshedMenuItems;
      if(selectedProfileID > 0) 
        refreshedMenuItems = menuItems.map((item) => {return {...item, disabled: false}})
      else
        refreshedMenuItems = menuItems.map((item, index) => {return {...item, disabled: index === 0 ? false : true}})

      setMenu(refreshedMenuItems);
    }
  }, [selectedProfileID])

  return (
    <div className="w-1/5 border-r border-[#E6E6E6]">
      <nav className="flex flex-col">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            onClick={e => {
              if (item.disabled) {
                e.preventDefault();
                return;
              }
              setActiveItem(item.name);
            }}
            className={`flex items-center py-3 px-5 BRCobane18500 ${
              item.disabled
                ? "opacity-50 cursor-not-allowed bg-transparent"
                : "hover:bg-gray-200"
            } ${activeItem === item.name ? "bg-[#F5F5F5]" : ""}`}
            tabIndex={item.disabled ? -1 : 0}
            aria-disabled={item.disabled ? "true" : undefined}
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
