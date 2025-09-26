import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/amish-thakkar-7O422yG_b80-unsplash.jpg"
      height="min-h-[600px] sm:min-h-[550px] lg:min-h-screen xl:min-h-screen"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col items-start justify-center relative"
    >
      <div className="absolute inset-0 bg-black/65 -z-10"></div>
      <div data-aos='fade-right' className=" w-full sm:w-full md:w-[500px] lg:w-full space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-[20px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-12 sm:mt-20 md:mt-auto mb-3 text-5xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight">
          Our Services
        </h1>

        <p className="text-lg md:text-lg lg:text-2xl  text-white/90 max-w-4xl" style={{ fontFamily: '"BR Cobane", sans-serif', fontWeight:400, fontStyle:'normal', lineHeight:'normal', letterSpacing:'-0.54px' }}>
          You will get access to platform's features which redefine the
          matrimony experience. From ensuring security through Two-Factor
          Authentication to facilitating real-world connections, each feature
          plays a pivotal role in creating a holistic and personalized approach
          to online matchmaking. It's a testament to the evolving nature of
          matrimony services, where technology converges with tradition to
          redefine the journey of finding a life partner.
        </p>
      </div>
    </BaseHeroSection>
  );
};

export default HeroSection;
