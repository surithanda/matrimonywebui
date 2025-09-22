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
      <div className="flex border border-gray-300 rounded-lg overflow-x-auto divide-x">
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
              className={`flex items-center gap-2 px-2 py-3 font-medium whitespace-nowrap transition-colors flex-1 justify-start 
    ${
      item.disabled ? "cursor-not-allowed text-gray-400" : "hover:text-gray-800"
    }
    ${
      activeItem === item.id
        ? "border-b-2 border-orange-500 text-orange-600 bg-gradient-to-t from-orange-100 to-white shadow-2xl"
        : "text-gray-600"
    }
  `}
              disabled={item.disabled}
            >
              {/* Checkbox Circle */}
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border text-xs ${
                  activeItem === item.id
                    ? "border-orange-500 bg-orange-500 text-white"
                    : isCompleted
                    ? "border-orange-500 text-orange-500"
                    : "border-gray-400 text-gray-400"
                }`}
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
