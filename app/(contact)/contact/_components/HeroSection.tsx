import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/contactherobackground.png"
      height="min-h-[600px] sm:min-h-[550px] lg:min-h-[600px] xl:min-h-screen"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col items-start justify-center"
    >
      <div className=" w-full sm:w-full md:w-[500px] lg:w-full space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-[20px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-12 sm:mt-20 md:mt-4 mb-3 text-5xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight">
          Reach out to us
        </h1>
        <p className="text-lg md:text-lg lg:text-2xl text-white/90 max-w-xl">
          Have questions about finding your perfect match? Our dedicated team is
          here to guide you every step of the way. Reach out to us through any
          of these channels.
        </p>
      </div>
    </BaseHeroSection>
  );
};

export default HeroSection;
