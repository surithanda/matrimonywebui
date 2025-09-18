"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, Menu, User, X } from "lucide-react";
import Logo from "../../public/images/logowhite.png";
import LoginIcon from "../../public/images/LoginIcon.svg";
import RegisterIcon from "../../public/images/RegisterIcon.svg";
import dp from "../../public/images/p-i.png";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useProfileContext } from "../utils/useProfileContext";
import Lottie from "lottie-react";
import Loading from "@/public/lottie/Loading.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userData = useAppSelector((state) => state.auth.userData);
  const { selectedProfileID } = useProfileContext();

  const checkToken = () => !!localStorage.getItem("matrimony token");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Clear local storage & reset Redux
      localStorage.clear();
      dispatch({ type: "RESET_APP" });

      // Optional: small delay so loader is visible
      setTimeout(() => {
        router.push("/");
        setIsLoggingOut(false);
      }, 500);
    } catch (err) {
      console.error("Logout failed", err);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    setIsLoggedIn(checkToken());
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const darkPages = [
    "/login",
    "/register",
    "/forgotpassword",
    "/otp",
    "/dashboard",
    "/profiles", // This will match /profiles and any subpaths
    "/settings",
    "/search",
    "/recommendations",
    "/favourites",
    "/createprofile",
    "/createprofile/primarycontact",
    "/createprofile/education",
    "/createprofile/employment",
    "/createprofile/hobbies",
    "/createprofile/lifestyle",
    "/createprofile/family",
    "/createprofile/references",
    "/createprofile/property",
    "/createprofile/photos",
    "/updateprofile", // Added for update profile route
    "/account",
    "/changepassword",
    "/dashboard/create-profile",
    "/payments",
  ];

  // Check if current path starts with any of the dark pages
  const isDarkPage = darkPages.some((page) => pathname.startsWith(page));

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/stories", label: "Stories" },
    { href: "/services", label: "Services" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
  ];

  const dashboardLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/search", label: "Search" },
    { href: "/favourites", label: "Favourites" },
    { href: "/profiles", label: "Profiles" },
    { href: "/recommendations", label: "Recommendations" },
    { href: "/payments", label: "Payments" },
  ];

  const navLinks = isLoggedIn ? dashboardLinks : publicLinks;
  const initials = `${userData?.first_name?.charAt(0) ?? ""}${
    userData?.last_name?.charAt(0) ?? ""
  }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-colors  duration-300 ${
          isDarkPage
            ? "bg-[#0d0d0d]/50 shadow-lg backdrop-blur-md"
            : isScrolled
            ? "bg-[#0d0d0d]/60 shadow-lg backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        {/* ... rest of your component remains the same ... */}
        <div className="flex justify-between items-center px-5 md:px-1 lg:px-0 xl:px-10 2xl:px-20 py-4">
          {/* Logo */}
          <Link href="/">
            <Image
              src={Logo}
              alt="Logo"
              className="w-[160px] md:w-[200px] lg:w-[221px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-4 lg:gap-6 xl:gap-8 text-white">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li
                  key={link.href}
                  className={`text-sm lg:text-lg xl:text-xl ${
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

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-[#e69a00] flex items-center gap-2 text-lg"
                >
                  <LogIn />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white hover:text-[#e69a00] flex items-center gap-2 text-lg"
                >
                  <User />
                  Register
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 w-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold focus:outline-none">
                    {initials}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-full bg-white rounded-lg shadow-md z-50">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="w-full">
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/changepassword" className="w-full">
                      Change Password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="data-[highlighted]:bg-red-500 data-[highlighted]:text-white cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Right Side (Profile + Menu) */}
          <div className="flex md:hidden items-center gap-3">
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setIsShowDropdown(!isShowDropdown)}
                  className="focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">
                    {`${userData?.first_name?.charAt(0) ?? ""}${
                      userData?.last_name?.charAt(0) ?? ""
                    }`}
                  </div>
                </button>
                {isShowDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md z-50">
                    <ul className="space-y-2 p-2">
                      <li>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
                        >
                          Account
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/changepassword"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
                        >
                          Change Password
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            <button
              className="flex items-center bg-white/80 rounded-full p-1"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} color="black" />
            </button>
          </div>
        </div>

        {/* Mobile Off-Canvas Menu */}
        <div
          className={`fixed top-0 right-0 w-[75%] sm:w-[60%] h-full bg-white shadow-lg z-[60] transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-4 py-6 border-b bg-[#0d0d0d]">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Image src={Logo} alt="Logo" className="w-[180px]" priority />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X color="white" size={28} />
            </button>
          </div>

          {/* Links */}
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

            {!isLoggedIn && (
              <div className="px-5 mt-8 space-y-4">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="WhiteBtn flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Image src={LoginIcon} alt="Login" className="w-5 h-5" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="YellowBtn flex items-center justify-center gap-2 w-full py-3 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Image
                    src={RegisterIcon}
                    alt="Register"
                    className="w-5 h-5"
                  />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[55]"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </nav>
      {/* Full-screen loader overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-32 h-32">
            <Lottie animationData={Loading} loop={true} />
          </div>
        </div>
      )}
    </>
  );
};
