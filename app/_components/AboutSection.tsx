import React from "react";
import Link from "next/link";
import Image from "next/image";
import WhyTrust from "../_components/WhyTrust";
import FlowerImgOne from "/public/images/FlowerImg.svg";
import FlowerImgTwo from "/public/images/FlowerImg2.svg";

import verifiedprofile from "@/public/icons/verifiedprofile.png";
import privacyapproach from "@/public/icons/privacyapproach.png";
import expertguidance from "@/public/icons/expertguidance.png";
import personalizedmatch from "@/public/icons/personalizedmatch.png";
import premiummembership from "@/public/icons/premiummembership.png";
import { StaticImageData } from "next/image";

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
        "Lorem ipsum dolor sit amet consectetur. Odio in a sagittis mauris ut leo amet. Cursus duis hac.",
    },
    {
      imageSrc: premiummembership,
      title: "Premium Memberships",
      description:
        "Lorem ipsum dolor sit amet consectetur. Consectetur id leo cursus varius leo mi ultricies.",
    },
  ];
  return (
    <div className="aboutSection relative w-full mx-auto pt-[120px] flex flex-col items-center self-stretch overflow-hidden">
      <Image
        src={FlowerImgOne}
        alt=""
        className="md:w-[153px] md:h-[446px] absolute top-[-10px] right-10 "
      />
      <Image
        src={FlowerImgTwo}
        alt=""
        className="md:w-[180px] md:h-[559px] absolute top-[-100px] left-10"
      />
      <p className="w-3/5 BRCobane32600">
        Marriage is considered a sacred and spiritual union oftwo souls, where
        two individuals come together to share their lives, values,aspirations,
        joys, sorrows, responsibilities, and journey through life aspartners for
        lifetime. This connection should not end at any cost till death.
      </p>
      <WhyTrust
        whyTrustData={whyTrustData}
        heading={"Why Thousands Trust Chaturvarnam"}
      />
    </div>
  );
};
