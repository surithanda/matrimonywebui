import React from "react";
import Link from "next/link";
import MainLogo from "@/public/images/MainLogo.svg";
import footerleaves from "@/public/images/footerleaves.png";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="footer bg-[#fff7e7cc] flex flex-col items-center gap-[50px] p-[50px_100px_20px_100px] relative">
      <p>
        If you have any further queries, feel free to reach us at:
        <a href="tel:+832-547-8554">
          <strong> (832) 547-8554</strong>
        </a>{" "}
        or{" "}
        <a href="mailto:surithanda1971@gmail.com">
          <strong>surithanda1971@gmail.com</strong>
        </a>
      </p>
      <div>
        <div className="footer-line w-full z-20"></div>
        <ul className="flex gap-[70px] items-start md:py-[30px]">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/stories">Stories</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <div className="footer-line w-full"></div>
      </div>
      <p>© 2024 Chaturvarnam Matrimony Services. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
