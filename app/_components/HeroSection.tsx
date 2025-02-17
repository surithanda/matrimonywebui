import React from "react";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <div className="heroSection w-full h-[810px] over flex flex-col md:pt-52">
      {/* <Image
        src="../../public/images/herobg.png"
        alt="Hero Image"
        className="w-full h-full absolute left-0 top-0 -z-10"
        fill={true}
      /> */}
      <div className="heroHeadings flex md:w-2/5 flex-col ps-[120px] items-start justify-center gap-[12px]">
        <h1>Continuation of Family Legacy</h1>
        <p>
          Marriage ensures the continuation of family lineage, ancestral
          traditions, cultural heritage, customs, rituals, values, beliefs,
          practices, and passes on family legacy, stories, wisdom, and teachings
          to future generations.
        </p>
        <Link href="/register" className="WhiteBtn">
          <span>Start Your Search Today</span>
        </Link>
      </div>
    </div>
  );
};
