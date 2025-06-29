import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/aboutherobackground.png"
      height="md:h-[613px]"
      className="px-[100px] flex flex-col items-start justify-center"
    >
      <div className="aboutHeadingDiv w-[550px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-32 mb-3">
          About our Matrimony Services
        </h1>
        <p className="BRCobane18400Light md:w-[508px]">
          At MatrimonyService.org, we believe that every love story is unique
          and deserves a platform to flourish. Our mission is to make the
          journey of finding your perfect life partner simple, meaningful, and
          enjoyable. Whether you're seeking love, companionship, or a partner to
          share your dreams, we're here to make every step of your search
          seamless and special.
        </p>
      </div>
    </BaseHeroSection>
  );
};

export default HeroSection;
