import React from "react";
import HeroSection from "./_components/HeroSection";
import MissionVisionSection from "./_components/MissionVisionSection";
import MeetTheTeamSection from "./_components/MeetTheTeamSection";
import WhyChoose from "@/app/_components/WhyChoose";

const page = () => {
  return (
    <div>
      <HeroSection />
      <MissionVisionSection />
      <WhyChoose />
      <MeetTheTeamSection />
    </div>
  );
};

export default page;
