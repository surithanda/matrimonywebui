"use client";
import React, { useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { ProfileContextProvider, useProfileContext } from "@/app/utils/useProfileContext";
import Tabs from "./_components/Tabs";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { getNextRoute } from "@/app/utils/routeOrder";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {loadMetaData} = useMetaDataLoader();
  const { setSelectedProfileID } = useProfileContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleContinue = () => {
    // Trigger form submission by dispatching a custom event
    const continueEvent = new CustomEvent('profile-continue');
    window.dispatchEvent(continueEvent);
  };

  const handleSkip = () => {
    const nextRoute = getNextRoute(pathname);
    router.push(nextRoute);
  };

  useEffect(() => {
    loadMetaData();
    // setSelectedProfileID(21); // remove this once photos work
  }, [loadMetaData])

  return (
    
      <div className="dashboard-background mt-20 md:mt-16 md:px-[20px] lg:px-[40px] 2xl:px-[80px] md:py-8 flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-4">
          <h2 className="dmserif32600">Create Profile</h2>
          
          {/* Top Navigation Buttons */}
          {/* <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleContinue}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Continue
            </Button>
            <Button
              type="button"
              onClick={handleSkip}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 px-6 py-2 rounded-lg transition-colors"
            >
              Skip
            </Button>
          </div> */}
        </div>
        <div className="profile-details-box w-full text-left">
          <div>
            <Tabs />
            {/* <Sidebar /> */}
            {children}
          </div>
        </div>
      </div>
    
  );
}
