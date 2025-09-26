import React from "react";
import ForgotPassword from "./_components/ForgotPassword";
import Image from "next/image";
import lantern from "/public/images/lantern.png";
import patternbackground from "@/public/images/pattern.png";
import flowerbackground from "@/public/images/flower.png";

const page = () => {
  return (
    <div className="dashboard-background px-4 md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 h-[90vh] relative">
            <Image
        src={patternbackground}
        alt="card background"
        className="w-full absolute left-0 top-0 h-full -z-10 opacity-50"
      />
      <Image
        src={flowerbackground}
        alt="card background"
        className="w-[100%] absolute left-0 top-0 h-full -z-10 scale-x-[-1] opacity-50"
      />
      <div className="text-center w-full h-full flex flex-col md:flex-col justify-center items-center gap-6 md:gap-12">
        {/* <div className="w-full text-center mt-20">
          <h2 className="dmserif32600 opacity-50">Welcome to</h2>
          <p className="text-4xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mt-1 md:mt-2 leading-tight text-black font-bold">Chaturvarnam Matrimony Services</p>
        </div> */}
        <ForgotPassword />
      </div>
    </div>
  );
};

export default page;
