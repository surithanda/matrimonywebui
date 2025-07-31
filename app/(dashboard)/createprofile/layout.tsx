"use client";
import React, { useEffect } from "react";
import Sidebar, { ProfileIDContext } from "./_components/Sidebar";
import { useState } from "react";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {loadMetaData} = useMetaDataLoader();
  const [selectedProfileID, setSelectedProfileID] = useState(0);

  useEffect(() => {
    loadMetaData();
    // setTimeout(setSelectedProfileID, 500, 1);//for testing purpose only
  }, [])

  return (
    <ProfileIDContext.Provider value={{ selectedProfileID, setSelectedProfileID }}>
      <div className="dashboard-background md:px-[120px] md:py-8 flex flex-col items-center md:gap-8">
        <div className="flex justify-between items-center w-full">
          <h2 className="dmserif32600">Create Profile</h2>
        </div>
        <div className="profile-details-box w-full text-left">
          <div className="flex w-full">
            <Sidebar />
            {children}
          </div>
        </div>
      </div>
    </ProfileIDContext.Provider>
  );
}
