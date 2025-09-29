import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/servicePageHeroImage.jpg"
      height="min-h-[600px] sm:min-h-[550px] lg:min-h-[600px] xl:min-h-screen"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col items-start justify-center relative"
    >
      <div className="absolute inset-0 bg-black/65 -z-10"></div>
      <div data-aos='fade-right' className=" w-full sm:w-full md:w-[500px] lg:w-full space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-[20px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-12 sm:mt-20 md:mt-auto mb-3 text-5xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight">
          Creating Meaningful Connections
        </h1>

        {/* Description */}
        <p className="text-lg md:text-lg lg:text-2xl text-white/90 max-w-xl" style={{ fontFamily: '"BR Cobane", sans-serif', fontWeight:400, fontStyle:'normal', lineHeight:'normal', letterSpacing:'-0.54px' }}>
          Join Our Thoughtfully Curated Events Where Matches Are Made in Person,
          Traditions Are Celebrated, and Families Come Together to Create
          Beautiful Beginnings. Experience the Joy of Finding 'The One' in an
          Atmosphere of Trust and Celebration.
        </p>

        {/* CTA Button */}
        <div className="pt-2 sm:pt-3 md:pt-4">
          <Button           className="text-lg bg-orange-500 hover:bg-orange-600"
          size={"lg"}>
            Find an event near you
          </Button>
        </div>
      </div>
    </BaseHeroSection>
  );
};

export default HeroSection;
