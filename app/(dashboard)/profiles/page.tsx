"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdFamilyRestroom, MdVerified } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useDispatch } from "react-redux";
import { getAllProfillesAsync } from "@/app/store/features/profileSlice";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import Lottie from "lottie-react";
import Loading from "@/public/lottie/Loading.json";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdBook } from "react-icons/io";
import { CiPhone } from "react-icons/ci";
import { HiOutlineBriefcase } from "react-icons/hi";
import { toAbsoluteUrl } from "@/app/lib/env";

// ✅ Utility functions
function getInitials(firstName?: string, lastName?: string) {
  if (!firstName && !lastName) return "?";
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProfileID } = useProfileContext();
  const allProfiles = useAppSelector((state) => state.profile.allProfiles);
  const { findReligionName } = useMetaDataLoader();
  const [loading, setLoading] = useState(false);

  const getProfileImage = (profile: any) => {
    if (profile?.profile_image) return toAbsoluteUrl(profile.profile_image);
    if (profile?.url) return toAbsoluteUrl(profile.url);

    return null;
  };

  useEffect(() => {
    if (selectedProfileID) {
      setLoading(true);

      (dispatch as any)(getAllProfillesAsync(selectedProfileID))
        .unwrap()
        .finally(() => setLoading(false));
    }
  }, [selectedProfileID, dispatch]);

  return (
    <div className="dashboard-background md:px-[60px] lg:px-[60px] 2xl:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-16">
      <div className="flex justify-between items-center w-full px-3 mt-4 lg:px-0 lg:mt-4">
        <h2 className="dmserif32600" style={{ fontFamily: "BR Cobane" }}>
          All Profiles
        </h2>
      </div>

      <div className="w-full px-4 lg:px-0 mt-3 lg:mt-0">
        {loading ? (
          // Loader
          <div className="flex justify-center items-center h-64">
            <Lottie
              animationData={Loading}
              loop
              autoplay
              style={{ width: 150, height: 150 }}
            />
          </div>
        ) : allProfiles?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 lg:px-0 mt-3 lg:mt-0">
            {allProfiles?.map((profile: any, index: number) => {
              return (
                <div
                  key={profile.profile_id || index}
                  className="relative bg-white rounded-md shadow-md overflow-hidden"
                >
                  {/* Top Cover Photo */}
                  <div className="h-36 w-full overflow-hidden bg-gray-200"></div>

                  {/* Verified Badges */}
                  <div className="flex flex-col justify-center items-center gap-2 my-2 text-white absolute top-0 right-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md">
                        <IoLocationOutline color="black" size={12} />
                        <MdVerified
                          className="inline text-blue-500 cursor-pointer"
                          size={12}
                          title="Verified Address"
                        />
                      </div>
                      <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md">
                        <IoMdBook color="black" size={12} />
                        <MdVerified
                          className="inline text-blue-500 cursor-pointer"
                          size={12}
                          title="Verified Education"
                        />
                      </div>
                      <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md">
                        <CiPhone color="black" size={12} />
                        <MdVerified
                          className="inline text-blue-500 cursor-pointer"
                          size={12}
                          title="Verified Contact"
                        />
                      </div>
                      <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md">
                        <HiOutlineBriefcase color="black" size={12} />
                        <MdVerified
                          className="inline text-blue-500 cursor-pointer"
                          size={12}
                          title="Verified Employment"
                        />
                      </div>
                      <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md">
                        <MdFamilyRestroom color="black" size={12} />
                        <MdVerified
                          className="inline text-blue-500 cursor-pointer"
                          size={12}
                          title="Verified Family"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-6 pb-4">
                    {/* Profile Image + Name/Details Side by Side */}
                    <div className="flex items-center gap-4">
                      <div className="absolute left-3 top-[7rem]">
                        {(() => {
                          const profileImage = getProfileImage(profile);
                          return profileImage ? (
                            <Image
                              className="w-24 h-24 rounded-full border-4 border-white object-cover"
                              src={profileImage}
                              alt={profile.first_name || "Profile"}
                              width={96}
                              height={96}
                            />
                          ) : (
                            <div
                              className={`w-24 h-24 flex items-center justify-center text-white text-2xl font-bold rounded-full border-4 border-white ${getAvatarColor(
                                profile.first_name || "Unknown"
                              )}`}
                            >
                              {getInitials(
                                profile.first_name,
                                profile.last_name
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Name + Location */}
                      <div className="flex flex-col ms-[6rem] mt-1 w-[calc(100%-6rem)]">
                        <h2
                          className="font-bold text-lg truncate"
                          style={{ fontFamily: "BR Cobane" }}
                          title={`${profile.first_name} ${profile.last_name}`}
                        >
                          {profile.first_name} {profile.last_name}
                        </h2>
                        <p
                          className="text-gray-500 text-xs min-h-[1rem] truncate"
                          title={profile.city}
                        >
                          {profile.city}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-around mt-3">
                      <div>
                        <p className="font-bold text-lg">
                          {profile.age || "N/A"}
                        </p>
                        <p className="text-gray-400 text-sm">Age</p>
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          {findReligionName(
                            profile?.religion ?? profile?.religion ?? 0
                          ) || "N/A"}
                        </p>
                        <p className="text-gray-400 text-sm">Religion</p>
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          {profile.gender || "N/A"}
                        </p>
                        <p className="text-gray-400 text-sm">Gender</p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center gap-4 mt-6 overflow-hidden">
                      <Button
                        asChild
                        className="w-full text-white rounded-md bg-orange-500 hover:bg-orange-600 transition-colors"
                        size="md"
                      >
                        <Link
                          href={`/profiles/${profile.profile_id}?fromSearch=true`}
                          className="flex items-center gap-2"
                        >
                          <Eye size={18} />
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Empty state
          <p className="text-center text-gray-500 py-10">No profiles found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
