import React from "react";
import { BaseHeroSection } from "@/app/_components/BaseHeroSection";

const HeroSection = () => {
  return (
    <BaseHeroSection
      backgroundImage="/images/storiesherobackground.png"
      height="md:h-[663px]"
      className="pt-32 flex flex-col gap-[24px] items-start justify-center text-center md:px-[100px]"
    >
      <h1 className="BRCobane64600 text-start">
        Real Love Stories From
        <br /> Our Chaturvarnam Family
      </h1>
      <p className="BRCobane18400Light text-start md:w-[600px]">
        Every match on Chaturvarnam blooms into a unique love story. Here are
        some heartwarming journeys of couples and families who found their
        perfect match with us.
      </p>
    </BaseHeroSection>
  );
};

export default HeroSection;
