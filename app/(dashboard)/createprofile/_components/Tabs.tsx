"use client";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const menuItems = [
  { id: "personal", label: "Personal", icon: "👤", link: "/createprofile" },
  { id: "contact", label: "Address", icon: "📍", link: "/createprofile/primarycontact", disabled: true },
  { id: "education", label: "Education", icon: "🎓", link: "/createprofile/education", disabled: true },
  { id: "employment", label: "Employment", icon: "💼", link: "/createprofile/employment", disabled: true },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦", link: "/createprofile/family", disabled: true },
  { id: "references", label: "Friends & References", icon: "🧘", link: "/createprofile/references", disabled: true },
  { id: "hobbies", label: "Hobbies", icon: "🎯", link: "/createprofile/hobbies", disabled: true },
  { id: "lifestyle", label: "Lifestyle", icon: "🌟", link: "/createprofile/lifestyle", disabled: true },
  { id: "properties", label: "Properties", icon: "🏘️", link: "/createprofile/property", disabled: true },
  { id: "photos", label: "Photos", icon: "📸", link: "/createprofile/photos", disabled: true },
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
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault();
                return;
              }
              setActiveItem(item.id);
              router.push(item.link); // 🔑 navigate to correct folder page
            }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium whitespace-nowrap transition-colors ${
              item.disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-gray-800"
            } ${
              activeItem === item.id
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-600"
            }`}
            disabled={item.disabled}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
