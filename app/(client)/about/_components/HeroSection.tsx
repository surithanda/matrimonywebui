import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/photorealistic-wedding-venue-with-intricate-decor-ornaments (1).jpg"
      height="min-h-[600px] sm:min-h-[550px] lg:min-h-[600px] xl:min-h-screen"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col items-start justify-center relative"
    >
      <div className="absolute bg-black/40 top-0 w-full h-full -z-10"></div>
      <div className=" w-full sm:w-full md:w-[500px] lg:w-full space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-[20px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-12 sm:mt-20 md:mt-32 mb-3 text-5xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight">
          About our <br /> Matrimony Services
        </h1>
        <p className="text-lg md:text-lg lg:text-xl 2xl:text-2xl text-white/90 max-w-xl">
          At MatrimonyService.org, we believe that every love story is unique
          and deserves a platform to flourish. Our mission is to make the
          journey of finding your perfect life partner simple, meaningful, and
          enjoyable. 
        </p>
      </div>
    </BaseHeroSection>  
  );
};

export default HeroSection;
