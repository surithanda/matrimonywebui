import React from "react";
import Image from "next/image";
import Link from "next/link";
import C1 from "../../public/images/c1.png";
import C2 from "../../public/images/c2.png";
import C3 from "../../public/images/c3.png";
const WhyChoose = () => {
  return (
    <div>
      <div className="whyChooseDiv flex p-[32px_100px] mb-[60px] flex-col items-center gap-[50px]">
        <h1 className="BRCobane56600">Why Choose us?</h1>
        <div className="whyChooseCardRow flex justify-center items-start gap-[24px] self-stretch">
          <div className="chooseCard flex w-[400px] flex-col items-center gap-[12px] text-center">
            <Image src={C1} alt="" className="md:w-[84px] md:h-[84px]" />
            <h4 className="BRCobane24600">Background Checks</h4>
            <p className="BRCobane16400">
              To maintain a safe and trustworthy environment, we conduct
              background checks on all profiles and mark the same for a profile.
            </p>
          </div>
          <div className="chooseCard flex w-[400px] flex-col items-center gap-[12px] text-center">
            <Image src={C2} alt="" className="md:w-[84px] md:h-[84px]" />
            <h4 className="BRCobane24600">Genuine Profiles</h4>
            <p className="BRCobane16400">
              Our automatic and manual background checking process ensures to
              check a profile through networking and social media history.
            </p>
          </div>
          <div className="chooseCard flex w-[400px] flex-col items-center gap-[12px] text-center">
            <Image src={C3} alt="" className="md:w-[84px] md:h-[84px]" />
            <h4 className="BRCobane24600">Advanced Matching Algorithms</h4>
            <p className="BRCobane16400">
              Our Intelligent algorithms help you find compatible partners based
              on your preferences and criteria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
