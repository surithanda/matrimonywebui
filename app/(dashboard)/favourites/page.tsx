"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import {
  getCompleteProfileAsync,
  getFavoritesAsync,
} from "@/app/store/features/profileSlice";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import { MdFamilyRestroom, MdVerified } from "react-icons/md";
import { IoIosHeart, IoIosHeartEmpty, IoMdBook } from "react-icons/io";
import NoData from "@/public/images/nodata.png";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/lottie/Loading.json";
import { IoBook, IoLocationOutline, IoLocationSharp } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";
import { HiOutlineBriefcase } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa6";

// Dummy helper functions — replace with actual implementations
const getProfileImage = (profile: any) => profile.image_url || null;
const getAvatarColor = (name: string) => "bg-gray-500";
const getInitials = (first: string, last: string) =>
  `${first?.[0] || ""}${last?.[0] || ""}`;
const handleToggleFavorite = (id: number) => {
  console.log("Toggle favorite", id);
};

const IsFavorite = true; // Replace with actual logic

const FavouritesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProfileID } = useProfileContext();

  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // ✅ loader state
  const [profiles, setProfiles] = useState<any[]>([]);
  const completeProfile = useAppSelector(
    (state) => state.profile.completeProfile
  );

  useEffect(() => {
    const loadFavoritesWithProfiles = async () => {
      if (selectedProfileID > 0) {
        try {
          setLoading(true);

          // 1️⃣ Get favorites list
          const favResponse = await dispatch(
            getFavoritesAsync({ profileId: selectedProfileID })
          ).unwrap();

          const favorites = favResponse?.data || [];
          setFavourites(favorites);

          // 2️⃣ Extract all to_profile_ids
          const toProfileIds = favorites.map((fav: any) => fav.to_profile_id);

          // 3️⃣ Fetch full profiles for each to_profile_id in parallel
          const profiles = await Promise.all(
            toProfileIds.map(async (id: number) => {
              try {
                const profile = await dispatch(
                  getCompleteProfileAsync(id)
                ).unwrap();
                return profile; // successful profile
              } catch (err) {
                console.error(`Error fetching profile ${id}:`, err);
                return null; // fallback if one fails
              }
            })
          );

          // 4️⃣ Filter out nulls and set in state
          setProfiles(profiles.filter(Boolean));
          console.log("profile", profiles);
        } catch (error) {
          console.error("Error fetching favourites or profiles:", error);
          setFavourites([]);
          setProfiles([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setFavourites([]);
        setProfiles([]);
      }
    };

    loadFavoritesWithProfiles();
  }, [dispatch, selectedProfileID]);

  return (
    <div className="dashboard-background md:px-[60px] lg:px-[60px] 2xl:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-16 w-full">
      <div className="flex justify-between items-center w-full px-3 mt-4 lg:px-0 lg:mt-4">
        <h2 className="dmserif32600">Favourites</h2>
      </div>

      {/* ✅ Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] w-full">
          <Lottie
            animationData={loaderAnimation}
            loop={true}
            className="w-40 h-40"
          />
          <p className="text-gray-500 text-lg">Loading favourites...</p>
        </div>
      ) : favourites.length === 0 ? (
        // ✅ No Data
        <div className="col-span-full text-center py-10 flex flex-col items-center">
          <Image
            src={NoData}
            alt="No favourites"
            width={220}
            height={220}
            className="mb-4 opacity-80"
          />
          <p className="text-gray-500 text-lg font-medium">
            No favourites available.
          </p>
        </div>
      ) : (
        // ✅ Data Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 lg:px-0 mt-3 lg:mt-0">
          {profiles.map((profileWrapper, index) => {
            const profile = profileWrapper.data; // ✅ unwrap the actual profile

            return (
              <div
                key={profile.profile_id || index}
                className="relative bg-white rounded-md shadow-md overflow-hidden"
              >
                {/* Top Cover Photo */}
                <div className="h-36 w-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {(() => {
                    const profileImage = getProfileImage(profile);
                    return profileImage ? (
                      <Image
                        className="w-full h-36 object-cover"
                        src={profileImage}
                        alt={profile.first_name || "Profile Cover"}
                        width={500}
                        height={144}
                      />
                    ) : (
                      <div className="w-full h-36 flex items-center justify-center bg-gray-300 text-gray-600 text-lg">
                        No Image
                      </div>
                    );
                  })()}
                </div>

                {/* Favorite + Badges */}
                <div className="flex flex-col justify-center items-center gap-2 my-2 text-white absolute top-0 right-1">
                  <button
                    onClick={() => handleToggleFavorite(profile.profile_id)}
                    className="bg-white rounded-full p-1 hover:scale-110 transition-transform"
                  >
                    {IsFavorite ? (
                      <IoIosHeart size={20} className="text-red-500" />
                    ) : (
                      <IoIosHeartEmpty size={20} className="text-black" />
                    )}
                  </button>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md text-blue-500">
                      <IoLocationSharp size={12} />
                    </div>
                    <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md text-blue-500">
                      <IoBook size={12} />
                    </div>
                    <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md text-blue-500">
                      <FaPhoneAlt size={12} />
                    </div>
                    <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md text-blue-500">
                      <FaBriefcase size={12} />
                    </div>
                    <div className="flex items-center gap-.5 bg-white p-0.5 rounded-md text-blue-500">
                      <MdFamilyRestroom size={12} />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-6 pb-4">
                  {/* Profile Image + Name/Details Side by Side */}
                  <div className="flex items-center gap-4">
                    <div className="absolute left-3 top-[7rem]">
                      <div
                        className={`w-24 h-24 flex items-center justify-center text-white text-2xl font-bold rounded-full border-4 border-white ${getAvatarColor(
                          profile.first_name || "Unknown"
                        )}`}
                      >
                        {getInitials(profile.first_name, profile.last_name)}
                      </div>
                    </div>

                    {/* Name + Occupation + Location */}
                    <div className="flex flex-col ms-[6rem] mt-1">
                      <h2
                        className="font-bold text-lg"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        {profile.first_name} {profile.last_name}
                      </h2>
                      <p className="text-gray-500 text-xs min-h-[1rem]">
                        {profile.profession_text || profile.occupation || ""}
                        {(profile.profession_text || profile.occupation) &&
                        (profile.states || profile.countries)
                          ? " · "
                          : ""}
                        {profile.states || profile.countries}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-around mt-3">
                    <div>
                      <p className="font-bold text-lg">{profile?.age}</p>
                      <p className="text-gray-400 text-sm">Age</p>
                    </div>

                    <div>
                      <p className="font-bold text-lg">
                        {profile?.gender_text || "N/A"}
                      </p>
                      <p className="text-gray-400 text-sm">Gender</p>
                    </div>

                    <div>
                      <p className="font-bold text-lg truncate overflow-hidden whitespace-nowrap">
                        {profile?.religion_text || "N/A"}
                      </p>
                      <p className="text-gray-400 text-sm">Religion</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between items-center gap-4 mt-6 overflow-hidden">
                    <Button
                      className="w-full text-orange-500 border border-orange-500 rounded-md hover:bg-orange-600 hover:text-white transition-colors"
                      variant="outline"
                      size="md"
                    >
                      Send Interest
                    </Button>

                    <Button
                      asChild
                      className="w-full text-white rounded-md bg-orange-500 hover:bg-orange-600 transition-colors"
                      size="md"
                    >
                      <Link
                        href={`/profiles/${profile.profile_id}?fromSearch=true`}
                      >
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
