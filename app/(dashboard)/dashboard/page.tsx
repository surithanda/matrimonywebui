import React from "react";
import ProfileSection from "../_components/ProfileSection";

const page = () => {
  return (
    <div className="dashboard-background md:px-[120px] md:py-8 flex flex-col items-center md:gap-8">
      <ProfileSection />
    </div>
  );
};

export default page;
