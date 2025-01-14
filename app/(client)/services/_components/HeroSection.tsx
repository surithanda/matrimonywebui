import React from "react";

const HeroSection = () => {
  return (
    <section className="service-hero md:h-[610px] px-[100px] flex flex-col items-start justify-center">
      <div className="aboutHeadingDiv md:w-[550px] md:space-y-[20px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-32 mb-3">
          Our Services
        </h1>
        <p className="BRCobane18400Light md:w-full">
          You will get access to platform's features which redefine the
          matrimony experience. From ensuring security through Two-Factor
          Authentication to facilitating real-world connections, each feature
          plays a pivotal role in creating a holistic and personalized approach
          to online matchmaking. It's a testament to the evolving nature of
          matrimony services, where technology converges with tradition to
          redefine the journey of finding a life partner.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
