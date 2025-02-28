import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/images/lightLogo.png";
import LoginIcon from "../../public/images/LoginIcon.svg";
import RegisterIcon from "../../public/images/RegisterIcon.svg";

export const Navbar = () => {
  return (
    <div className="mainNav flex w-full p-[10px_100px] justify-between items-center absolute z-50">
      <div className="flex items-center gap-[50px]">
        <Image src={Logo} alt="" className="md:w-[221px] md:h-[45px]" />
        <ul className="flex items-start gap-[30px] BRCobane16500Light">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li>
            <Link href="/stories">Stories</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/pricing">Pricing</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      <div className="navBtnDiv flex items-center gap-[12px]">
        <Link href="/login" className="WhiteBtn">
          <Image
            src={LoginIcon}
            alt="icon"
            className="md:w-[24px] md:h-[24px]"
          />
          Login
        </Link>
        <Link href="/register" className="YellowBtn">
          <Image
            src={RegisterIcon}
            alt="icon"
            className="md:w-[24px] md:h-[24px]"
          />
          Register Now
        </Link>
      </div>
    </div>
  );
};
