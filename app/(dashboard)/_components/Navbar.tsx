"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import logo from "/public/images/MainLogo.svg";
import dp from "/public/images/p-i.png";
import Link from "next/link";
import LoginIcon from "/public/images/LoginIcon.svg";
import RegisterIcon from "/public/images/RegisterIcon.svg";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/store";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Function to check if the current route is active
  const isActive = (path: string) => {
    return pathname === path
      ? "opacity-100 border-b-2 border-gray-950"
      : "opacity-50 border-b-2 border-white";
  };

  useEffect(() => {
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/otp" ||
      pathname === "/forgotpassword"
    ) {
      setIsAccountOpen(false);
    } else {
      setIsAccountOpen(true);
    }
  }, [pathname]);

  const checkToken = () => {
    const token = localStorage.getItem("matrimony token");
    if (token) {
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "RESET_APP" });
    router.push("/");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between h-fit px-4 py-2 sm:px-6 md:px-6 lg:px-2 xl:px-[120px] z-20">
      {/* Top bar with logo and mobile menu toggle */}
      <div className="flex justify-between items-center py-2 lg:py-0">
        {/* Logo */}
        <Link href={checkToken() ? "/dashboard" : "/"} className="py-2">
          <Image
            src={logo}
            alt=""
            className="w-[160px] h-[32px] sm:w-[180px] sm:h-[36px] md:w-[200px] md:h-[40px] lg:w-[221px] lg:h-[45px]"
          />
        </Link>

        {/* Mobile/Tablet menu toggle button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden focus:outline-none p-2"
          aria-label="Toggle mobile menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMobileMenuOpen
                  ? "rotate-45 translate-y-1"
                  : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMobileMenuOpen
                  ? "-rotate-45 -translate-y-1"
                  : "translate-y-0.5"
              }`}
            ></span>
          </div>
        </button>

        {/* Desktop profile section when account is open */}
        {isAccountOpen && (
          <div className="hidden lg:flex items-center space-x-6">
            {/* Notification Icon */}
            <div className="relative">
              <button className="focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <path
                    d="M20.5145 16.3631C20.4374 16.2702 20.3616 16.1773 20.2873 16.0876C19.2652 14.8513 18.6468 14.1052 18.6468 10.6053C18.6468 8.79339 18.2133 7.30667 17.3589 6.19164C16.7289 5.3679 15.8773 4.74301 14.7548 4.2812C14.7404 4.27317 14.7275 4.26263 14.7167 4.25007C14.313 2.89809 13.2082 1.99258 11.9621 1.99258C10.7161 1.99258 9.61172 2.89809 9.20798 4.24868C9.19723 4.26079 9.18451 4.271 9.17035 4.27888C6.55094 5.35721 5.27794 7.42608 5.27794 10.6039C5.27794 14.1052 4.66048 14.8513 3.63744 16.0862C3.5631 16.1759 3.48737 16.2669 3.41025 16.3617C3.21103 16.602 3.0848 16.8943 3.04652 17.204C3.00823 17.5138 3.05948 17.828 3.19421 18.1095C3.48087 18.7135 4.09181 19.0885 4.78918 19.0885H19.1402C19.8343 19.0885 20.4411 18.714 20.7287 18.1128C20.864 17.8312 20.9157 17.5167 20.8777 17.2066C20.8398 16.8965 20.7137 16.6038 20.5145 16.3631ZM11.9621 22.8066C12.6335 22.8061 13.2922 22.6239 13.8684 22.2793C14.4445 21.9346 14.9167 21.4405 15.2348 20.8493C15.2498 20.821 15.2572 20.7892 15.2563 20.7572C15.2554 20.7251 15.2462 20.6939 15.2296 20.6664C15.2131 20.639 15.1897 20.6163 15.1618 20.6005C15.1339 20.5848 15.1024 20.5765 15.0703 20.5766H8.85489C8.8228 20.5765 8.79122 20.5847 8.76324 20.6004C8.73526 20.6161 8.71182 20.6388 8.69522 20.6662C8.67861 20.6937 8.6694 20.725 8.66847 20.7571C8.66755 20.7891 8.67495 20.8209 8.68996 20.8493C9.00799 21.4405 9.48008 21.9345 10.0562 22.2791C10.6322 22.6237 11.2908 22.806 11.9621 22.8066Z"
                    fill="#DCDCDC"
                  />
                </svg>
              </button>
            </div>

            {/* Profile Icon and Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsShowDropdown(!isShowDropdown)}
                className="focus:outline-none"
              >
                <Image
                  src={dp}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } lg:flex lg:items-center lg:flex-grow`}
      >
        {isAccountOpen && (
          <>
            <ul className="flex flex-col lg:flex-row lg:justify-center gap-1 sm:gap-2 lg:gap-6 xl:gap-9 lg:grow lg:items-center lg:h-[61px] px-0 lg:px-4 xl:px-9 py-4 lg:py-0">
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${
                  pathname === "/dashboard" ||
                  pathname === "/account" ||
                  pathname === "/changepassword"
                    ? "opacity-100 lg:border-b-2 lg:border-gray-950 bg-gray-100 lg:bg-transparent rounded lg:rounded-none"
                    : "opacity-50 lg:border-b-2 lg:border-white hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none"
                } `}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-sm sm:text-base lg:text-lg`}
                  href="/dashboard"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${
                  pathname === "/profiles"
                    ? "opacity-100 lg:border-b-2 lg:border-gray-950 bg-gray-100 lg:bg-transparent rounded lg:rounded-none"
                    : "opacity-50 lg:border-b-2 lg:border-white hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none"
                }`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-sm sm:text-base lg:text-lg`}
                  href="/profiles"
                  onClick={closeMobileMenu}
                >
                  Profiles
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${isActive(
                  "/settings"
                )} hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-sm sm:text-base lg:text-lg`}
                  href="/settings"
                  onClick={closeMobileMenu}
                >
                  Profile Settings
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${isActive(
                  "/search"
                )} hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-sm sm:text-base lg:text-lg`}
                  href="/search"
                  onClick={closeMobileMenu}
                >
                  Search
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${isActive(
                  "/recommendations"
                )} hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-sm sm:text-base lg:text-lg`}
                  href="/recommendations"
                  onClick={closeMobileMenu}
                >
                  Recommendations
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${isActive(
                  "/favourites"
                )} hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-sm sm:text-base lg:text-lg`}
                  href="/favourites"
                  onClick={closeMobileMenu}
                >
                  Favourites
                </Link>
              </li>
            </ul>

            {/* Mobile/Tablet profile section when account is open */}
            <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-gray-200 mt-2">
              <div className="flex items-center space-x-4">
                {/* Notification Icon */}
                <div className="relative">
                  <button className="focus:outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                    >
                      <path
                        d="M20.5145 16.3631C20.4374 16.2702 20.3616 16.1773 20.2873 16.0876C19.2652 14.8513 18.6468 14.1052 18.6468 10.6053C18.6468 8.79339 18.2133 7.30667 17.3589 6.19164C16.7289 5.3679 15.8773 4.74301 14.7548 4.2812C14.7404 4.27317 14.7275 4.26263 14.7167 4.25007C14.313 2.89809 13.2082 1.99258 11.9621 1.99258C10.7161 1.99258 9.61172 2.89809 9.20798 4.24868C9.19723 4.26079 9.18451 4.271 9.17035 4.27888C6.55094 5.35721 5.27794 7.42608 5.27794 10.6039C5.27794 14.1052 4.66048 14.1052 3.63744 16.0862C3.5631 16.1759 3.48737 16.2669 3.41025 16.3617C3.21103 16.602 3.0848 16.8943 3.04652 17.204C3.00823 17.5138 3.05948 17.828 3.19421 18.1095C3.48087 18.7135 4.09181 19.0885 4.78918 19.0885H19.1402C19.8343 19.0885 20.4411 18.714 20.7287 18.1128C20.864 17.8312 20.9157 17.5167 20.8777 17.2066C20.8398 16.8965 20.7137 16.6038 20.5145 16.3631ZM11.9621 22.8066C12.6335 22.8061 13.2922 22.6239 13.8684 22.2793C14.4445 21.9346 14.9167 21.4405 15.2348 20.8493C15.2498 20.821 15.2572 20.7892 15.2563 20.7572C15.2554 20.7251 15.2462 20.6939 15.2296 20.6664C15.2131 20.639 15.1897 20.6163 15.1618 20.6005C15.1339 20.5848 15.1024 20.5765 15.0703 20.5766H8.85489C8.8228 20.5765 8.79122 20.5847 8.76324 20.6004C8.73526 20.6161 8.71182 20.6388 8.69522 20.6662C8.67861 20.6937 8.6694 20.725 8.66847 20.7571C8.66755 20.7891 8.67495 20.8209 8.68996 20.8493C9.00799 21.4405 9.48008 21.9345 10.0562 22.2791C10.6322 22.6237 11.2908 22.806 11.9621 22.8066Z"
                        fill="#DCDCDC"
                      />
                    </svg>
                  </button>
                </div>

                {/* Profile Icon and Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsShowDropdown(!isShowDropdown)}
                    className="focus:outline-none"
                  >
                    <Image
                      src={dp}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {!isAccountOpen && (
          <>
            <ul className="flex flex-col lg:flex-row lg:justify-center gap-1 sm:gap-2 lg:gap-0 xl:gap-5 lg:grow lg:items-center lg:h-[61px] px-0 lg:px-4 xl:px-9 py-4 lg:py-0">
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${"opacity-50 lg:border-b-2 lg:border-white hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none"} `}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-lg sm:text-base lg:text-lg`}
                  href="/"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${isActive(
                  "/about"
                )} hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-lg sm:text-base lg:text-lg`}
                  href="/profiles"
                  onClick={closeMobileMenu}
                >
                  About us
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${isActive(
                  "/services"
                )} hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-lg sm:text-base lg:text-lg`}
                  href="/stories"
                  onClick={closeMobileMenu}
                >
                  Stories
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${isActive(
                  "/search"
                )} hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-lg sm:text-base lg:text-lg`}
                  href="/search"
                  onClick={closeMobileMenu}
                >
                  Search
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${isActive(
                  "/events"
                )} hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-lg sm:text-base lg:text-lg`}
                  href="/recommendations"
                  onClick={closeMobileMenu}
                >
                  Events
                </Link>
              </li>
              <li
                className={`nav-item lg:h-full flex items-center px-4 py-2 lg:px-2 xl:px-0 lg:py-0 ${isActive(
                  "/favourites"
                )} hover:bg-gray-50 lg:hover:bg-transparent rounded lg:rounded-none`}
              >
                <Link
                  className={`nav-link lg:h-full flex items-center BRCobane18600 text-lg sm:text-base lg:text-lg`}
                  href="/contact"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Enhanced Responsive Login/Register Buttons */}
            <div className="navBtnDiv flex flex-col xs:flex-row sm:flex-row md:flex-row lg:flex-row items-stretch xs:items-center sm:items-center md:items-center lg:items-center gap-2 xs:gap-3 sm:gap-3 md:gap-3 lg:gap-[4px] xl:gap-[12px]  px-4 py-4 lg:px-0 lg:py-0 w-full xs:w-auto sm:w-auto">
              <Link
                href="/login"
                className="WhiteBtn flex items-center justify-center text-center 
               text-xs xs:text-sm sm:text-sm md:text-base lg:text-base 
               px-3 xs:px-4 sm:px-4 md:px-6 lg:px-6 
               py-2 xs:py-2 sm:py-2 md:py-3 lg:py-3 
               min-w-0 xs:min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[80px] xl:min-w-[160px]
               whitespace-nowrap transition-all duration-200 hover:scale-105"
                onClick={closeMobileMenu}
              >
                <Image
                  src={LoginIcon}
                  alt="icon"
                  className="inline-block w-[16px] h-[16px] xs:w-[18px] xs:h-[18px] sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px] lg:w-[24px] lg:h-[24px] mr-1 xs:mr-2 sm:mr-2 flex-shrink-0"
                />
                <span className="truncate">Login</span>
              </Link>

              {/* <Link
                href="/register"
                className="YellowBtn flex items-center justify-center text-center 
               text-xs xs:text-sm sm:text-sm md:text-base lg:text-base 
               px-3 xs:px-4 sm:px-4 md:px-6 lg:px-6 
               py-2 xs:py-2 sm:py-2 md:py-3 lg:py-3 
               min-w-0 xs:min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[100px] xl:min-w-[200px]
               whitespace-nowrap transition-all duration-200 hover:scale-105"
                onClick={closeMobileMenu}
              >
                <Image
                  src={RegisterIcon}
                  alt="icon"
                  className="inline-block w-[16px] h-[16px] xs:w-[18px] xs:h-[18px] sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px] lg:w-[24px] lg:h-[24px] mr-1 xs:mr-2 sm:mr-2 flex-shrink-0"
                />
                <span className="truncate">Register Now</span>
              </Link> */}
            </div>
          </>
        )}
      </div>

      {/* Profile Dropdown */}
      {isShowDropdown && (
        <div className="absolute right-4 sm:right-6 md:right-8 lg:right-[120px] top-[120px] sm:top-[130px] lg:top-[61px] w-48 bg-white rounded-[12px] shadow-md z-10">
          <ul className="space-y-2 p-2">
            <li>
              <a
                href="/account"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md text-sm sm:text-base"
                onClick={closeMobileMenu}
              >
                Account
              </a>
            </li>
            <li>
              <a
                href="/changepassword"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md text-sm sm:text-base"
                onClick={closeMobileMenu}
              >
                Change Password
              </a>
            </li>
            <li>
              <a
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer text-sm sm:text-base"
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
