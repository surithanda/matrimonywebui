"use client";
import React, { useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import {
  ProfileContextProvider,
  useProfileContext,
} from "@/app/utils/useProfileContext";
import Tabs from "./_components/Tabs";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { getNextRoute } from "@/app/utils/routeOrder";
import Link from "next/link";
import { Eye } from "lucide-react";
import { FaMagnifyingGlass } from "react-icons/fa6";

// ⬅️ Import Shadcn Breadcrumb
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AppBreadcrumb from "../_components/AppBreadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loadMetaData } = useMetaDataLoader();
  const { setSelectedProfileID } = useProfileContext();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedProfileID } = useProfileContext();

  const handleContinue = () => {
    const continueEvent = new CustomEvent("profile-continue");
    window.dispatchEvent(continueEvent);
  };

  const handleSkip = () => {
    const nextRoute = getNextRoute(pathname);
    router.push(nextRoute);
  };

  useEffect(() => {
    loadMetaData();
  }, [loadMetaData]);

  return (
    <div className="dashboard-background mt-20 md:mt-16 md:px-[20px] lg:px-[40px] 2xl:px-[80px] md:py-8 flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <AppBreadcrumb
            items={[
              { label: "Dahsboard", href: "/dashboard" },
              { label: "Create Profile" },
            ]}
          />

          {/* Title */}
          <h2 className="dmserif32600 mt-2">Create Profile</h2>
        </div>

        {/* Right-side buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Link href={`/search`} className="flex items-center gap-2">
              <FaMagnifyingGlass size={17} />
              Search Preference
            </Link>
          </Button>
          <Button variant="outline">
            <Link
              href={`/profiles/${selectedProfileID}`}
              className="flex items-center gap-2"
            >
              <Eye size={20} />
              Preview My Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="profile-details-box w-full text-left">
        <div>
          <Tabs />
          {/* <Sidebar /> */}
          {children}
        </div>
      </div>
    </div>
  );
}
