import Image from "next/image";
import React from "react";
import herobg from "@/public/images/dashboard/herobg.png";
import lantern from "@/public/images/lantern.png";

const HeroSection = () => {
  return (
    <div className="hero-section w-full md:h-[318px] relative flex items-center px-[120px] md:py-24">
      <Image
        src={herobg}
        alt="hero image"
        className="w-full h-full absolute top-0 left-0 -z-10"
      />
      <Image
        src={lantern}
        alt="hero image"
        className="md:w-[215px] md:h-[335px] absolute top-0 md:right-[120px] z-10"
      />
      <p className="dmserif32400 text-left md:w-[90%]">
        Marriages are deeply rooted in cultural, religious, and traditional
        values that play a significant role in shaping the purpose, rituals,
        ceremonies, and dynamics of marital relationships in the every society.
      </p>
    </div>
  );
};

export default HeroSection;
