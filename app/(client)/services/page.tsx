import React from "react";
import HeroSection from "./_components/HeroSection";
import Features from "./_components/Features";
import WhyTrust from "../../_components/WhyTrust";
import familymeeting from "@/public/images/familymeeting.png";
import matchmakingmeeting from "@/public/images/matchmakingmeeting.png";
import partnerpreference from "@/public/images/partnerpreference.png";
import Link from "next/link";

const page = () => {
  const whyTrustData = [
    {
      imageSrc: familymeeting,
      title: "Family Meeting Arrangement",
      description:
        "Facilitating real-world connections, the platform assists in arranging Meetings and Family Meetings, ensuring a smooth transition from online interactions to real-life connections",
    },
    {
      imageSrc: matchmakingmeeting,
      title: "Partner Preferences",
      description:
        "In the quest for a life partner, users outline specific Partner Preferences. From personality traits to lifestyle choices, this feature streamlines the matchmaking process, ensuring compatibility.",
    },
    {
      imageSrc: partnerpreference,
      title: "Matchmaking meetings",
      description:
        "We will conduct weekends matchmaking online meeting based on available schedules. We introduce families, bride and groom in the call(s).",
    },
  ];
  return (
    <div>
      <HeroSection />
      <div className="stories-image bg-white p-4 sm:p-6 md:p-8 lg:p-[32px] -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-14 relative flex flex-col sm:flex-row items-start sm:items-center justify-between w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-4/5 lg:w-3/5 mx-auto rounded-[12px] sm:rounded-[16px] md:rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Content Section */}
        <div className="flex flex-col items-start justify-center gap-2 sm:gap-3 mb-4 sm:mb-0 flex-1">
          <h3 className="dmserif32600 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-gray-900">
            Free Registration
          </h3>
          <p className="BRCobane18400 text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 max-w-xs sm:max-w-sm md:max-w-md">
            Registration and most of our services are free.
          </p>
        </div>

        {/* Button Section */}
        <div className="w-full sm:w-auto flex-shrink-0">
          <Link href="/register" className="YellowBtn bg-[#f7ac03] hover:bg-[#e69a00] w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg hover:scale-105 transition-transform duration-200">
            Register Now
          </Link>
        </div>
      </div>
      <Features />
      <WhyTrust
        whyTrustData={whyTrustData}
        heading={"Why Thousands Trust Chaturvarnam"}
      />
    </div>
  );
};

export default page;
