"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import logo from "/public/images/MainLogo.svg";
import dp from "/public/images/p-i.png";
import Link from "next/link";
import LoginIcon from "/public/images/LoginIcon.svg";
import RegisterIcon from "/public/images/RegisterIcon.svg";

const Navbar = () => {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const pathname = usePathname();

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

  return (
    <div className="flex justify-between h-fit md:px-[60px] z-20">
      {/* Logo */}
      <Link href="/dashboard" className="py-2">
        <Image src={logo} alt="" className="md:w-[221px] md:h-[45px]" />
      </Link>
      {isAccountOpen && (
        <>
          <ul className="flex justify-center gap-9 grow items-center h-[61px] px-9">
            <li
              className={`nav-item h-full flex items-center ${
                pathname === "/dashboard" ||
                pathname === "/account" ||
                pathname === "/changepassword"
                  ? "opacity-100 border-b-2 border-gray-950"
                  : "opacity-50 border-b-2 border-white"
              } `}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600 `}
                href="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/profiles"
              )}`}
            >
              <Link
                className={`nav-link  h-full flex items-center BRCobane18600`}
                href="/profiles"
              >
                Profiles
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/settings"
              )}`}
            >
              <Link
                className={`nav-link  h-full flex items-center BRCobane18600`}
                href="/settings"
              >
                Profile Settings
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/search"
              )}`}
            >
              <Link
                className={`nav-link  h-full flex items-center BRCobane18600`}
                href="/search"
              >
                Search
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/recommendations"
              )}`}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600`}
                href="/recommendations"
              >
                Recommendations
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/favourites"
              )}`}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600`}
                href="/favourites"
              >
                Favourites
              </Link>
            </li>
          </ul>

          {/* Right-side Icons */}

          <div className={`lg:flex`}>
            <div className="flex items-center space-x-6 ml-4">
              {/* Notification Icon */}
              <div className="relative">
                <Link href="/pricing">
                  <button className="focus:outline-none yellow-btn">
                    Premium Plans
                  </button>
                </Link>
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

          {isShowDropdown && (
            <div className="absolute md:right-[120px] md:top-[61px] w-48 bg-white rounded-[12px] shadow-md z-10">
              <ul className="space-y-2 p-2">
                <li>
                  <a
                    href="/account"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
                  >
                    Account
                  </a>
                </li>
                <li>
                  <a
                    href="/changepassword"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
                  >
                    Change Password
                  </a>
                </li>
                <li>
                  <a
                    href="/logout"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </>
      )}
      {!isAccountOpen && (
        <>
          <ul className="flex justify-center gap-5 grow items-center h-[61px] px-9">
            <li
              className={`nav-item h-full flex items-center ${"opacity-50 border-b-2 border-white"} `}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600 `}
                href="/"
              >
                Home
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/about"
              )}`}
            >
              <Link
                className={`nav-link  h-full flex items-center BRCobane18600`}
                href="/profiles"
              >
                About us
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/services"
              )}`}
            >
              <Link
                className={`nav-link  h-full flex items-center BRCobane18600`}
                href="/stories"
              >
                Stories
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/search"
              )}`}
            >
              <Link
                className={`nav-link  h-full flex items-center BRCobane18600`}
                href="/search"
              >
                Search
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/events"
              )}`}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600`}
                href="/recommendations"
              >
                Events
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/favourites"
              )}`}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600`}
                href="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
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
        </>
      )}
    </div>
  );
};

export default Navbar;
