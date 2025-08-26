import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/storiesherobackground.png"
      height="h-[600px] sm:h-[500px] md:h-[500px] lg:h-[663px]"
      className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 flex flex-col gap-4 sm:gap-5 md:gap-6 items-start justify-center text-center px-4 sm:px-6 md:px-12 lg:px-20 xl:px-[100px]"
    >
      <h1 className="BRCobane64600 text-start text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight sm:leading-tight md:leading-snug">
        Real Love Stories From
        <br className="hidden sm:block" />
        <span className="sm:hidden"> </span>
        Our Chaturvarnam Family
      </h1>
      <p className="BRCobane18400Light text-start text-sm sm:text-base md:text-lg w-full sm:w-full md:w-[500px] lg:w-[600px] xl:w-[650px]">
        Every match on Chaturvarnam blooms into a unique love story. Here are
        some heartwarming journeys of couples and families who found their
        perfect match with us.
      </p>
    </BaseHeroSection>
  );
};

export default HeroSection;
