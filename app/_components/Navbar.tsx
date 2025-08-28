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
      setIsScrolled(window.scrollY > 50);
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
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center bg-white/80 rounded p-1"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* OFF-CANVAS MENU */}
      <div
        className={`fixed top-0 right-0 w-[75%] sm:w-[60%] h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center px-4 py-6 border-b bg-black">
          <Link href="/" >
            <Image src={Logo} alt="Logo" className="w-[180px]" />
          </Link>
          <button onClick={() => setMenuOpen(false)}>
            <X color="white" size={28} />
          </button>
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-6 p-5 text-lg">
          <li>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/stories"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              Stories
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/events"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Login Button */}
        <div className="px-5 mt-6">
          <Link
            href="/login"
            className="WhiteBtn flex items-center justify-center gap-2 w-full"
            onClick={() => setMenuOpen(false)}
          >
            <Image src={LoginIcon} alt="Login" className="w-[20px] h-[20px]" />
            Login
          </Link>
        </div>
      </div>

      {/* DARK OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};
