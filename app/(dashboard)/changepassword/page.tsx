import React from "react";
import PasswordChange from "./_components/PasswordChange";

const page = () => {
  return (
    <div className="dashboard-background px-4 md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8">
      <div className="flex justify-center items-center w-full my-4 md:my-0">
        <h2 className="dmserif32600">Change Password</h2>
      </div>
      <PasswordChange />
    </div>
  );
};

export default page;
