import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/aboutherobackground.png"
      height="min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] xl:min-h-[650px]"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col items-start justify-center"
    >
      <div className=" w-full sm:w-full md:w-[500px] lg:w-[550px] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-[20px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-12 sm:mt-20 md:mt-32 mb-3 text-4xl sm:text-3xl md:text-5xl leading-tight">
          About our Matrimony Services
        </h1>
        <p className="BRCobane18400Light text-sm sm:text-base md:text-lg leading-relaxed max-w-full md:w-[508px]">
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
