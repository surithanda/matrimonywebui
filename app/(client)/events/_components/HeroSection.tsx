import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/eventherobackground.png"
      height="h-[600px] sm:h-[500px] md:h-[550px] lg:h-[600px]"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[100px] flex flex-col items-start justify-center"
    >
      <div className="aboutHeadingDiv w-full sm:w-full md:w-[500px] lg:w-[550px] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-[20px]">
        {/* Main Heading */}
        <h1 className="BRCobane64600 text-[#fafafa] text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight sm:leading-tight md:leading-snug mt-16 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-32 mb-3">
          Creating Meaningful Connections
        </h1>

        {/* Description */}
        <p className="BRCobane18400Light text-[#fafafa] text-sm sm:text-base md:text-lg w-full sm:w-full md:w-[400px] lg:w-[450px] leading-relaxed">
          Join Our Thoughtfully Curated Events Where Matches Are Made in Person,
          Traditions Are Celebrated, and Families Come Together to Create
          Beautiful Beginnings. Experience the Joy of Finding 'The One' in an
          Atmosphere of Trust and Celebration.
        </p>

        {/* CTA Button */}
        <div className="pt-2 sm:pt-3 md:pt-4">
          <button className="WhiteBtn text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-md sm:rounded-lg transition-all duration-300 hover:scale-105">
            Find an event near you
          </button>
        </div>
      </div>
    </BaseHeroSection>
  );
};

export default HeroSection;
