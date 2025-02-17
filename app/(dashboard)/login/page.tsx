import React from "react";
import LoginForm from "./_components/LoginForm";
import Image from "next/image";
import lantern from "/public/images/lantern.png";

const page = () => {
  return (
    <div className="dashboard-background md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 h-[90vh]">
      <Image
        src={lantern}
        alt="lantern"
        className="md:h-[200px] w-auto absolute top-[54px] left-[120px]"
      />
      <div className="flex justify-between items-center h-full w-full">
        <div className="w-1/2">
          <h2 className="dmserif32600 opacity-50">Welcome to</h2>
          <p className="BRCobane56600">Chaturvarnam Matrimony Services</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
