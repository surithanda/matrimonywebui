import React from "react";
import AccountSettings from "./_components/AccountDetails";

const page = () => {
  return (
    <div className="dashboard-background md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-16">
      <div className="flex justify-between items-center w-full">
        <h2 className="dmserif32600">Account Setting</h2>
      </div>
      <AccountSettings />
    </div>
  );
};

export default page;