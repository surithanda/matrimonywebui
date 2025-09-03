import React from "react";
import PreferencesSection from "./_components/PreferencesSection";

const page = () => {
  return (
    <div className="dashboard-background mt-16 md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8">
      <PreferencesSection />
    </div>
  );
};

export default page;
