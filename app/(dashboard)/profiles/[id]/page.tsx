"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { RootState, AppDispatch } from "@/app/store/store";
import {
  getPersonalProfileAsync,
  getAddressAsync,
  getEducationAsync,
  getEmploymentAsync,
  getFamilyAsync,
  getPropertiesAsync,
  getHobbiesInterestsAsync,
  trackProfileViewAsync,
  createFavoriteAsync,
  deleteFavoriteAsync,
  getFavoritesAsync,
  getProfilePhotosAsync,
  getLifestyleAsync,
} from "@/app/store/features/profileSlice";
import { toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";
import { normalizePhotoUrl } from "@/app/utils/photoUrl.util";

import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaLocationDot, FaPlus, FaTwitter } from "react-icons/fa6";
import { BiSolidBadgeCheck } from "react-icons/bi";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import Card from "@/components/ui/carousel-card-1";
import { Button } from "@/components/ui/button";
import AppBreadcrumb from "../../_components/AppBreadcrumb";
import { BadgeCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";

const ViewProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const searchParams = useSearchParams();
  const profileId = parseInt(params.id as string);
  const fromSearch = searchParams.get("fromSearch") === "true";
  const {
    findJobTitleName,
    findCountryName,
    findStateName,
    findPropertyTypeName,
    findOwnershipTypeName,
    findGenderName,
    findMaritalStatusName,
    findReligionName,
    findFieldOfStudy,
  } = useMetaDataLoader();

  const {
    personalProfile,
    address,
    education,
    employment,
    family,
    properties,
    hobbies,
    interests,
    references,
    photos,
    loading,
    error,
    lifestyle,
  } = useSelector((state: RootState) => state.profile);

  interface ImageFile {
    url: string;
    file?: File | null;
  }

  const { loadMetaData } = useMetaDataLoader();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const { selectedProfileID } = useProfileContext();
  const accountProfileID = selectedProfileID > 0 ? selectedProfileID : 1;
  const [favoriteProfile, setFavoriteProfile] = useState<any>();

  const [profileImage, setProfileImage] = useState<ImageFile | null>(null);
  const [coverImage, setCoverImage] = useState<ImageFile | null>(null);
  const [individualImages, setIndividualImages] = useState<ImageFile[]>([]);

  // Hoisted helpers for photos (avoid hooks inside conditional renders)
  const toAbsoluteUrl = useCallback((u?: string | null) => {
    return normalizePhotoUrl(u); // Use the new photo URL utility
  }, []);

  // 1. Source of truth for type codes
  const PHOTO_TYPES = {
    profile: 450,
    cover: 454,
    individual: 456,
  } as const;

  // 3. Role-based association (internal usage)
  const photoTypeAssociation = useMemo(() => PHOTO_TYPES, []);

  // Derive display images from redux photos once, not during render
  useEffect(() => {
    let photoData: any[] = [];

    // Handle different possible structures safely
    if (Array.isArray((photos as any)?.data)) {
      photoData = (photos as any).data;
    } else if (Array.isArray((photos as any)?.photos)) {
      photoData = (photos as any).photos;
    } else if (Array.isArray(photos)) {
      photoData = photos;
    }

    if (photoData.length === 0) return;

    const resolved = photoData
      .map((p: any) => ({
        ...p,
        _rawUrl: p?.url || p?.photo_url || p?.file_url,
      }))
      .map((p: any) => ({ ...p, _src: normalizePhotoUrl(p?._rawUrl) }))
      .filter((p: any) => !!p._src);

    // Use role-based association
    const prof = resolved.find(
      (p: any) => Number(p.photo_type) === photoTypeAssociation.profile
    );
    const cov = resolved.find(
      (p: any) => Number(p.photo_type) === photoTypeAssociation.cover
    );
    const others = resolved.filter(
      (p: any) => Number(p.photo_type) === photoTypeAssociation.individual
    );

    setProfileImage(prof ? { url: prof._src, file: null } : null);
    setCoverImage(cov ? { url: cov._src, file: null } : null);
    setIndividualImages(others.map((p: any) => ({ url: p._src, file: null })));
  }, [photos, toAbsoluteUrl, photoTypeAssociation]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (accountProfileID > 0) {
        const response = await dispatch(
          getFavoritesAsync({ profileId: accountProfileID })
        ).unwrap();
        // console.log(response, profileId);
        response.data.map((item: any) => {
          if (item.to_profile_id === profileId && item.is_active) {
            setFavoriteProfile(item);
            setIsFavorite(true);
          }
        });
      }
    };
    loadFavorites();
  }, [dispatch, accountProfileID, profileId]);

  const handleToggleFavorite = async () => {
    if (isUpdatingFavorite) return;
    if (accountProfileID > 0) {
      try {
        setIsUpdatingFavorite(true);
        if (isFavorite) {
          await dispatch(
            deleteFavoriteAsync({
              profileId: accountProfileID,
              favoriteProfileId: favoriteProfile?.profile_favorite_id,
            })
          ).unwrap();
        } else {
          const result = await dispatch(
            createFavoriteAsync({
              profileId: accountProfileID,
              favoriteProfileId: profileId,
              isFavorite: !isFavorite,
            })
          ).unwrap();
          setFavoriteProfile({ profile_favorite_id: result?.data?.id });
        }

        setIsFavorite((prev) => !prev);
        // Toggle the local state if the API call is successful
      } catch (error) {
        console.error("Failed to update favorite status:", error);
        // You might want to show an error toast/notification here
      } finally {
        setIsUpdatingFavorite(false);
      }
    }
  };

  useEffect(() => {
    if (profileId && fromSearch) {
      console.log("Tracking profile view for profile ID:", profileId);
      try {
        if (accountProfileID > 0) {
          dispatch(
            trackProfileViewAsync({
              profileId: accountProfileID,
              viewedProfileId: profileId,
            })
          );
        }
      } catch (error) {
        console.error("Error tracking profile view:", error);
      }
    }
  }, [profileId, fromSearch, accountProfileID, dispatch]);

  useEffect(() => {
    loadMetaData();
    if (profileId) {
      // Load all profile sections
      dispatch(getPersonalProfileAsync({ profile_id: profileId }));
      dispatch(getAddressAsync({ profile_id: profileId }));
      dispatch(getEducationAsync({ profile_id: profileId }));
      dispatch(getEmploymentAsync({ profile_id: profileId }));
      dispatch(getFamilyAsync({ profile_id: profileId, type: "family" }));
      dispatch(getFamilyAsync({ profile_id: profileId, type: "reference" }));
      dispatch(getPropertiesAsync({ profile_id: profileId }));
      dispatch(
        getHobbiesInterestsAsync({ profile_id: profileId, category: "hobby" })
      );
      dispatch(
        getHobbiesInterestsAsync({
          profile_id: profileId,
          category: "interest",
        })
      );
      dispatch(getProfilePhotosAsync(Number(profileId)));
      dispatch(getLifestyleAsync({ profile_id: profileId }));
    }
  }, [dispatch, profileId]);

  // Debug: Log the Redux state data
  // useEffect(() => {
  //   // console.log("Redux State Debug:");
  //   // console.log("personalProfile:", personalProfile);
  //   // console.log("address:", address);
  //   // console.log("education:", education);
  //   // console.log("employment:", employment);
  //   // console.log("family:", family);
  //   // console.log("properties:", properties);
  //   // console.log("hobbies:", hobbies);
  //   // console.log("interests:", interests);
  //   // console.log("references:", references);
  // console.log("life style", lifestyle);

  // }, [
  //   personalProfile,
  //   address,
  //   education,
  //   employment,
  //   family,
  //   properties,
  //   hobbies,
  //   interests,
  //   references,
  // ]);
  console.log("address:", personalProfile);

  if (loading) {
    return (
      <div className="dashboard-background min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-background min-h-screen flex justify-center items-center">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const profileData = personalProfile?.data || personalProfile;
  const addressList = address?.data?.addresses || (address ? [address] : []);
  const educationList =
    education?.data?.educations || (education ? [education] : []);

  const categoryMapping = [
    {
      habitQuestion: "What best describes your eating habits?",
      habitAnswer: lifestyle?.data?.lifestyles?.[0]?.eating_habit,
    },
    {
      habitQuestion: "Do you follow any specific diet plan?",
      habitAnswer: lifestyle?.data?.lifestyles?.[0]?.diet_habit,
    },
    {
      habitQuestion: "How many cigarettes do you smoke per day on average?",
      habitAnswer: lifestyle?.data?.lifestyles?.[0]?.cigarettes_per_day,
    },
    {
      habitQuestion: "How frequently do you drink?",
      habitAnswer: lifestyle?.data?.lifestyles?.[0]?.drink_frequency,
    },
    {
      habitQuestion: "What type of gambling do you engage in?",
      habitAnswer: lifestyle?.data?.lifestyles?.[0]?.gambling_engage,
    },
    {
      habitQuestion: "How would you describe your physical activity level?",
      habitAnswer: lifestyle?.data?.lifestyles?.[0]?.physical_activity_level,
    },
    {
      habitQuestion: "Do you practice any relaxation techniques?",
      habitAnswer: lifestyle?.data?.lifestyles?.[0]?.relaxation_methods,
    },
  ];

  let employmentList = [];
  if (Array.isArray(employment?.data)) {
    employmentList = employment.data;
  } else if (employment?.data?.employments) {
    employmentList = employment.data.employments;
  } else if (employment) {
    employmentList = [employment];
  }

  const familyList = (family as any)?.family || [];
  const referencesList = (references as any)?.family || [];

  const formatWeight = (weight?: number | string, pound?: string) => {
    if (!weight) return null;

    const num = Number(weight);
    return Number.isInteger(num)
      ? `${num}${pound ?? ""}`
      : `${num.toFixed(2)}${pound ?? ""}`;
  };

  const allImages = [
    ...individualImages.map((img: any) => ({ imgUrl: img.url })),
  ];
  return (
    <>
      <div className="dashboard-background min-h-screen md:px-[20px] lg:px-[60px] md:pt-8 mt-20 md:mt-16">
        {/* ✅ Breadcrumb added here */}
        <AppBreadcrumb
          items={[
            { label: "Dahsboard", href: "/dashboard" },
            { label: "Preview My Profile" },
          ]}
        />
        {/* Profile Header */}
        <div>
          <div className="w-full rounded-lg overflow-hidden shadow-md  relative mb-4">
            {/* Banner with gradient background */}
            <div className="relative h-32 sm:h-40 lg:h-40 w-full">
              {coverImage ? (
                <Link
                  href={coverImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={coverImage.url}
                    alt="Cover Image"
                    width={1200} // or actual cover width
                    height={400} // or actual cover height
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </Link>
              ) : (
                // Gradient banner matching your example
                <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-400 via-blue-400 to-purple-600 relative overflow-hidden">
                  {/* Geometric overlay shapes for more visual interest */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-500/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-blue-500/20 to-transparent"></div>
                </div>
              )}
            </div>

            {/* Bottom Content */}
            <div className="relative px-4 sm:px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Left Section: Image + User Info */}
                <div className="flex flex-row items-start gap-4 w-full md:w-auto">
                  {/* Profile Image */}
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 -mt-10 sm:-mt-12 lg:-mt-14 
    border-4 border-white rounded-lg overflow-hidden bg-gray-300 shadow-md flex-shrink-0"
                  >
                    {profileImage?.url ? (
                      <Link
                        href={profileImage.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          width={100}
                          height={100}
                          src={profileImage.url}
                          alt="Profile"
                          className="w-full h-full object-cover cursor-pointer"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                        />
                      </Link>
                    ) : (
                      <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
            1.79-4 4 1.79 4 4 4zm0 2c-2.67 
            0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* User Info - Always to the right of the image */}
                  <div className="flex-1 min-w-0">
                    <h1
                      className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-black truncate"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      {profileData?.first_name ||
                        profileData?.name ||
                        "Unknown"}{" "}
                      {profileData?.last_name || ""}
                    </h1>

                    {/* Additional Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-600 text-xs sm:text-sm md:text-base flex-wrap">
                      {/* Phone */}
                      {profileData?.phone_mobile && (
                        <div className="flex items-center gap-1">
                          <MdLocalPhone className="flex-shrink-0" />
                          <span className="truncate">
                            {profileData.phone_mobile}
                          </span>
                        </div>
                      )}

                      {/* Email */}
                      {profileData?.email_id && (
                        <div className="flex items-center gap-1">
                          <MdEmail className="flex-shrink-0" />
                          <span className="truncate">
                            {profileData.email_id}
                          </span>
                        </div>
                      )}
                      {/* Location */}
                      {profileData?.location && (
                        <div className="flex items-center gap-1">
                          <FaLocationDot className="flex-shrink-0" />
                          <span className="truncate">
                            {profileData.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section: Buttons */}
                {fromSearch ? (
                  <div className="flex flex-col xs:flex-row sm:flex-col md:flex-row gap-2 sm:gap-3 w-full md:w-auto justify-end">
                    {/* Send Interest */}
                    <Button
                      disabled
                      className="bg-orange-500 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-md hover:bg-orange-600 transition-colors whitespace-nowrap text-sm sm:text-base"
                    >
                      Send Interest
                    </Button>

                    {/* Add to Favorites */}
                    <Button
                      variant="outline"
                      onClick={handleToggleFavorite}
                      disabled={isUpdatingFavorite}
                      className={`flex items-center justify-center gap-1 sm:gap-2 border ${
                        isFavorite
                          ? "bg-orange-100 border-orange-500 text-orange-700"
                          : "border-orange-500 text-orange-500 hover:bg-orange-50"
                      } px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-md transition-colors whitespace-nowrap text-sm sm:text-base`}
                    >
                      {isUpdatingFavorite ? (
                        <>
                          <AiOutlineLoading3Quarters className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                          <span>
                            {isFavorite ? "Removing..." : "Saving..."}
                          </span>
                        </>
                      ) : (
                        <>
                          {isFavorite ? (
                            <AiFillHeart className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                          ) : (
                            <AiOutlineHeart className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                          <span>
                            {isFavorite ? "Favorited" : "Add to Favorites"}
                          </span>
                        </>
                      )}
                    </Button>

                    {/* Send Message */}
                    <Button
                      disabled
                      variant="outline"
                      className="border border-gray-300 text-gray-700 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap text-sm sm:text-base"
                    >
                      Send Message
                    </Button>
                  </div>
                ) : (
                  // Show Edit Profile button if not fromSearch
                  <div className="flex flex-col xs:flex-row sm:flex-col md:flex-row gap-2 sm:gap-3 w-full md:w-auto justify-end">
                    <Link
                      href="/updateprofile"
                      className="bg-orange-500 text-white px-1 sm:px-4 md:px-6 py-1.5 sm:py-1 rounded-md hover:bg-orange-600 transition-colors whitespace-nowrap text-sm sm:text-base flex items-center justify-center gap-2"
                    >
                      <CiEdit size={20} />
                      Edit Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-8 px-2 md:px-0">
              {/* Personal Details */}
              <div className="flex flex-col sm:flex-col gap-2 mb-3 lg:col-span-1">
                <div className="border border-gray-100 rounded-lg shadow-md mb-2">
                  <div className="flex justify-between items-center gap-2 bg-gray-200 px-4 py-4 rounded-t">
                    <h2
                      className=" text-black text-xl font-bold "
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      Personal Information
                    </h2>
                    <BiSolidBadgeCheck className="text-gray-500" size={22} />
                  </div>
                  <div className="px-4 pb-4 bg-white rounded-md grid grid-cols-1 gap-4 mt-4">
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-gray-400">Age</p>
                      <p>
                        {profileData?.birth_date
                          ? (() => {
                              const dob = new Date(profileData.birth_date);
                              const today = new Date();
                              let age = today.getFullYear() - dob.getFullYear();
                              const m = today.getMonth() - dob.getMonth();
                              if (
                                m < 0 ||
                                (m === 0 && today.getDate() < dob.getDate())
                              ) {
                                age--;
                              }
                              return `${age} years`;
                            })()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-gray-400">Marital Status</p>
                      <p>
                        {findMaritalStatusName(
                          profileData?.marital_status_id ??
                            profileData?.marital_status ??
                            0
                        ) || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-gray-400">Gender</p>
                      <p>
                        {findGenderName(
                          profileData?.gender_id ?? profileData?.gender ?? 0
                        ) || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-gray-400">Religion</p>
                      <p>
                        {findReligionName(
                          profileData?.religion_id ?? profileData?.religion ?? 0
                        ) || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-gray-400">Weight</p>
                      <p>
                        {formatWeight(
                          profileData?.weight,
                          profileData?.weight_units
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-gray-400">Height</p>
                      <p>
                        {profileData?.height_cms
                          ? `${profileData.height_cms} cm`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {(profileData?.phone_emergency ||
                  profileData?.phone_home ||
                  profileData?.whatsapp_number) && (
                  <div className="border border-gray-100 rounded-lg shadow-md mb-2">
                    <div className="flex justify-between items-center gap-2 bg-gray-200 px-4 py-4 rounded-t">
                      <h2
                        className="text-black text-xl font-bold "
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Contact Information
                      </h2>
                      <BiSolidBadgeCheck className="text-gray-500" size={22} />
                    </div>
                    <div className="px-4 pb-4 bg-white rounded-md gap-4 mt-4 space-y-4">
                      <div className="flex justify-between items-center gap-8">
                        <p className="text-gray-400">Emergency Contact</p>
                        <p className="font-medium">
                          {profileData?.phone_emergency
                            ? profileData.phone_emergency
                            : "N/A"}
                        </p>
                      </div>
                      <div className="flex justify-between items-center gap-8">
                        <p className="text-gray-400">Home Phone</p>
                        <p className="font-medium">
                          {profileData?.phone_home || "N/A"}
                        </p>
                      </div>
                      <div className="flex justify-between items-center gap-8">
                        <p className="text-gray-400">WhatsApp</p>
                        <p className="font-medium">
                          {profileData?.whatsapp_number || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(profileData?.facebook ||
                  profileData?.instagram ||
                  profileData?.linkedin) && (
                  <div className="border border-gray-100 rounded-lg shadow-md ">
                    <div className="flex items-center gap-2 bg-gray-200 px-4 py-4 rounded-t">
                      <h2
                        className=" text-black text-xl font-bold"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Social Information
                      </h2>
                      <BiSolidBadgeCheck className="text-sky-500" size={18} />
                    </div>

                    <div className="px-4 py-8 bg-white rounded-md gap-4 space-y-4">
                      {/* Social Media Links */}
                      <div className="flex items-center gap-8">
                        {profileData?.facebook && (
                          <a
                            href={profileData.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-4xl"
                          >
                            <FaFacebook />
                          </a>
                        )}

                        {profileData?.instagram && (
                          <a
                            href={profileData.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-500 hover:text-pink-700 text-4xl"
                          >
                            <FaInstagram />
                          </a>
                        )}

                        {profileData?.linkedin && (
                          <a
                            href={profileData.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-900 text-4xl"
                          >
                            <FaLinkedin />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-2  lg:col-span-3">
                {allImages && allImages.length > 0 && (
                  <div className="mb-3">
                    <Card data={allImages} />
                  </div>
                )}

                {addressList?.length > 0 && (
                  <div className="border border-gray-100 rounded-lg shadow-md mb-1 h-auto">
                    <div className="flex justify-between items-center gap-2 bg-gray-200 px-4 py-4 rounded-t">
                      <h2
                        className="text-black text-xl font-bold"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Address
                      </h2>
                      {/* <BiSolidBadgeCheck className="text-slate-500" size={24} /> */}
                    </div>
                    <div className="px-4 pb-4 bg-white rounded-b-lg overflow-x-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 pb-3">
                        {addressList.map((addr: any, index: number) => {
                          const title = `Address ${index + 1}${
                            addr.type ? ` (${addr.type})` : ""
                          }`;

                          return (
                            <div
                              key={index}
                              className="bg-white dark:bg-zinc-900 border rounded-xl shadow-sm"
                            >
                              <div className="px-6 py-4">
                                {/* Title */}
                                <div className="flex justify-between items-center gap-2 mb-2">
                                  <h3
                                    className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                                    style={{ fontFamily: "BR Cobane" }}
                                  >
                                    {title}
                                  </h3>
                                  <BiSolidBadgeCheck className="w-5 h-5 text-blue-500" />
                                </div>

                                {/* Content */}
                                <p className="text-zinc-600 dark:text-zinc-300">
                                  {addr.address_line1}, {addr.year || "2024"}
                                  <br />
                                  {addr.address_line2 || "Near by Max"}
                                  <br />
                                  {addr?.city},{" "}
                                  {findCountryName(
                                    addr?.country_id ?? addr?.country_name
                                  )}
                                  , {addr?.zip}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {educationList.length > 0 && (
                  <div className="border border-gray-100 rounded-lg shadow-md mb-1">
                    <div className="flex justify-between items-center gap-2 bg-gray-200 px-4 py-4 rounded-t">
                      <h2
                        className="text-black text-xl font-bold "
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Educational Information
                      </h2>
                      {/* <BiSolidBadgeCheck className="text-gray-500" size={22} /> */}
                    </div>
                    <div className="px-4 pb-4 bg-white rounded-b-lg overflow-x-auto">
                      <table className="min-w-full text-sm sm:text-base mt-2">
                        <thead className="">
                          <tr className="text-left">
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Institute Name
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Year Completed
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Field of Study
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              City & Country
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Verified
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {educationList
                            .filter((edu: any) => edu?.isverified)
                            .map((edu: any, index: number) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors text-sm"
                              >
                                <td className="px-2 py-3 border-b">
                                  {edu?.institution_name || "N/A"}
                                </td>
                                <td className="px-4 py-3 border-b">
                                  {edu?.year_completed || "N/A"}
                                </td>
                                <td className="px-4 py-3 border-b">
                                  {findFieldOfStudy(
                                    edu?.field_of_study_id ??
                                      edu?.field_of_study ??
                                      0
                                  ) || "N/A"}
                                </td>
                                <td className="px-4 py-3 border-b">
                                  {edu?.city || "N/A"},{" "}
                                  {findCountryName(
                                    edu?.country_id ?? edu?.country_name ?? 0
                                  ) || "N/A"}
                                </td>
                                <td className="px-4 py-3 border-b">
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-500 text-white dark:bg-blue-600"
                                  >
                                    <BadgeCheckIcon size={14} />
                                    Verified
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {employmentList.length > 0 && (
                  <div className="border border-gray-100 rounded-lg shadow-md  mb-2">
                    <div className="flex justify-between items-center gap-2 bg-gray-200 px-4 py-4 rounded-t">
                      <h2
                        className="text-black text-xl font-bold"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Professional Information
                      </h2>
                      {/* <BiSolidBadgeCheck className="text-gray-500" size={22} /> */}
                    </div>
                    <div className="px-4 pb-4 bg-white rounded-b-lg overflow-x-auto">
                      <table className="min-w-full text-sm sm:text-base mt-2">
                        <thead>
                          <tr className="text-left">
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Company Name
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Job Title
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              From - To
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              State & Country
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Verified
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {employmentList.map((emp: any, index: number) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors text-sm"
                            >
                              <td className="px-2 py-3 border-b">
                                {emp?.institution_name}
                              </td>
                              <td className="px-4 py-3 border-b">
                                {findJobTitleName(
                                  emp?.job_title_id ?? emp?.job_title_name ?? 0
                                ) || "N/A"}
                              </td>
                              <td className="px-4 py-3 border-b">
                                {emp?.start_year} - {emp?.end_year || "Present"}
                              </td>
                              <td className="px-4 py-3 border-b">
                                {emp?.city || "N/A"},{" "}
                                {findCountryName(
                                  emp?.country_id ?? emp?.country_name ?? 0
                                ) || "N/A"}
                              </td>
                              <td className="px-4 py-3 border-b">
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-500 text-white dark:bg-blue-600"
                                >
                                  <BadgeCheckIcon size={14} />
                                  Verified
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div
                  className={`grid grid-cols-1 ${
                    familyList.length > 0 && referencesList.length > 0
                      ? "lg:grid-cols-2"
                      : "lg:grid-cols-1"
                  } items-center gap-2 h-full`}
                >
                  {familyList.length > 0 && (
                    <div className="border border-gray-100 rounded-lg shadow-md mb-3 h-full">
                      <div className="flex justify-between items-center gap-2 bg-gray-200 px-4 py-4 rounded-t">
                        <h2
                          className="text-black text-xl font-bold"
                          style={{ fontFamily: "BR Cobane" }}
                        >
                          Family Information
                        </h2>
                        {/* <BiSolidBadgeCheck
                          className="text-gray-500"
                          size={22}
                        /> */}
                      </div>
                      <div className="px-4 pb-4 bg-white rounded-md grid grid-cols-1 gap-4 mt-4">
                        <table className="w-full text-sm sm:text-base">
                          <thead className="">
                            <tr className="text-left">
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Full Name
                              </th>
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Relation
                              </th>
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Verified
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {familyList.map((member: any, index: number) => (
                              <tr
                                key={
                                  member.profile_family_reference_id ?? index
                                }
                                className="hover:bg-gray-50 transition-colors text-sm"
                              >
                                <td className="px-2 py-3 border-b">
                                  {member?.first_name} {member?.last_name}
                                </td>
                                <td className="px-4 py-3 border-b">
                                  {member?.type_name}
                                </td>
                                <td className="px-4 py-3 border-b">
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-500 text-white dark:bg-blue-600"
                                  >
                                    <BadgeCheckIcon size={14} />
                                    Verified
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {referencesList.length > 0 && (
                    <div className="border border-gray-100 rounded-lg shadow-md mb-3 h-full">
                      <div className="flex justify-between items-center gap-2 bg-gray-200 px-4 py-4 rounded-t">
                        <h2
                          className="text-black text-xl font-bold"
                          style={{ fontFamily: "BR Cobane" }}
                        >
                          Friends & Reference
                        </h2>
                        {/* <BiSolidBadgeCheck
                          className="text-gray-500"
                          size={22}
                        /> */}
                      </div>
                      <div className="px-4 pb-4 bg-white rounded-md grid grid-cols-1 gap-4 mt-4">
                        <table className="w-full text-sm sm:text-base">
                          <thead className="">
                            <tr className="text-left">
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Full Name
                              </th>
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Relation
                              </th>
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Verifed
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {referencesList.map((ref: any, index: number) => (
                              <tr
                                key={ref.profile_reference_id ?? index}
                                className="hover:bg-gray-50 transition-colors text-sm"
                              >
                                <td className="px-2 py-3 border-b">
                                  {ref?.first_name} {ref?.last_name}
                                </td>
                                <td className="px-4 py-3 border-b">
                                  {ref?.type_name}
                                </td>
                                <td className="px-4 py-3 border-b">
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-500 text-white dark:bg-blue-600"
                                  >
                                    <BadgeCheckIcon size={14} />
                                    Verified
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-2 h-full">
                  {categoryMapping.some((c: any) => c?.habitAnswer) && (
                    <div className="border border-gray-100 rounded-lg shadow-md mb-3 h-full">
                      <h2
                        className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Lifestyle
                      </h2>
                      <div className="px-4 pb-4 bg-white rounded-md grid grid-cols-1 gap-4 mt-4">
                        <table className="w-full text-sm sm:text-base">
                          <thead>
                            <tr className="text-left">
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Questions
                              </th>
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Answer
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {categoryMapping
                              .filter((category: any) => category?.habitAnswer)
                              .map((category: any, index: any) => (
                                <tr
                                  key={index}
                                  className="hover:bg-gray-50 transition-colors text-sm"
                                >
                                  <td className="px-2 py-3 border-b">
                                    {category?.habitQuestion}
                                  </td>
                                  <td className="px-4 py-3 border-b">
                                    {category?.habitAnswer}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {[
                    ...((hobbies as any)?.hobby_interests || []),
                    ...((interests as any)?.hobby_interests || []),
                  ].length > 0 && (
                    <div className="border border-gray-100 rounded-lg shadow-md mb-3 h-full">
                      <h2
                        className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Hobbies & Interests
                      </h2>
                      <div className="px-4 pb-4 bg-white rounded-md grid grid-cols-1 gap-4 mt-4">
                        <table className="w-full text-sm sm:text-base">
                          <thead>
                            <tr className="text-left">
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Name
                              </th>
                              <th className="px-2 py-2 border-b text-base font-bold">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ...((hobbies as any)?.hobby_interests || []),
                              ...((interests as any)?.hobby_interests || []),
                            ]?.length ? (
                              [
                                ...((hobbies as any)?.hobby_interests || []),
                                ...((interests as any)?.hobby_interests || []),
                              ].map((item: any, index: number) => (
                                <tr
                                  key={item.hobby_interest_id ?? index}
                                  className="hover:bg-gray-50 transition-colors text-sm"
                                >
                                  <td className="px-4 py-2 border-b">
                                    {item.hobby_interest_name}
                                  </td>
                                  <td className="px-4 py-2 border-b">
                                    {item.hobby_interest_description || "-"}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="px-4 py-3 text-center text-gray-500 border-b"
                                >
                                  No hobbies or interests available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* <div className="grid grid-cols-1 lg:grid-cols-1 items-center gap-2 h-full">
                  <div className="border border-gray-100 rounded-lg shadow-md h-full ">
                    <h2
                      className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      Partner Preferences
                    </h2>
                    <div className="px-4 pb-4 bg-white rounded-md grid grid-cols-1 gap-4 mt-4">
                      <table className="w-full text-sm sm:text-base">
                        <thead className="">
                          <tr className="text-left">
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Age Range
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Religion
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Location
                            </th>
                            <th className="px-2 py-2 border-b text-base font-bold">
                              Professional
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50 transition-colors text-sm">
                            <td className="px-2 py-3 border-b">28-35</td>
                            <td className="px-4 py-3 border-b">Hindu</td>
                            <td className="px-4 py-3 border-b">Hyderabad</td>
                            <td className="px-4 py-3 border-b">Softwear</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-lg shadow-md  h-full">
                    <h2
                      className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      Profile Summary
                    </h2>
                    <div className="px-4 pb-4 bg-white rounded-md grid grid-cols-1 gap-4 mt-4">
                      <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Nobis ex unde eius doloribus ducimus, magni fugit
                        ipsa reprehenderit tenetur, labore maiores voluptatibus
                        dolore. Id quisquam possimus eos dignissimos? Corrupti,
                        nisi?
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProfile;
