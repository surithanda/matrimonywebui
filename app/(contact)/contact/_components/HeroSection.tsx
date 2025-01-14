import React from "react";
import Image from "next/image";
import aboutHeroImage from "@/public/images/aboutheroimage.png";
const HeroSection = () => {
  return (
    <section className="contact-hero md:h-[600px] px-[100px] flex flex-col items-start justify-center">
      <div className="aboutHeadingDiv md:w-[550px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-32 mb-3">
          Reach out to us
        </h1>
        <p className="BRCobane18400Light md:w-[508px">
          Have questions about finding your perfect match? Our dedicated team is
          here to guide you every step of the way. Reach out to us through any
          of these channels.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
