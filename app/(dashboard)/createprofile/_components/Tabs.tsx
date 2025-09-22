"use client";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const menuItems = [
  { id: "personal", label: "Personal", link: "/createprofile" },
  {
    id: "contact",
    label: "Address",
    link: "/createprofile/primarycontact",
    disabled: true,
  },
  {
    id: "education",
    label: "Education",
    link: "/createprofile/education",
    disabled: true,
  },
  {
    id: "employment",
    label: "Employment",
    link: "/createprofile/employment",
    disabled: true,
  },
  {
    id: "family",
    label: "Family",
    link: "/createprofile/family",
    disabled: true,
  },
  {
    id: "references",
    label: "Friends & References",
    link: "/createprofile/references",
    disabled: true,
  },
  {
    id: "hobbies",
    label: "Hobbies",
    link: "/createprofile/hobbies",
    disabled: true,
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    link: "/createprofile/lifestyle",
    disabled: true,
  },
  {
    id: "properties",
    label: "Properties",
    link: "/createprofile/property",
    disabled: true,
  },
  {
    id: "photos",
    label: "Photos",
    link: "/createprofile/photos",
    disabled: true,
  },
];

export default function Tabs() {
  const [activeItem, setActiveItem] = useState("personal");
  const { selectedProfileID } = useProfileContext();
  const [menu, setMenu] = useState(menuItems);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Highlight active tab on route change
  useEffect(() => {
    menu.forEach((item) => {
      if (pathname.startsWith(item.link)) setActiveItem(item.id);
    });
  }, [pathname, searchParams, menu]);

  // Unlock tabs when profile is selected
  useEffect(() => {
    if (selectedProfileID) {
      const refreshedMenuItems = menuItems.map((item, index) => ({
        ...item,
        disabled: selectedProfileID > 0 ? false : index !== 0,
      }));
      setMenu(refreshedMenuItems);
    }
  }, [selectedProfileID]);

  return (
    <div>
      {/* Tabs container */}
      <div className="flex justify-start items-start overflow-x-auto rounded-lg bg-white border border-gray-200 p-1 gap-0.5">
        {menu.map((item, index) => {
          const isCompleted =
            menu.findIndex((m) => m.id === activeItem) > index;

          return (
            <button
              key={item.id}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
                setActiveItem(item.id);
                router.push(item.link);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200
            ${
              item.disabled
                ? "cursor-not-allowed text-gray-400 bg-gray-100"
                : "hover:bg-orange-50 hover:text-orange-600"
            }
            ${
              activeItem === item.id
                ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md"
                : "text-gray-600"
            }
            ${index !== menu.length - 1 ? "border-r-2 border-gray-200" : ""}
          `}
              disabled={item.disabled}
            >
              {/* Circle / Check Icon */}
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold
              ${
                activeItem === item.id
                  ? "border-white bg-white text-orange-500"
                  : isCompleted
                  ? "border-orange-500 text-orange-500"
                  : "border-gray-400 text-gray-400"
              }
            `}
              >
                {activeItem === item.id || isCompleted ? "✔" : ""}
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
