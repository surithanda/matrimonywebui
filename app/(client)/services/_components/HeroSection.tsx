import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/serviceherobackgroundcopy.png"
      height="min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] xl:min-h-[650px]"
      className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col items-start justify-center"
    >
      <div className=" w-full sm:w-full md:w-[500px] lg:w-[550px] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-[20px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-12 sm:mt-20 md:mt-32 mb-3 text-4xl sm:text-3xl md:text-5xl leading-tight">
          Our Services
        </h1>

        {/* Description */}
        <p className="BRCobane18400Light text-[#fafafa] text-base sm:text-lg md:text-xl leading-relaxed">
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
