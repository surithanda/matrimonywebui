import React from "react";
import HeroSection from "./_components/HeroSection";
import StorySection from "./_components/StorySection";
import TestimonialSection from "./_components/TestimonialSection";
import MomentsThatMatterSection from "../../_components/MomentsThatMatterSection";

const page = () => {
  return (
    <div>
      <HeroSection />
      <StorySection />
      <TestimonialSection />
      <MomentsThatMatterSection heading="Moments That Matter" />
    </div>
  );
};

export default page;
