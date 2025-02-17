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
    <div className="md:py-[120px] md:px-[100px]">
      {" "}
      <h2 className="BRCobane56600 mb-[50px] text-center">{heading}</h2>
      <div className="flex flex-wrap items-center justify-center gap-y-8">
        {whyTrustData.map((data, index) => (
          <div
            key={index}
            className="text-center flex flex-col items-center w-[33%]"
          >
            <Image
              src={data.imageSrc}
              alt={data.title}
              className="mx-auto mb-3 w-16 h-16"
            />
            <h3 className="BRCobane20400">{data.title}</h3>
            <p className="mt-3 BRCobane16400 w-[50%]">{data.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyTrust;
