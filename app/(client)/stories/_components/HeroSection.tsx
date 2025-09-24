import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/storie2.jpg"
      height="min-h-[600px] sm:min-h-[550px] lg:min-h-[600px] xl:min-h-screen"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col items-start justify-center relative"
    >
       <div className="absolute inset-0 bg-black/40 -z-10"></div>
      <div data-aos='fade-right' className=" w-full sm:w-full md:w-[500px] lg:w-full space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-[20px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-12 sm:mt-20 md:mt-auto text-start text-5xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight sm:leading-tight md:leading-snug">
          Real Love Stories From
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          Our Chaturvarnam Family
        </h1>
        <p className="text-lg md:text-lg lg:text-2xl text-white/90 max-w-xl" style={{ fontFamily: '"BR Cobane", sans-serif', fontWeight:400, fontStyle:'normal', lineHeight:'normal', letterSpacing:'-0.54px' }}>
          Every match on Chaturvarnam blooms into a unique love story. Here are
          some heartwarming journeys of couples and families who found their
          perfect match with us.
        </p>
      </div>
    </BaseHeroSection>
  );
};

export default HeroSection;
