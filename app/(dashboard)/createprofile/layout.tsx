import React from "react";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
