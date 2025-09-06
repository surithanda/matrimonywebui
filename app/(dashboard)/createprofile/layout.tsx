"use client";
import React, { useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { ProfileContextProvider, useProfileContext } from "@/app/utils/useProfileContext";
import Tabs from "./_components/Tabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {loadMetaData} = useMetaDataLoader();
  const { setSelectedProfileID } = useProfileContext();

  useEffect(() => {
    loadMetaData();
    // setSelectedProfileID(21); // remove this once photos work
  }, [loadMetaData])

  return (
    
      <div className="dashboard-background mt-16 md:px-[20px] lg:px-[40px] 2xl:px-[80px] md:py-8 flex flex-col items-center">
        <div className="flex justify-between items-center w-full">
          <h2 className="dmserif32600">Create Profile</h2>
        </div>
        <div className="profile-details-box w-full text-left">
          <div className="">
            <Tabs />
            {/* <Sidebar /> */}
            {children}
          </div>
        </div>
      </div>
    
  );
}
