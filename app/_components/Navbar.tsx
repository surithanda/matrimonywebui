"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/images/lightLogo.png";
import LoginIcon from "../../public/images/LoginIcon.svg";
import RegisterIcon from "../../public/images/RegisterIcon.svg";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`mainNav fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-[#0d0d0d]/90 shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-5 md:px-1 lg:px-4 xl:px-20 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={Logo}
              alt="Logo"
              className="w-[160px] md:w-[200px] lg:w-[221px]"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 lg:gap-8 BRCobane16500Light text-white">
          <li>
            <Link href="/" className="hover:text-yellow-500 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-yellow-500 transition">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/stories" className="hover:text-yellow-500 transition">
              Stories
            </Link>
          </li>
          <li>
            <Link href="/services" className="hover:text-yellow-500 transition">
              Services
            </Link>
          </li>
          <li>
            <Link href="/events" className="hover:text-yellow-500 transition">
              Events
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-yellow-500 transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="WhiteBtn flex items-center gap-2">
            <Image
              src={LoginIcon}
              alt="Login"
              className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]"
            />
            Login
          </Link>
          {/* <Link href="/register" className="YellowBtn flex items-center gap-2">
            <Image
              src={RegisterIcon}
              alt="Register"
              className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]"
            />
            Register
          </Link> */}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center bg-white/80 rounded p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md absolute w-full left-0 top-[70px] px-5 py-4">
          <ul className="flex flex-col gap-4 mb-4">
            <li>
              <Link
                href="/"
                className="block hover:text-yellow-500"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block hover:text-yellow-500"
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/stories"
                className="block hover:text-yellow-500"
                onClick={() => setMenuOpen(false)}
              >
                Stories
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="block hover:text-yellow-500"
                onClick={() => setMenuOpen(false)}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="block hover:text-yellow-500"
                onClick={() => setMenuOpen(false)}
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block hover:text-yellow-500"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="WhiteBtn flex items-center justify-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={LoginIcon}
                alt="Login"
                className="w-[20px] h-[20px]"
              />
              Login
            </Link>
            <Link
              href="/register"
              className="YellowBtn flex items-center justify-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={RegisterIcon}
                alt="Register"
                className="w-[20px] h-[20px]"
              />
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
