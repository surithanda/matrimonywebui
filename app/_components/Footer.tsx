import React from "react";
import Link from "next/link";
import Image from "next/image";
import MainLogo from "@/public/images/logo3.png";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer  px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10 sm:py-12 md:py-14 lg:py-10 relative mt-12 mb-3">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-28 xl:gap-80 items-center text-center lg:text-left">
        {/* Logo + Description */}
        <div className="flex flex-col items-center lg:items-start gap-3">
          <Image src={MainLogo} alt="Logo" className="w-40 md:w-56" />
          <p className="text-sm md:text-base text-gray-700 max-w-md">
            Chaturvarnam Matrimony Services – Connecting hearts and building
            lifelong relationships.
          </p>
        </div>

        {/* Social Media */}
        <div className="flex flex-col justify-center items-center lg:items-start gap-3">
          <p className="text-sm md:text-base font-medium text-gray-700 text-left">
            Follow us
          </p>
          <div className="flex gap-6">
            <Link
              href="https://facebook.com"
              target="_blank"
              className=" hover:scale-110 transition-transform"
            >
              <FaFacebook size={26} />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className=" hover:scale-110 transition-transform"
            >
              <FaInstagram size={26} />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className=" hover:scale-110 transition-transform"
            >
              <FaYoutube size={26} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className=" hover:scale-110 transition-transform"
            >
              <FaSquareXTwitter size={26} />
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center lg:items-start gap-2">
          <p className="text-sm md:text-base text-gray-700">
            Have questions? Contact us at:
          </p>
          <p className="text-sm md:text-base">
            <a
              href="tel:+832-547-8554"
              className="font-semibold hover:text-yellow-500 transition-colors"
            >
              +(832) 547-8554
            </a>{" "}
            |{" "}
            <a
              href="mailto:info@matimony.org"
              className="font-semibold hover:text-yellow-500 transition-colors"
            >
              info@matrimony.org
            </a>
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-full h-px bg-gray-300 my-8"></div>

      {/* BOTTOM SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-xs sm:text-sm md:text-base text-gray-600">
          © {currentYear} Chaturvarnam Matrimony Services. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm md:text-base">
          <Link
            href="/terms-and-conditions"
            className="hover:text-yellow-500 transition"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-yellow-500 transition"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
