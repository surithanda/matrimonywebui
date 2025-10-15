import React from "react";
import Image from "next/image";
import logo from "@/public/images/loader.png"; // 🟠 adjust path if needed

export default function LogoLoader() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <div className="animate-[spin_4s_linear_infinite]">
        <Image
          src={logo}
          alt="Loading..."
          width={150}
          height={150}
          priority
          className="select-none"
        />
      </div>
    </div>
  );
}
