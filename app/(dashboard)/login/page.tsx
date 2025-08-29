import React from "react";
import LoginForm from "./_components/LoginForm";
import Image from "next/image";
import lantern from "/public/images/lantern.png";
import patternbackground from "@/public/images/pattern.png";
import flowerbackground from "@/public/images/flower.png";

const page = () => {
  return (
    <div className="dashboard-background px-4 md:px-[120px] pt-4 md:pt-8 flex flex-col items-center md:gap-8 h-[90vh] lg:h-[100vh] xl:h-[90vh] relative">
      <Image
        src={patternbackground}
        alt="card background"
        className="w-screen absolute left-0 top-0 h-full -z-10 opacity-50"
      />
      <Image
        src={flowerbackground}
        alt="card background"
        className="w-[100%] absolute left-0 top-0 h-full -z-10 scale-x-[-1] opacity-50"
      />
      <div className="text-center w-full h-full flex flex-col md:flex-col justify-center items-center gap-6 md:gap-12">
        <div className="w-full text-center">
          <h2 className="dmserif32600 opacity-50 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            Welcome to
          </h2>
          <p className="text-4xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mt-1 md:mt-2 leading-tight text-black font-bold">
            Chaturvarnam Matrimony Services
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
