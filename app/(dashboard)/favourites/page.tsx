"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { getFavoritesAsync } from "@/app/store/features/profileSlice";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import { MdVerified } from "react-icons/md";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import NoData from "@/public/images/nodata.png";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/lottie/Loading.json";

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

  useEffect(() => {
    const loadFavorites = async () => {
      if (selectedProfileID > 0) {
        try {
          setLoading(true);
          const response = await dispatch(
            getFavoritesAsync({ profileId: selectedProfileID })
          ).unwrap();

          console.log("favoriteee", response.data);
          setFavourites(response.data || []);
        } catch (error) {
          console.error("Error fetching favourites:", error);
          setFavourites([]); // fallback empty
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setFavourites([]);
      }
    };
    loadFavorites();
  }, [dispatch, selectedProfileID]);

  return (
    <div className="dashboard-background md:px-[60px] lg:px-[60px] 2xl:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-16 w-full">
      <div className="flex justify-between items-center w-full px-3 mt-4 lg:px-0 lg:mt-4">
        <h2 className="dmserif32600">Favourites</h2>
      </div>

      {/* ✅ Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] w-full">
          <Lottie animationData={loaderAnimation} loop={true} className="w-40 h-40" />
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
          {favourites.map((profile, index) => (
            <div
              key={profile.id || profile.profile_id || profile.user_id || index}
              className="relative bg-white rounded-md shadow-md overflow-hidden"
            >
              {/* Top Cover Photo */}
              <div className="h-36 w-full overflow-hidden bg-gray-200"></div>

              {/* Favorite + Badges */}
              <div className="flex flex-col justify-center items-center gap-2 my-2 text-white absolute top-0 right-2">
                <button
                  onClick={() =>
                    handleToggleFavorite(profile.id || profile.profile_id)
                  }
                  className="bg-white rounded-full p-1 hover:scale-110 transition-transform"
                >
                  {IsFavorite ? (
                    <IoIosHeart size={20} className="text-red-500" />
                  ) : (
                    <IoIosHeartEmpty size={20} className="text-black" />
                  )}
                </button>
                <div className="flex flex-col gap-1">
                  <MdVerified
                    className="inline text-blue-500 cursor-pointer"
                    size={14}
                    title="Verified Address"
                  />
                  <MdVerified
                    className="inline text-red-500 cursor-pointer"
                    size={14}
                    title="Verified Education"
                  />
                  <MdVerified
                    className="inline text-orange-500 cursor-pointer"
                    size={14}
                    title="Verified Contact"
                  />
                  <MdVerified
                    className="inline text-yellow-500 cursor-pointer"
                    size={14}
                    title="Verified Employment"
                  />
                  <MdVerified
                    className="inline text-sky-500 cursor-pointer"
                    size={14}
                    title="Verified Family"
                  />
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
                          {getInitials(profile.first_name, profile.last_name)}
                        </div>
                      );
                    })()}
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
                      {profile.occupation || profile.city || profile.country ? (
                        <>
                          {profile.occupation}
                          {profile.occupation &&
                          (profile.city || profile.country)
                            ? " · "
                            : ""}
                          {profile.city || profile.country}
                        </>
                      ) : null}
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
                      {profile?.religion || "N/A"}
                    </p>
                    <p className="text-gray-400 text-sm">Religion</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{profile?.gender}</p>
                    <p className="text-gray-400 text-sm">Gender</p>
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
                      href={`/profiles/${
                        profile.id ||
                        profile.profile_id ||
                        profile.user_id ||
                        index
                      }?fromSearch=true`}
                    >
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
