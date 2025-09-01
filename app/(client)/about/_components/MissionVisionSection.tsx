"use client";

import mission from "@/public/images/mission.png";
import vision from "@/public/images/vision.png";
import Image from "next/image";

const MissionVisionSection = () => {

  return (
    <section className="pt-16 pb-16 sm:pt-20 sm:pb-20 md:pt-[120px] md:pb-[120px]">
      <div className="text-center mb-8 sm:mb-12" data-aos="fade-up">
        <p className="BRCobane32400 text-xl sm:text-lg md:text-xl lg:text-3xl xl:text-[34px] md:w-[90%] mx-auto leading-relaxed px-2 lg:px-16">
          Our platform goes beyond traditional matchmaking by offering
          personalized tools and insights to help you connect with someone who
          truly complements you. With advanced technology and a human touch, we
          ensure your experience is safe, trustworthy, and tailored to your
          needs.
        </p>
        <h2
          className="BRCobane56400 mt-16 sm:mt-20 md:mt-[120px] mb-8 sm:mb-12 md:mb-[50px] text-4xl sm:text-3xl md:text-5xl lg:text-6xl"
          data-aos="zoom-in"
        >
          Our Mission and Vision
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-[56px]">
        {/* Mission Section */}
        <div
          className="aboutCard text-center md:text-left rounded-tr-[200px] rounded-br-[200px] mr-2 md:mr-0"
          data-aos="fade-right"
        >
          <div className="flex flex-row items-center gap-6">
            <Image
              src={mission}
              alt="Mission Illustration"
              className="w-14 h-14 sm:w-[72px] sm:h-[72px] md:w-[84px] md:h-[84px] mx-auto md:mx-0"
            />
            <h3 className="BRCobane24400 text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl">
              Mission
            </h3>
          </div>
          <p className="BRCobane16400 text-base sm:text-base md:text-lg leading-relaxed mx-auto md:mx-0 w-full md:w-4/5">
            Our mission is to redefine matrimonial matchmaking by fostering a
            safe, inclusive, and culturally rich space where individuals and
            families can find their perfect match. We aim to go beyond profiles
            and preferences, focusing on genuine compatibility, trust, and
            long-term happiness. Every connection we create is guided by empathy
            and respect, making the journey of finding a life partner seamless
            and meaningful.
          </p>
        </div>

        {/* Vision Section */}
        <div
          className="aboutCard text-center md:text-left rounded-tl-[200px] rounded-bl-[200px] ms-2 md:ms-0"
          data-aos="fade-left"
        >
          <div className="flex flex-row items-center gap-6">
            <Image
              src={vision}
              alt="Vision Illustration"
              className="w-16 h-16 sm:w-[72px] sm:h-[72px] md:w-[84px] md:h-[84px] mx-auto md:mx-0"
            />
            <h3 className="BRCobane24400 text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl">
              Vision
            </h3>
          </div>
          <p className="BRCobane16400 text-sm sm:text-base md:text-lg leading-relaxed mx-auto md:mx-0 md:w-4/5">
            Our vision is to become the most trusted and respected matrimonial
            platform, celebrating diversity while honoring traditions. We aspire
            to empower millions of individuals and families to discover
            meaningful relationships built on mutual respect, love, and shared
            values. By combining innovation with a personal touch, we seek to
            transform the matrimonial experience into a journey of joy, trust,
            and lifelong companionship.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
