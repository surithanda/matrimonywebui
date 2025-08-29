import React from "react";
import Register from "./_components/Register";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import lantern from "/public/images/lantern.png";
import patternbackground from "@/public/images/pattern.png";
import flowerbackground from "@/public/images/flower.png";

const page = () => {
  return (
    <div className="dashboard-background mt-16 md:mt-0 px-[20px] md:px-[60px] lg:px-[120px] md:py-24 flex flex-col items-center md:gap-8 relative">
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

      <div className="w-full py-4 md:py-0 text-center">
        <h2 className="dmserif32600">Register Now</h2>
        <p className="text-sm md:text-2xl leading-tight text-black font-bold">
          Create an account to get started
        </p>
      </div>
      <Register />
      <ToastContainer />
    </div>
  );
};

export default page;
