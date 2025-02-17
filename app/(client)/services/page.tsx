import React from "react";
import HeroSection from "./_components/HeroSection";
import Features from "./_components/Features";
import WhyTrust from "../../_components/WhyTrust";
import familymeeting from "@/public/images/familymeeting.png";
import matchmakingmeeting from "@/public/images/matchmakingmeeting.png";
import partnerpreference from "@/public/images/partnerpreference.png";

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
      <div className="stories-image bg-white p-[32px] -mt-14 relative flex items-center justify-between md:w-3/5 mx-auto rounded-[20px] overflow-hidden">
        <div className="flex flex-col items-start justify-center gap-3">
          <h3 className="dmserif32600">Free Registration</h3>
          <p className="BRCobane18400">
            Registration and most of our services are free.
          </p>
        </div>
        <button className="YellowBtn">Register Now</button>
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
