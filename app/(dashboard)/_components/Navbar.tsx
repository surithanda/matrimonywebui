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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="flex justify-between items-center h-fit px-4 py-2 sm:px-6 md:px-6 lg:px-2 xl:px-[120px] z-20 relative">
        {/* Logo */}
        <Link href={checkToken() ? "/dashboard" : "/"} className="py-2">
          <Image
            src={logo}
            alt=""
            className="w-[160px] h-[32px] sm:w-[180px] sm:h-[36px] md:w-[200px] md:h-[40px] lg:w-[221px] lg:h-[45px]"
          />
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex lg:items-center lg:flex-grow">
          {isAccountOpen && (
            <ul className="flex flex-row justify-center gap-6 xl:gap-9 grow items-center h-[61px] px-4 xl:px-9">
              <li
                className={`nav-item h-full flex items-center px-2 xl:px-0 ${
                  pathname === "/dashboard" ||
                  pathname === "/account" ||
                  pathname === "/changepassword"
                    ? "opacity-100 border-b-2 border-gray-950"
                    : "opacity-50 border-b-2 border-white"
                } `}
              >
                <Link
                  className="nav-link h-full flex items-center BRCobane18600 text-lg"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li
                className={`nav-item h-full flex items-center px-2 xl:px-0 ${
                  pathname === "/profiles"
                    ? "opacity-100 border-b-2 border-gray-950"
                    : "opacity-50 border-b-2 border-white"
                }`}
              >
                <Link
                  className="nav-link h-full flex items-center BRCobane18600 text-lg"
                  href="/profiles"
                >
                  Profiles
                </Link>
              </li>
              <li
                className={`nav-item h-full flex items-center px-2 xl:px-0 ${isActive(
                  "/settings"
                )}`}
              >
                <Link
                  className="nav-link h-full flex items-center BRCobane18600 text-lg"
                  href="/settings"
                >
                  Profile Settings
                </Link>
              </li>
              <li
                className={`nav-item h-full flex items-center px-2 xl:px-0 ${isActive(
                  "/search"
                )}`}
              >
                <Link
                  className="nav-link h-full flex items-center BRCobane18600 text-lg"
                  href="/search"
                >
                  Search
                </Link>
              </li>
              <li
                className={`nav-item h-full flex items-center px-2 xl:px-0 ${isActive(
                  "/recommendations"
                )}`}
              >
                <Link
                  className="nav-link h-full flex items-center BRCobane18600 text-lg"
                  href="/recommendations"
                >
                  Recommendations
                </Link>
              </li>
              <li
                className={`nav-item h-full flex items-center px-2 xl:px-0 ${isActive(
                  "/favourites"
                )}`}
              >
                <Link
                  className="nav-link h-full flex items-center BRCobane18600 text-lg"
                  href="/favourites"
                >
                  Favourites
                </Link>
              </li>
            </ul>
          )}

          {!isAccountOpen && (
            <>
              <ul className="flex flex-row justify-center gap-0 xl:gap-5 grow items-center h-[61px] px-4 xl:px-9">
                <li className="nav-item h-full flex items-center px-2 xl:px-0 opacity-50 border-b-2 border-white">
                  <Link
                    className="nav-link h-full flex items-center BRCobane18600 text-lg"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                <li
                  className={`nav-item h-full flex items-center px-2 xl:px-0 ${isActive(
                    "/about"
                  )}`}
                >
                  <Link
                    className="nav-link h-full flex items-center BRCobane18600 text-lg"
                    href="/profiles"
                  >
                    About us
                  </Link>
                </li>
                <li
                  className={`nav-item h-full flex items-center px-2 xl:px-0 ${isActive(
                    "/services"
                  )}`}
                >
                  <Link
                    className="nav-link h-full flex items-center BRCobane18600 text-lg"
                    href="/stories"
                  >
                    Stories
                  </Link>
                </li>
                <li
                  className={`nav-item h-full flex items-center px-2 xl:px-0 ${isActive(
                    "/search"
                  )}`}
                >
                  <Link
                    className="nav-link h-full flex items-center BRCobane18600 text-lg"
                    href="/search"
                  >
                    Search
                  </Link>
                </li>
                <li
                  className={`nav-item h-full flex items-center px-2 xl:px-0 ${isActive(
                    "/events"
                  )}`}
                >
                  <Link
                    className="nav-link h-full flex items-center BRCobane18600 text-lg"
                    href="/recommendations"
                  >
                    Events
                  </Link>
                </li>
                <li
                  className={`nav-item h-full flex items-center px-2 xl:px-0 ${isActive(
                    "/favourites"
                  )}`}
                >
                  <Link
                    className="nav-link h-full flex items-center BRCobane18600 text-lg"
                    href="/contact"
                  >
                    Contact
                  </Link>
                </li>
              </ul>

              {/* Desktop Login/Register Buttons */}
              <div className="navBtnDiv flex flex-row items-center gap-[4px] xl:gap-[12px]">
                <Link
                  href="/login"
                  className="WhiteBtn flex items-center justify-center text-center 
                   text-base px-6 py-3 min-w-[80px] xl:min-w-[160px]
                   whitespace-nowrap transition-all duration-200 hover:scale-105"
                >
                  <Image
                    src={LoginIcon}
                    alt="icon"
                    className="inline-block w-[24px] h-[24px] mr-2 flex-shrink-0"
                  />
                  <span className="truncate">Login</span>
                </Link>
              </div>
            </>
          )}
        </div>

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

        {/* Mobile/Tablet menu toggle button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden focus:outline-none p-2 z-50 relative"
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
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden z-40 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Offcanvas Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Image src={logo} alt="" className="w-[140px] h-[28px]" />
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {isAccountOpen && (
              <>
                {/* User Profile Section */}
                <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
                  <Image
                    src={dp}
                    alt="Profile"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      User Profile
                    </p>
                    <p className="text-xs text-gray-500">
                      View and manage account
                    </p>
                  </div>
                  <button className="p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
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

                {/* Navigation Links */}
                <nav className="py-2">
                  <Link
                    href="/dashboard"
                    className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                      pathname === "/dashboard" ||
                      pathname === "/account" ||
                      pathname === "/changepassword"
                        ? "text-gray-900 bg-gray-100 border-r-2 border-gray-950"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profiles"
                    className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                      pathname === "/profiles"
                        ? "text-gray-900 bg-gray-100 border-r-2 border-gray-950"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Profiles
                  </Link>
                  <Link
                    href="/settings"
                    className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                      pathname === "/settings"
                        ? "text-gray-900 bg-gray-100 border-r-2 border-gray-950"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/search"
                    className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                      pathname === "/search"
                        ? "text-gray-900 bg-gray-100 border-r-2 border-gray-950"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Search
                  </Link>
                  <Link
                    href="/recommendations"
                    className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                      pathname === "/recommendations"
                        ? "text-gray-900 bg-gray-100 border-r-2 border-gray-950"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Recommendations
                  </Link>
                  <Link
                    href="/favourites"
                    className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                      pathname === "/favourites"
                        ? "text-gray-900 bg-gray-100 border-r-2 border-gray-950"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Favourites
                  </Link>
                </nav>

                {/* Account Actions */}
                <div className="border-t border-gray-200 mt-4">
                  <div className="py-2">
                    <Link
                      href="/account"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Account Settings
                    </Link>
                    <Link
                      href="/changepassword"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            {!isAccountOpen && (
              <>
                {/* Navigation Links for non-authenticated users */}
                <nav className="py-2">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Home
                  </Link>
                  <Link
                    href="/profiles"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    About us
                  </Link>
                  <Link
                    href="/stories"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Stories
                  </Link>
                  <Link
                    href="/search"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Search
                  </Link>
                  <Link
                    href="/recommendations"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Events
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </Link>
                </nav>

                {/* Login/Register Buttons for Mobile */}
                <div className="border-t border-gray-200 mt-4 p-4">
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="WhiteBtn flex items-center justify-center text-center text-base px-4 py-3 w-full transition-all duration-200 hover:scale-105"
                      onClick={closeMobileMenu}
                    >
                      <Image
                        src={LoginIcon}
                        alt="icon"
                        className="inline-block w-[20px] h-[20px] mr-2 flex-shrink-0"
                      />
                      <span>Login</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Profile Dropdown */}
      {isShowDropdown && (
        <div className="absolute right-4 sm:right-6 md:right-8 lg:right-[120px] top-[61px] w-48 bg-white rounded-[12px] shadow-md z-10 hidden lg:block">
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
    </>
  );
};

export default Navbar;
