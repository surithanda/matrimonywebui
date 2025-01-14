import React from "react";
import PasswordChange from "./_components/PasswordChange";

const page = () => {
  return (
    <div className="dashboard-background md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8">
      <div className="flex justify-between items-center w-full">
        <h2 className="dmserif32600">Change Password</h2>
      </div>
      <PasswordChange />
    </div>
  );
};

export default page;
