import React from "react";
import HeroSection from "./_components/HeroSection";
import UpcomingEventsSection from "./_components/UpcomingEventsSection";
import MomentsThatMatterSection from "../../_components/MomentsThatMatterSection";
import QuestionsAboutEventsSection from "./_components/QuestionsAboutEventsSection";
import WhyTrust from "../../_components/WhyTrust";
import verifiedprofile from "@/public/icons/verifiedprofile.png";
import privacyapproach from "@/public/icons/privacyapproach.png";
import expertguidance from "@/public/icons/expertguidance.png";
import personalizedmatch from "@/public/icons/personalizedmatch.png";
import premiummembership from "@/public/icons/premiummembership.png";
import { StaticImageData } from "next/image";

const page = () => {
  const whyTrustData: {
    imageSrc: StaticImageData;
    title: string;
    description: string;
  }[] = [
    {
      imageSrc: verifiedprofile,
      title: "Weekly Events",
      description:
        "To maintain a safe and trustworthy environment, we conduct background checks on all profiles and mark the same for a profile.",
    },
    {
      imageSrc: privacyapproach,
      title: "Monthly Events",
      description:
        "Our automatic and manual background checking process ensures to check a profile through networking and social media history.",
    },
    {
      imageSrc: expertguidance,
      title: "Annual Events",
      description:
        "Our Intelligent algorithms help you find compatible partners based on your preferences and criteria.",
    },
  ];
  return (
    <div>
      <HeroSection />
      <WhyTrust whyTrustData={whyTrustData} heading={"Promotional Events"} />
      <UpcomingEventsSection />
      <MomentsThatMatterSection heading="Our Gallery of Precious Moments" />
      <QuestionsAboutEventsSection />
    </div>
  );
};

export default page;
