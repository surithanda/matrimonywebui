"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <section className="heroSection w-full h-[600px] sm:h-[450px] md:h-screen relative flex flex-col justify-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d3745] to-[#1a4d5f] -z-10" />

      {/* Background Image */}
      <Image
        src="/images/heroBg.png"
        alt="Hero Background"
        fill
        priority
        quality={100}
        className={` object-cover object-center md:object-center -z-10 transition-opacity duration-500 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="100vw"
        onLoad={() => setIsImageLoaded(true)}
      />

      {/* Content */}
      <div className="heroHeadings flex flex-col gap-4 px-6 md:px-12 lg:px-32  md:text-left items-center md:items-start">
        <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Continuation of Family Legacy
        </h1>
        <p className="text-sm md:text-lg lg:text-xl text-white/90 max-w-xl">
          Marriage ensures the continuation of family lineage, ancestral
          traditions, cultural heritage, customs, rituals, values, beliefs,
          practices, and passes on family legacy, stories, wisdom, and teachings
          to future generations.
        </p>
        <Link
          href="#"
          className="WhiteBtn text-sm md:text-base px-4 md:px-6 py-2 md:py-3 mt-2"
        >
          Start Your Search Today
        </Link>
      </div>
    </section>
  );
};
