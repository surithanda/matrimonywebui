'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="heroSection w-full h-[600px] relative flex flex-col md:pt-52">
      {/* Placeholder gradient that shows immediately */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d3745] to-[#1a4d5f] -z-10" />
      
      {/* Main image with loading state */}
      <Image
        src="/images/heroBg.png"
        alt="Hero Background"
        fill
        priority
        quality={100}
        className={`object-cover object-center -z-10 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        sizes="100vw"
        onLoad={() => setIsImageLoaded(true)}
      />
      
      <div className="heroHeadings flex md:w-2/5 flex-col ps-[120px] items-start justify-center gap-[12px]">
        <h1>Continuation of Family Legacy</h1>
        <p>
          Marriage ensures the continuation of family lineage, ancestral
          traditions, cultural heritage, customs, rituals, values, beliefs,
          practices, and passes on family legacy, stories, wisdom, and teachings
          to future generations.
        </p>
        <Link href="#" className="WhiteBtn">
          <span>Start Your Search Today</span>
        </Link>
      </div>
    </div>
  );
};
