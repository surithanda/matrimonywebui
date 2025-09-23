"use client";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { usePathname, useSearchParams, useRouter, useParams, notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import { isValidProfileMode, type ProfileMode } from "../types/profileMode";

export default function Tabs() {
  const params = useParams();
  const mode = (params.mode as string);
  
  // Validate mode parameter
  if (!isValidProfileMode(mode)) {
    notFound();
  }
  
  // Now we can safely use mode as ProfileMode
  const validMode: ProfileMode = mode;

  const menuItems = [
  { id: "personal", label: "Personal", link: `/${validMode}` },
  {
    id: "contact",
    label: "Address",
    link: `/${validMode}/primarycontact`,
    disabled: true,
  },
  {
    id: "education",
    label: "Education",
    link: `/${validMode}/education`,
    disabled: true,
  },
  {
    id: "employment",
    label: "Employment",
    link: `/${validMode}/employment`,
    disabled: true,
  },
  {
    id: "family",
    label: "Family",
    link: `/${validMode}/family`,
    disabled: true,
  },
  {
    id: "references",
    label: "Friends & References",
    link: `/${validMode}/references`,
    disabled: true,
  },
  {
    id: "hobbies",
    label: "Hobbies",
    link: `/${validMode}/hobbies`,
    disabled: true,
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    link: `/${validMode}/lifestyle`,
    disabled: true,
  },
  {
    id: "properties",
    label: "Properties",
    link: `/${validMode}/property`,
    disabled: true,
  },
  {
    id: "photos",
    label: "Photos",
    link: `/${validMode}/photos`,
    disabled: true,
  },
];

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

  // Unlock tabs based on mode and profile selection
  useEffect(() => {
    // Enable tabs if:
    // 1. Update mode with selected profile (selectedProfileID > 0)
    // 2. Create mode (regardless of selectedProfileID value)
    const shouldEnableTabs = validMode === 'updateprofile' || selectedProfileID > 0;
    
    if (shouldEnableTabs) {
      const refreshedMenuItems = menuItems.map((item, index) => ({
        ...item,
        disabled: index !== 0 ? false : false, // Enable all tabs when conditions are met
      }));
      setMenu(refreshedMenuItems);
    } else {
      // Disable all tabs except the first one when no profile is selected in update mode
      const refreshedMenuItems = menuItems.map((item, index) => ({
        ...item,
        disabled: index !== 0,
      }));
      setMenu(refreshedMenuItems);
    }
  }, [selectedProfileID, validMode]);

  return (
    <div>
      {/* Tabs container */}
      <div className="flex justify-start items-start overflow-x-auto rounded-lg bg-white border border-gray-200 p-1 2xl:gap-2">
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
              className={`flex items-center gap-2 px-[15.5px] 2xl:px-[1.9rem] py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200
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
