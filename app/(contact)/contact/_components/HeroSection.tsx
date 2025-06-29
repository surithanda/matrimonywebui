import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/contactherobackground.png"
      height="md:h-[600px]"
      className="px-[100px] flex flex-col items-start justify-center"
    >
      <div className="aboutHeadingDiv md:w-[550px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-32 mb-3">
          Reach out to us
        </h1>
        <p className="BRCobane18400Light md:w-[508px]">
          Have questions about finding your perfect match? Our dedicated team is
          here to guide you every step of the way. Reach out to us through any
          of these channels.
        </p>
      </div>
    </BaseHeroSection>
  );
};

export default HeroSection;
