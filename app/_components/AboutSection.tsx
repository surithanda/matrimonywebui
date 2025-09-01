import React from "react";
import Image from "next/image";
import coupleImage from "@/public/images/wedding3.jpg";
import verifiedprofile from "@/public/icons/verifiedprofile.png";
import privacyapproach from "@/public/icons/privacyapproach.png";
import expertguidance from "@/public/icons/expertguidance.png";
import personalizedmatch from "@/public/icons/personalizedmatch.png";
import premiummembership from "@/public/icons/premiummembership.png";
import trustednetwork from "@/public/icons/trustednetwork.png";

export const AboutSection = () => {
  const whyTrustData = [
    {
      image: verifiedprofile,
      title: "Verified Profiles",
      description:
        "Connect with confidence, knowing you're meeting genuine potential matches.",
    },
    {
      image: trustednetwork,
      title: "Trusted Global Network",
      description:
        "Join a large and trusted community of members worldwide, increasing your chances of finding the perfect match.",
    },

    {
      image: expertguidance,
      title: "Expert Guidance",
      description:
        "Get personalized matchmaking assistance from our relationship experts who understand values.",
    },
    {
      image: personalizedmatch,
      title: "Personalized Matchmaking",
      description:
        "We focus on your unique needs, values, and preferences to help you find a perfect match.",
    },
    {
      image: premiummembership,
      title: "Premium Memberships",
      description:
        "Enjoy exclusive features, more visibility, and better matchmaking options.",
    },

    {
      image: privacyapproach,
      title: "Privacy First Approach",
      description:
        "Control who sees your profile and information with our advanced privacy settings.",
    },
  ];

  return (
    <div
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-gray-800"
      id="services"
    >
      <h1 data-aos="fade-up" className="font-bold text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center leading-tight max-w-5xl mx-auto text-gray-900">
        Why Thousands Trust Chaturvarnam
      </h1>

      <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-3 lg:gap-16 items-center">
        {/* Left Column - First 3 */}
        <div className="flex flex-col items-center justify-center gap-12">
          {whyTrustData.slice(0, 3).map((service, index) => (
            <div
              key={index}
              className="space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start"
               data-aos="fade-left"
            >
              <div className="flex items-center gap-3">
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <h2 className="font-semibold text-2xl sm:text-3xl lg:text-3xl text-gray-800 leading-tight ">
                  {service.title}
                </h2>
              </div>
              <p className="BRCobane18400 text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0 text-lg">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Center Image */}
        <div className="w-full">
          <Image
          data-aos="zoom-in"
              data-aos-delay="150"
            src={coupleImage}
            alt="Elegant wedding couple"
            className="w-full h-auto rounded-t-full object-cover aspect-[4/5] sm:aspect-[4/5] md:aspect-[5/6] lg:aspect-[6/7]"
          />
        </div>

        {/* Right Column - Last 3 */}
        <div className="flex flex-col items-center justify-center gap-8">
          {whyTrustData.slice(3, 6).map((service, index) => (
            <div
              key={index}
              className="space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start"
              data-aos="fade-right"
            >
              <div className="flex items-center gap-3">
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <h2 className="font-semibold text-2xl sm:text-3xl lg:text-3xl text-gray-800 leading-tight">
                  {service.title}
                </h2>
              </div>
              <p className="BRCobane18400 text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0 text-lg">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
