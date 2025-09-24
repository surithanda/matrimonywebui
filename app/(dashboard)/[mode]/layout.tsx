"use client";
import React, { useEffect, useRef } from "react";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import {
  ProfileContextProvider,
  useProfileContext,
} from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useParams, notFound } from "next/navigation";
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
import Tabs from "./_components/Tabs";
import { useProfileModeInfo } from "./hooks/useValidatedProfileMode";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loadMetaData } = useMetaDataLoader();
  const { setSelectedProfileID, selectedProfileID, isNew } = useProfileContext();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { mode, isCreateMode, isUpdateMode, modeLabel } = useProfileModeInfo();
  
  useEffect(() => {
    if(selectedProfileID > 0 && isCreateMode) {
      // Don't redirect - let the component handle this in render
      // router.push("dashboard");
      // localStorage.setItem("selectedProfile", selectedProfileID.toString());
      // setSelectedProfileID(0);
    }
  }, [selectedProfileID, isCreateMode, setSelectedProfileID]);

  // Use ref to store the original profile ID when entering create mode
  const originalProfileIDRef = useRef<number | null>(null);
  const previousModeRef = useRef<string | null>(null);
  
  // Flag to track if component is mounting vs unmounting
  const isMountingRef = useRef(true);
  
  // Validate mode parameter
  const validModes = ['createprofile', 'updateprofile'];
  
  // IMMEDIATELY handle profile ID for create mode - before any useEffect
  // if (mode && validModes.includes(mode) && isCreateMode && selectedProfileID !== 0) {
  //   // Store original profile ID if we haven't already
  //   if (originalProfileIDRef.current === null) {
  //     originalProfileIDRef.current = selectedProfileID;
  //     console.log("Immediate backup of original profile ID:", originalProfileIDRef.current);
  //   }
  //   console.log("Immediately setting profile ID to 0 for create mode");
  //   setSelectedProfileID(0);
  // }
  
  // Handle invalid modes
  if (mode && !validModes.includes(mode)) {
    notFound();
  }

  // Handle mode changes and profile restoration for update mode
  // useEffect(() => {
  //   if (!mode || !validModes.includes(mode)) return;
    
  //   console.log("Valid mode detected in layout:", mode, isCreateMode, isUpdateMode, "Selected Profile ID:", selectedProfileID);
    
  //   // Handle mode changes
  //   if (mode !== previousModeRef.current) {
  //     console.log("Mode changed from", previousModeRef.current, "to", mode);
   
  //     if (isCreateMode && selectedProfileID !== 0) {
  //       // Store original profile ID if we haven't already
  //       // if (originalProfileIDRef.current === null) {
  //         originalProfileIDRef.current = selectedProfileID;
  //         console.log("Immediate backup of original profile ID:", originalProfileIDRef.current);
  //       // }
  //       console.log("Immediately setting profile ID to 0 for create mode");
  //       setSelectedProfileID(0);
  //     }

  //     if (isUpdateMode && originalProfileIDRef.current !== null && selectedProfileID === 0) {
  //       // Entering update mode from create mode - restore original profile ID
  //       console.log("Restoring original profile ID for update mode:", originalProfileIDRef.current);
  //       setSelectedProfileID(originalProfileIDRef.current);
  //       originalProfileIDRef.current = null; // Clear the backup
  //     }
      
  //     previousModeRef.current = mode;
  //   }
  // }, [mode, isCreateMode, isUpdateMode, selectedProfileID]);
  
  // Monitor pathname changes for navigation detection
  // useEffect(() => {
  //   // If pathname doesn't contain the current mode and we have a backup, user navigated away
  //   if (originalProfileIDRef.current !== null && mode && !pathname.includes(`/${mode}`)) {
  //     console.log("Navigation away from mode detected, restoring profile ID:", originalProfileIDRef.current);
  //     setSelectedProfileID(originalProfileIDRef.current);
  //     originalProfileIDRef.current = null;
  //   }
  // }, [pathname, mode]);

  // Handle component unmount scenarios
  // useEffect(() => {
  //   isMountingRef.current = false; // Mark as mounted
  //   console.log("Layout component mounted");
    
  //   if (!mode || !validModes.includes(mode)) return;
    
  //   console.log("Valid mode detected in layout:", mode, isCreateMode, isUpdateMode, "Selected Profile ID:", selectedProfileID);
    
  //   // Handle mode changes
  //   if (mode !== previousModeRef.current) {
  //     console.log("Mode changed from", previousModeRef.current, "to", mode);
   
  //     if (isCreateMode && selectedProfileID !== 0) {
  //       // Store original profile ID if we haven't already
  //       // if (originalProfileIDRef.current === null) {
  //         originalProfileIDRef.current = selectedProfileID;
  //         console.log("Immediate backup of original profile ID:", originalProfileIDRef.current);
  //       // }
  //       console.log("Immediately setting profile ID to 0 for create mode");
  //       setSelectedProfileID(0);
  //     }

  //     if (isUpdateMode && originalProfileIDRef.current !== null && selectedProfileID === 0) {
  //       // Entering update mode from create mode - restore original profile ID
  //       console.log("Restoring original profile ID for update mode:", originalProfileIDRef.current);
  //       setSelectedProfileID(originalProfileIDRef.current);
  //       originalProfileIDRef.current = null; // Clear the backup
  //     }
      
  //     previousModeRef.current = mode;
  //   }
  //   // Cleanup function to restore profile ID when component unmounts
  //   return () => {
  //     if(!isMountingRef.current) {
  //     console.log("Layout component unmounting...");
      
  //     // Restore profile ID on component unmount if we have a backup
  //     if (originalProfileIDRef.current !== null) {
  //       console.log("Component unmount: restoring profile ID:", originalProfileIDRef.current);
  //       setSelectedProfileID(originalProfileIDRef.current);
  //       originalProfileIDRef.current = null;
  //     }
  //   }
  //   };
  // }, []); // Empty dependency array - only runs on mount/unmount

  // Don't render content for invalid modes
  // if (mode && !validModes.includes(mode)) {
  //   return null;
  // }

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

  // Show custom message when user tries to create profile but already has one
  if (selectedProfileID > 0 && isCreateMode && !isNew) {
    return (
      <div className="dashboard-background mt-20 md:mt-16 md:px-[20px] lg:px-[40px] 2xl:px-[80px] md:py-8 flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-4">
          <div>
            <h2 className="dmserif32600 mt-2">Create Profile</h2>
            <AppBreadcrumb
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Create Profile" },
              ]}
            />
          </div>
        </div>

        <div className="profile-details-box w-full text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Profile Already Exists
              </h3>
              <p className="text-gray-600 mb-6">
                The current site configuration allows you to create only one profile per account.
              </p>
            </div>
            
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Go Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-background mt-20 md:mt-16 md:px-[20px] lg:px-[40px] 2xl:px-[80px] md:py-8 flex flex-col items-center">
      <div className="flex flex-row md:flex-row justify-between items-start md:items-center w-full mb-4 px-2 py-2 md:px-0 md:py-0">
        <div>
          {/* Title */}
          <h2 className="dmserif32600 mt-2">
            {mode === 'createprofile' ? 'Create Profile' : 'Update Profile'}
          </h2>
          <AppBreadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: mode === 'createprofile' ? 'Create Profile' : 'Update Profile' },
            ]}
          />
        </div>

        {/* Right-side buttons */}
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Button variant="outline">
            <Link href={`/settings`} className="flex items-center gap-2">
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
          {/* Force remount of child components when switching between create/update modes */}
          <div key={`${mode}-${selectedProfileID}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
