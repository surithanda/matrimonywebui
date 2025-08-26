import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/contactherobackground.png"
    height="h-[600px] sm:h-[450px] md:h-[613px]"
      className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col items-center sm:items-start justify-center sm:text-left"
    >
      <div className="aboutHeadingDiv w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl py-8 sm:py-12 md:py-16 lg:py-20">
        <h1 className="BRCobane64600 text-[#fafafa] mb-4 sm:mb-5 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
          Reach out to us
        </h1>
        <p className="BRCobane18400Light text-[#fafafa] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
          Have questions about finding your perfect match? Our dedicated team is
          here to guide you every step of the way. Reach out to us through any
          of these channels.
        </p>
      </div>
    </BaseHeroSection>
  );
};

export default HeroSection;
