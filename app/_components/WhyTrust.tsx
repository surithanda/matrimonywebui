import React from "react";
import Image, { StaticImageData } from "next/image";

interface WhyTrustData {
  imageSrc: StaticImageData;
  title: string;
  description: string;
}

interface WhyTrustProps {
  whyTrustData: WhyTrustData[];
  heading: string;
}

const WhyTrust: React.FC<WhyTrustProps> = ({ whyTrustData, heading }) => {
  return (
    <section className="py-8 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-20 lg:px-10 xl:py-24 xl:px-12 2xl:py-32 2xl:px-16">
      {/* Heading */}
      <h2 className="font-bold text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20 text-center leading-tight max-w-5xl mx-auto text-gray-900">
        {heading}
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-8 xl:gap-10 2xl:gap-12 max-w-8xl mx-auto">
        {whyTrustData.map((data, index) => (
          <div
            key={index}
            className="text-center flex flex-col items-center p-4 sm:p-6 md:p-8 lg:p-6 xl:p-8 group hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out rounded-lg hover:bg-gray-50/50"
          >
            {/* Icon/Image Container */}
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-5 xl:mb-6 flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 flex items-center justify-center">
              <Image
                src={data.imageSrc}
                alt={data.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 lg:mb-3 xl:mb-4 leading-tight text-gray-900 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center">
              {data.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg text-gray-600 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm 2xl:max-w-md mx-auto">
              {data.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyTrust;
