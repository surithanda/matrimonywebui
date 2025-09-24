import React from "react";
import Link from "next/link";
import MainLogo from "@/public/images/MainLogo.svg";
import footerleaves from "@/public/images/footerleaves.png";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer bg-white flex flex-col items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16 relative">
      {/* Contact Information */}
      <div className="text-center max-w-4xl">
        <p className="text-base sm:text-base md:text-lg leading-relaxed">
          If you have any further queries, feel free to reach us at:
          <br className="sm:hidden" />
          <a
            href="tel:+832-547-8554"
            className="inline-block mt-1 sm:mt-0 sm:ml-1 hover:text-blue-600 transition-colors duration-200"
          >
            <strong>(832) 547-8554</strong>
          </a>
          <span className="hidden sm:inline"> or </span>
          <br className="sm:hidden" />
          <a
            href="mailto:surithanda1971@gmail.com"
            className="inline-block mt-1 sm:mt-0 sm:ml-1 hover:text-blue-600 transition-colors duration-200 break-all sm:break-normal"
          >
            <strong>surithanda1971@gmail.com</strong>
          </a>
        </p>
      </div>

      {/* Navigation Section */}
      <div className="w-full max-w-6xl">
        {/* Top divider line */}
        <div className="footer-line w-full h-px bg-gray-300 sm:mb-8 md:mb-6"></div>

        {/* Navigation Links */}
        <nav className="py-4 md:py-0">
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 text-center lg:text-left">
            <li>
              <Link
                href="/"
                className="block py-2 px-3 text-sm sm:text-base md:text-lg hover:text-blue-600 hover:underline transition-all duration-200 rounded-md hover:bg-white hover:bg-opacity-50"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block py-2 px-3 text-sm sm:text-base md:text-lg hover:text-blue-600 hover:underline transition-all duration-200 rounded-md hover:bg-white hover:bg-opacity-50"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="block py-2 px-3 text-sm sm:text-base md:text-lg hover:text-blue-600 hover:underline transition-all duration-200 rounded-md hover:bg-white hover:bg-opacity-50"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/stories"
                className="block py-2 px-3 text-sm sm:text-base md:text-lg hover:text-blue-600 hover:underline transition-all duration-200 rounded-md hover:bg-white hover:bg-opacity-50"
              >
                Stories
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="block py-2 px-3 text-sm sm:text-base md:text-lg hover:text-blue-600 hover:underline transition-all duration-200 rounded-md hover:bg-white hover:bg-opacity-50"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block py-2 px-3 text-sm sm:text-base md:text-lg hover:text-blue-600 hover:underline transition-all duration-200 rounded-md hover:bg-white hover:bg-opacity-50"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom divider line */}
        <div className="footer-line w-full h-px bg-gray-300 sm:mt-8 md:mt-6"></div>
      </div>

      {/* Copyright */}
      <div className="text-center">
        <p className="text-xs sm:text-sm md:text-base text-gray-600">
          © {currentYear} Chaturvarnam Matrimony Services. All rights reserved.
        </p>
      </div>

      {/* Optional: Footer leaves decoration for larger screens */}
      <Image
        src={footerleaves}
        alt="Footer decoration"
        className="hidden xl:block absolute bottom-0 right-0 w-32 h-32 opacity-30 pointer-events-none"
      />
    </footer>
  );
};

export default Footer;
