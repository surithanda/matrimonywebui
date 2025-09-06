import React from "react";
import ProfileSection from "../_components/ProfileSection";

const page = () => {
  return (
    <div className="dashboard-background px-6 2xl:px-[120px] md:py-8 flex flex-col items-center md:gap-8">
      <ProfileSection />
    </div>
  );
};

export default page;
