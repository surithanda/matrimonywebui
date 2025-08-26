import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/serviceherobackground.png"
      height="h-[600px] sm:h-[500px] md:h-[550px] lg:h-[600px] xl:h-[610px]"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[100px] flex flex-col items-start justify-center"
    >
      <div className="aboutHeadingDiv w-full sm:w-full md:w-[500px] lg:w-[550px] xl:w-[550px] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-[18px] xl:space-y-[20px]">
        {/* Main Heading */}
        <h1 className="BRCobane64600 text-[#fafafa] text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight mt-16 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-32 mb-2 sm:mb-3">
          Our Services
        </h1>

        {/* Description */}
        <p className="BRCobane18400Light text-[#fafafa] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-normal w-full">
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
