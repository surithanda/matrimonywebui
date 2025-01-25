"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import logo from "/public/images/MainLogo.svg";
import dp from "/public/images/p-i.png";
import Link from "next/link";
import LoginIcon from "/public/images/LoginIcon.svg";
import RegisterIcon from "/public/images/RegisterIcon.svg";
import router from "next/router";

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

  const checkToken = () => {
    const token = localStorage.getItem("matrimony token");
    if (token) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="flex justify-between h-fit md:px-[120px] z-20">
      {/* Logo */}
      <Link href={checkToken() ? "/dashboard": "/"} className="py-2">
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
                    onClick={() => {
                      localStorage.removeItem("matrimony token");
                      router.push("/login");
                    }}
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
