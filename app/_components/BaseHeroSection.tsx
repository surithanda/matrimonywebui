'use client';

import React, { useState } from "react";
import Image from "next/image";

interface BaseHeroSectionProps {
  backgroundImage: string;
  height?: string;
  children: React.ReactNode;
  className?: string;
}

export const BaseHeroSection = ({
  backgroundImage,
  height = "h-[600px]",
  children,
  className = "",
}: BaseHeroSectionProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <section className={`relative ${height} ${className}`}>
      {/* Placeholder gradient that shows immediately */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d3745] to-[#1a4d5f] -z-10" />
      
      {/* Main image with loading state */}
      <Image
        src={backgroundImage}
        alt="Hero Background"
        fill
        priority
        quality={75}
        className={`object-cover object-center -z-10 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        loading="eager"
        onLoad={() => setIsImageLoaded(true)}
      />
      
      {children}
    </section>
  );
}; 