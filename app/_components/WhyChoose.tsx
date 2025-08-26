import React from "react";
import Image from "next/image";
import Link from "next/link";
import C1 from "../../public/images/c1.png";
import C2 from "../../public/images/c2.png";
import C3 from "../../public/images/c3.png";

const WhyChoose = () => {
  const features = [
    {
      icon: C1,
      title: "Background Checks",
      description:
        "To maintain a safe and trustworthy environment, we conduct background checks on all profiles and mark the same for a profile.",
    },
    {
      icon: C2,
      title: "Genuine Profiles",
      description:
        "Our automatic and manual background checking process ensures to check a profile through networking and social media history.",
    },
    {
      icon: C3,
      title: "Advanced Matching Algorithms",
      description:
        "Our Intelligent algorithms help you find compatible partners based on your preferences and criteria.",
    },
  ];

  return (
    <div>
      <div className="whyChooseDiv flex flex-col items-center gap-8 sm:gap-10 md:gap-12 lg:gap-[50px] p-4 sm:p-6 md:p-8 lg:p-12 xl:p-[32px_100px] mb-8 sm:mb-10 md:mb-12 lg:mb-[60px]">
        {/* Main Heading */}
        <h1 className="BRCobane56600 text-5xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-6xl text-center">
          Why Choose us?
        </h1>

        {/* Cards Container */}
        <div className="whyChooseCardRow flex flex-col sm:flex-col md:flex-row justify-center items-start gap-6 sm:gap-8 md:gap-4 lg:gap-6 xl:gap-[24px] w-full max-w-7xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="chooseCard flex flex-col items-center gap-3 sm:gap-4 md:gap-[12px] text-center w-full sm:max-w-md md:w-[300px] lg:w-[350px] xl:w-[400px] mx-auto md:mx-0"
            >
              {/* Icon */}
              <Image
                src={feature.icon}
                alt={`${feature.title} icon`}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px] xl:w-[84px] xl:h-[84px]"
              />

              {/* Title */}
              <h4 className="BRCobane24600 text-lg sm:text-xl md:text-xl lg:text-2xl leading-tight">
                {feature.title}
              </h4>

              {/* Description */}
              <p className="BRCobane16400 text-sm sm:text-base md:text-sm lg:text-base leading-relaxed px-2 sm:px-4 md:px-0">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
