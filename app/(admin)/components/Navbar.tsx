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
    <div className="flex justify-between h-fit md:px-[120px] z-20">
      {/* Logo */}
      <Link href="/dashboard" className="py-2">
        <Image src={logo} alt="" className="md:w-[221px] md:h-[45px]" />
      </Link>
      {isAccountOpen && (
        <>
          <ul className="flex justify-center gap-8 grow items-center h-[61px] ps-9">
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
                href="/admindashboard"
              >
                Dashboard
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/partner"
              )}`}
            >
              <Link
                className={`nav-link  h-full flex items-center BRCobane18600`}
                href="/partner"
              >
                Partner
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/adminprofiles"
              )}`}
            >
              <Link
                className={`nav-link  h-full flex items-center BRCobane18600`}
                href="/adminprofiles"
              >
                Profile
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/adminaccounts"
              )}`}
            >
              <Link
                className={`nav-link  h-full flex items-center BRCobane18600`}
                href="/adminaccounts"
              >
                Accounts
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/adminsearch"
              )}`}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600`}
                href="/adminsearch"
              >
                Search
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/adminmasterdata"
              )}`}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600`}
                href="/adminmasterdata"
              >
                Master Data
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/adminlogs"
              )}`}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600`}
                href="/adminlogs"
              >
                Logs
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/admincontent"
              )}`}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600`}
                href="/admincontent"
              >
                Content
              </Link>
            </li>
            <li
              className={`nav-item h-full flex items-center ${isActive(
                "/adminmoderation"
              )}`}
            >
              <Link
                className={`nav-link h-full flex items-center BRCobane18600`}
                href="/adminmoderation"
              >
                Moderation
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default Navbar;
