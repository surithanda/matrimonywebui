import React from "react";
import Register from "./_components/Register";

const page = () => {
  return (
    <div className="dashboard-background md:px-[120px] md:py-8 flex flex-col items-center md:gap-8">
      <div className="flex justify-between items-center w-full">
        <h2 className="dmserif32600">Register Now</h2>
      </div>
      <Register />
    </div>
  );
};

export default page;
