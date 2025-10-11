"use client";
import { useProfileContext } from "@/app/utils/useProfileContext";
import {
  usePathname,
  useSearchParams,
  useRouter,
  useParams,
  notFound,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { isValidProfileMode, type ProfileMode } from "../types/profileMode";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/lottie/Loading.json";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { getProfileCompltionCounts } from "@/app/store/features/profileSlice";
import { Button } from "@/components/ui/button";

export default function Tabs() {
  const params = useParams();
  const mode = params.mode as string;
  const dispatch = useAppDispatch();
  const complition = useAppSelector((state) => {
    return state?.profile?.profileCompltion;
  });

  const {
    personalProfile,
    address,
    education,
    employment,
    lifestyle,
    family,
    properties,
    hobbies,
    interests,
    references,
    favorites,
    photos,
  } = useAppSelector((state) => {
    return state?.profile;
  });

  if (!isValidProfileMode(mode)) {
    notFound();
  }

  const validMode: ProfileMode = mode;

  const menuItems = [
    {
      id: "personal",
      label: "Personal",
      link: `/${validMode}`,
      count: "personal_count",
    },
    {
      id: "contact",
      label: "Address",
      link: `/${validMode}/primarycontact`,
      disabled: true,
      count: "address_count",
    },
    {
      id: "education",
      label: "Education",
      link: `/${validMode}/education`,
      disabled: true,
      count: "education_count",
    },
    {
      id: "employment",
      label: "Employment",
      link: `/${validMode}/employment`,
      disabled: true,
      count: "employment_count",
    },
    {
      id: "family",
      label: "Family",
      link: `/${validMode}/family`,
      disabled: true,
      count: "family_reference_count",
    },
    {
      id: "references",
      label: "Friends & References",
      link: `/${validMode}/references`,
      disabled: true,
      count: "family_reference_count",
    },
    {
      id: "hobbies",
      label: "Hobbies",
      link: `/${validMode}/hobbies`,
      disabled: true,
      count: "hobby_interest_count",
    },
    {
      id: "lifestyle",
      label: "Lifestyle",
      link: `/${validMode}/lifestyle`,
      disabled: true,
      count: "lifestyle_count",
    },
    {
      id: "properties",
      label: "Properties",
      link: `/${validMode}/property`,
      disabled: true,
      count: "property_count",
    },
    {
      id: "photos",
      label: "Photos",
      link: `/${validMode}/photos`,
      disabled: true,
      count: "photo_count",
    },
  ];

  const [activeItem, setActiveItem] = useState("personal");
  const { selectedProfileID } = useProfileContext();
  const [menu, setMenu] = useState<any>(menuItems);
  const [loading, setLoading] = useState(false); // full-screen loader

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Highlight active tab on route change
  useEffect(() => {
    menuItems.forEach((item) => {
      if (pathname.startsWith(item.link)) setActiveItem(item.id);
    });
    setLoading(false);
  }, [pathname, searchParams]);

  // Unlock tabs
  useEffect(() => {
    const shouldEnableTabs =
      validMode === "updateprofile" || selectedProfileID > 0;

    if (shouldEnableTabs) {
      setMenu(menuItems.map((item) => ({ ...item, disabled: false })));
    } else {
      setMenu(
        menuItems.map((item, index) => ({ ...item, disabled: index !== 0 }))
      );
    }
  }, [selectedProfileID, validMode]);

  // Navigate to previous tab
  const goToPreviousTab = () => {
    const currentIndex = menu.findIndex((item: any) => item.id === activeItem);
    let prevIndex = currentIndex - 1;
    while (prevIndex >= 0 && menu[prevIndex].disabled) prevIndex--;
    if (prevIndex >= 0) {
      setActiveItem(menu[prevIndex].id);
      setLoading(true);
      router.push(menu[prevIndex].link);
    }
  };

  // Navigate to next tab
  const goToNextTab = () => {
    const currentIndex = menu.findIndex((item: any) => item.id === activeItem);
    let nextIndex = currentIndex + 1;
    while (nextIndex < menu.length && menu[nextIndex].disabled) nextIndex++;
    if (nextIndex < menu.length) {
      setActiveItem(menu[nextIndex].id);
      setLoading(true);
      router.push(menu[nextIndex].link);
    }
  };

  const getCounts = async () => {
    try {
      dispatch(getProfileCompltionCounts(selectedProfileID));
    } catch (error) {
      console.error("Error getting counts", error);
    }
  };

  useEffect(() => {
    getCounts();
  }, [
    personalProfile,
    address,
    education,
    employment,
    lifestyle,
    family,
    properties,
    hobbies,
    interests,
    references,
    favorites,
    photos,
  ]);

  return (
    <>
      {/* Next & Previous Buttons */}
      <div className="flex justify-between mb-4 px-1">
        {/* Previous Button */}
        <Button
          onClick={goToPreviousTab}
          disabled={menu.findIndex((item: any) => item.id === activeItem) === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors
      ${
        menu.findIndex((item: any) => item.id === activeItem) === 0
          ? "bg-orange-200 text-gray-600 cursor-not-allowed"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
        >
          Previous
        </Button>

        {/* Next Button */}
        <Button
          onClick={goToNextTab}
          disabled={
            menu.findIndex((item: any) => item.id === activeItem) ===
            menu.length - 1
          }
          className={`px-4 py-2 rounded-lg font-medium transition-colors
      ${
        menu.findIndex((item: any) => item.id === activeItem) ===
        menu.length - 1
          ? "bg-orange-200 text-gray-600 cursor-not-allowed"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
        >
          Next
        </Button>
      </div>

      {/* Tabs container */}
      <div className="flex justify-start items-start overflow-x-auto rounded-lg bg-white border border-gray-200 p-1 2xl:gap-2">
        {menu.map((item: any, index: number) => {
          const isCompleted =
            // menu.findIndex((m) => m.id === activeItem) > index;
            complition[item?.count as string] > 0;

          return (
            <button
              key={item.id}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
                setActiveItem(item.id);
                setLoading(true);
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
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold
                  ${
                    activeItem === item.id
                      ? "border-white bg-white text-orange-500"
                      : isCompleted
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-400 text-black"
                  }
                `}
              >
                {isCompleted ? "✔" : ""}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Full-screen loader overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
          <Lottie
            animationData={loaderAnimation}
            loop
            autoplay
            style={{ height: 150, width: 150 }}
          />
          <p className="mt-3 text-gray-600 font-medium">Loading...</p>
        </div>
      )}
    </>
  );
}
