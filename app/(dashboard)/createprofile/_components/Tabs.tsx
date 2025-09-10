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
  }, [pathname, searchParams]);

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
              className={`flex items-center gap-1 px-2 py-3 font-medium whitespace-nowrap transition-colors flex-1 justify-center 
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
