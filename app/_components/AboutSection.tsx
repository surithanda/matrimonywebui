import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import WhyTrust from "../_components/WhyTrust";
import FlowerImgOne from "/public/images/FlowerImg.svg";
import FlowerImgTwo from "/public/images/FlowerImg2.svg";

import verifiedprofile from "@/public/icons/verifiedprofile.png";
import privacyapproach from "@/public/icons/privacyapproach.png";
import expertguidance from "@/public/icons/expertguidance.png";
import personalizedmatch from "@/public/icons/personalizedmatch.png";
import premiummembership from "@/public/icons/premiummembership.png";

export const AboutSection = () => {
  const whyTrustData: {
    imageSrc: StaticImageData;
    title: string;
    description: string;
  }[] = [
    {
      imageSrc: verifiedprofile,
      title: "Verified Profiles",
      description:
        "Connect with confidence, knowing you're meeting genuine potential matches.",
    },
    {
      imageSrc: privacyapproach,
      title: "Privacy First Approach",
      description:
        "Control who sees your profile and information with our advanced privacy settings.",
    },
    {
      imageSrc: expertguidance,
      title: "Expert Guidance",
      description:
        "Get personalized matchmaking assistance from our relationship experts who understand values.",
    },
    {
      imageSrc: personalizedmatch,
      title: "Personalized Matchmaking",
      description:
        "We focus on your unique needs, values, and preferences to help you find a perfect match.",
    },
    {
      imageSrc: premiummembership,
      title: "Premium Memberships",
      description:
        "Enjoy exclusive features, more visibility, and better matchmaking options.",
    },
  ];

  return (
    <section className="aboutSection relative w-full mx-auto py-16 md:py-24 lg:py-32 flex flex-col items-center overflow-hidden">
      {/* Background Flower Images */}
      <Image
        src={FlowerImgOne}
        alt="Decorative Flower"
        className="absolute top-0 right-2 md:right-10 w-20 lg:w-[153px] h-auto opacity-50 md:opacity-100"
      />
      <Image
        src={FlowerImgTwo}
        alt="Decorative Flower"
        className="absolute top-[-50px] left-2 md:left-10 w-24 lg:w-[180px] h-auto opacity-50 md:opacity-100"
      />

      {/* About Text */}
      <p className="text-center text-sm md:text-base lg:text-lg text-gray-800 leading-relaxed max-w-lg lg:max-w-4xl px-6 md:px-10 mb-10 md:mb-16 font-medium">
        Marriage is considered a sacred and spiritual union of two souls, where
        two individuals come together to share their lives, values, aspirations,
        joys, sorrows, responsibilities, and journey through life as partners
        for a lifetime. This connection should not end at any cost till death.
      </p>

      {/* Why Trust Section */}
      <WhyTrust
        whyTrustData={whyTrustData}
        heading="Why Thousands Trust Chaturvarnam"
      />
    </section>
  );
};
