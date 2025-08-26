import React from "react";
import OTP from "./_components/OTP";
import Image from "next/image";
import lantern from "/public/images/lantern.png";

const page = () => {
  return (
    <div className="dashboard-background px-4 md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 h-[90vh] relative">
      {/* Responsive lantern image */}
      <Image
        src={lantern}
        alt="lantern"
        className="hidden md:block md:h-[300px] w-auto absolute -top-3 left-[50px]"
      />
      <Image
        src={lantern}
        alt="lantern"
        className="hidden md:block md:h-[400px] w-auto absolute -top-3 right-[50px] scale-x-[-1]"
      />

      {/* Mobile lantern - smaller and positioned differently */}
      <Image
        src={lantern}
        alt="lantern"
        className="block md:hidden h-[100px] w-auto absolute -top-1 left-4 opacity-70"
      />
      <Image
        src={lantern}
        alt="lantern"
        className="block md:hidden h-[140px] w-auto absolute -top-1 right-4 opacity-70 scale-x-[-1]"
      />
      <div className="text-center w-full h-full flex flex-col md:flex-col justify-center items-center gap-6 md:gap-12">
        <div className="w-full text-center">
          <h2 className="dmserif32600 opacity-50 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">Welcome to</h2>
          <p className="text-4xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mt-1 md:mt-2 leading-tight text-black font-bold">Chaturvarnam Matrimony Services</p>
        </div>
        <OTP />
      </div>
    </div>
  );
};

export default page;
