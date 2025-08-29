"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../public/images/lightLogo.png";
import LoginIcon from "../../public/images/LoginIcon.svg";
import RegisterIcon from "../../public/images/RegisterIcon.svg";
import { LogIn, Menu, User, X } from "lucide-react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Pages with dark navbar background
  const darkPages = ["/login", "/register", "/forgotpassword", "/otp"];
  const isDarkPage = darkPages.includes(pathname);

  // Nav Links Array
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/stories", label: "Stories" },
    { href: "/services", label: "Services" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`mainNav fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isDarkPage
          ? "bg-[#0d0d0d]/50"
          : isScrolled
          ? "bg-[#0d0d0d]/60 shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-5 md:px-1 lg:px-4 xl:px-20 py-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src={Logo}
            alt="Logo"
            className="w-[160px] md:w-[200px] lg:w-[221px]"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-4 lg:gap-6 xl:gap-8 BRCobane16500Light text-white">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.href}
                className={`text-sm md:text-sm lg:text-lg xl:text-xl ${
                  isActive ? "text-yellow-500 font-bold" : ""
                }`}
              >
                <Link
                  href={link.href}
                  className={`transition ${
                    isActive ? "text-yellow-500" : "hover:text-yellow-500"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-white hover:text-[#e69a00] flex items-center gap-2 text-sm md:text-sm lg:text-lg xl:text-xl"
          >
            <LogIn />
            Login
          </Link>
          <Link
            href="/register"
            className="text-white hover:text-[#e69a00] flex items-center gap-2 text-sm md:text-sm lg:text-lg xl:text-xl"
          >
            <User />
            Register
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center bg-white/80 rounded-full p-1"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={28} color="black" />
        </button>
      </div>

      {/* OFF-CANVAS MENU */}
      <div
        className={`fixed top-0 right-0 w-[75%] sm:w-[60%] h-full bg-white shadow-lg z-[60] transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-6 border-b bg-[#0d0d0d]">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image src={Logo} alt="Logo" className="w-[180px]" />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X color="white" size={28} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div className="bg-white h-screen">
          <ul className="flex flex-col gap-6 p-5 text-lg text-gray-800">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 border-b border-gray-100 transition-colors ${
                      isActive
                        ? "text-yellow-500 font-semibold"
                        : "hover:text-yellow-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Buttons */}
          <div className="px-5 mt-8 space-y-4">
            <Link
              href="/login"
              className="WhiteBtn flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
              className="YellowBtn flex items-center justify-center gap-2 w-full py-3 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
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
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55]"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};
