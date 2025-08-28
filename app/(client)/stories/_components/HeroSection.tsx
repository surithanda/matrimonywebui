import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/storiesherobackground.png"
        height="min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] xl:min-h-[650px]"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col items-start justify-center"
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
