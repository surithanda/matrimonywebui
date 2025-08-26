import React from "react";
import Register from "./_components/Register";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import lantern from "/public/images/lantern.png";

const page = () => {
  return (
    <div className="dashboard-background px-[20px] md:px-[60px] lg:px-[120px] md:py-8 flex flex-col items-center md:gap-8 relative">
      {/* Responsive lantern image */}
      <Image
        src={lantern}
        alt="lantern"
        className="hidden md:block md:h-[300px] w-auto absolute -top-3 left-[50px] md:left-[5px]"
      />

      <Image
        src={lantern}
        alt="lantern"
        className="hidden md:block md:h-[400px] w-auto absolute -top-4 right-[50px] md:right-[5px] scale-x-[-1]"
      />

      {/* Mobile lantern - smaller and positioned differently */}
      <Image
        src={lantern}
        alt="lantern"
        className="block md:hidden h-[100px] w-auto absolute -top-1 left-5 opacity-70"
      />

      <Image
        src={lantern}
        alt="lantern"
        className="block md:hidden h-[240px] w-auto absolute -top-1 right-1 opacity-70 scale-x-[-1]"
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
