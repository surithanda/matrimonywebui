"use client";

import Image from "next/image";
import Link from "next/link";
import profile1 from "@/public/images/dashboard/profile1.png";
import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  getCompleteProfileAsync,
  getPersonalProfileAsync,
  getProfilePhotosAsync,
} from "@/app/store/features/profileSlice";
import { useFetchUser } from "@/app/utils/useFetchUser";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { IProfile } from "@/app/models/Profile";
import { API_ORIGIN, toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";
import { normalizePhotoUrl } from "@/app/utils/photoUrl.util";
import { FaPlus } from "react-icons/fa6";
import { FaqSection } from "@/components/blocks/faq";
import { Button } from "@/components/ui/button";
import {
  User,
  Eye,
  Heart,
  Users,
  Search,
  Star,
  ThumbsUp,
  Link2,
} from "lucide-react";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/lottie/Loading.json";
import { FaRegEdit } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import Loader from "./Loader";
import Router from "next/router";
import { useRouter } from "next/navigation";

const ProfileSection = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.userData);
  const router = useRouter();
  // const personalProfile = useAppSelector(
  //   (state) => state.profile.personalProfile
  // );
  const profilePhotos = useAppSelector((state) => state.profile.photos);
  const completeProfile = useAppSelector(
    (state) => state.profile.completeProfile
  );

  const { loading } = useAppSelector((state) => state.profile);
  const { fetchAccountDetls } = useFetchUser();
  const { selectedProfileID } = useProfileContext();

  // API origin and image URL utility
  const toAbsoluteUrl = useCallback((u?: string | null) => {
    return normalizePhotoUrl(u); // Use the new photo URL utility
  }, []);

  // Profile Data for dynamic rendering
  const [profilesData, setProfilesData] = useState<any>([]);

  useEffect(() => {
    if (selectedProfileID && selectedProfileID > 0) {
      (dispatch as any)(getCompleteProfileAsync(selectedProfileID)).unwrap();
    } else {
    }
  }, [selectedProfileID, dispatch]);

  useEffect(() => {
    if (completeProfile && selectedProfileID) {
      const calculateAge = (birthDate: string) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
          age--;
        }
        return age;
      };

      const getProfileImage = () => {
        if (completeProfile) {

          console.log(completeProfile?.profile_photo_url)
          return normalizePhotoUrl(completeProfile?.profile_photo_url)
        }
        return profile1;
      };

      const profile = completeProfile?.data || completeProfile;
      const transformedData = {
        name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
        age: calculateAge(profile.birth_date),
        location: profile?.current_city,
        imageSrc: getProfileImage(),
      };

      setProfilesData([transformedData]);
    }
  }, [completeProfile, selectedProfileID, toAbsoluteUrl]);

  console.log("complete profile data", completeProfile);

  useEffect(() => {
    if (userData && (userData?.token || userData?.email)) fetchAccountDetls();
    // loadMetaData();
  }, [userData, fetchAccountDetls]);

  const faqData = [
    {
      question: "How do I create a new profile?",
      answer:
        "To create a new profile, click on ‘Add Profile’ and complete the basic details form. Upload at least two recent photos, then fill in the sections for education, career, family background, and partner preferences.",
    },
    {
      question: "What privacy settings are available?",
      answer:
        "You can control who sees your profile through Privacy Settings. Available options include Everyone, Premium Members Only, Connected Matches Only, or Hidden. You can also block specific profiles if needed.",
    },
    {
      question: "How do I search for matches?",
      answer:
        "To search for matches, use the Search tab with filters such as age, location, education, profession, and more. You can save your searches for quick access. Premium members also get access to advanced filters, including horoscope matching.",
    },
    {
      question: "What does the 'Interest Sent' status mean?",
      answer:
        "When you send an interest, the status appears as Pending until the other person responds. Accepted means they’re interested too, while Declined means they’ve passed.",
    },
    {
      question: "How do I verify my profile?",
      answer:
        "To verify your profile, submit a government-issued ID through the Verification Center. Accepted documents include a passport, driver’s license, or national ID. Once verified, a badge will appear on your profile within 24–48 hours.",
    },
    {
      question: "What’s included in premium membership?",
      answer:
        "Premium Membership offers unlimited messaging, contact viewing, advanced search filters, profile highlighting, and priority customer support. You’ll also get access to detailed horoscopes and family background information.",
    },
    {
      question: "Can I edit my profile after creation?",
      answer:
        "Yes. Click “Edit Profile” to update any section. You can add or remove photos at any time. Major changes, such as marital status, may require verification.",
    },
    {
      question: "How do I report fake profiles?",
      answer:
        "To report a fake profile, click the “Report” button on any profile and select the reason. Our team reviews reports within 24 hours. Including screenshots can help us take faster action.",
    },
  ];

  const StatCard = (props: any) => {
    return (
      <div
        style={{ backgroundColor: props.bg1 }}
        className="rounded-xl overflow-hidden flex flex-col justify-between"
      >
        <div className="flex gap-2 items-center justify-center py-4">
          <div className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow mt-2">
            {props.icon}
          </div>
          <p className="text-center mt-2 text-3xl font-bold">{props.number}</p>
        </div>
        <p
          className="py-2 px-3 text-base font-semibold h-[50%] flex items-center justify-center text-center"
          style={{ backgroundColor: props.bg2 }}
        >
          {props.name}
        </p>
      </div>
    );
  };
  const goTo = (path: string) => {
    if (!path) return;
    Router.push("/updateprofile");
  };

  const stats = [
    {
      number: completeProfile?.profile_id ? 1 : 0,
      name: "My Profiles",
      bg1: "#E4F1FF",
      bg2: "#D6E9FF",
      icon: <User className="w-6 h-6 text-blue-600" />,
    },
    {
      number: completeProfile?.profiles_viewed_by_me ?? 0,
      name: "Profiles Viewed",
      bg1: "#FFF0D0",
      bg2: "#FFE8B7",
      icon: <Eye className="w-6 h-6 text-yellow-600" />,
    },
    {
      number: completeProfile?.profile_favorites ?? 0,
      name: "Favourites",
      bg1: "#FFECE9",
      bg2: "#FCDEDA",
      icon: <Heart className="w-6 h-6 text-red-500" />,
    },
    {
      number: completeProfile?.profiles_viewed_me ?? 0,
      name: "Viewed My Profile(s)",
      bg1: "#DAFBF2",
      bg2: "#AFFEE8",
      icon: <Users className="w-6 h-6 text-teal-600" />,
    },
    {
      number: completeProfile?.profiles_searched ?? 0,
      name: "Top Searches",
      bg1: "#FFEDF0",
      bg2: "#FFE0E5",
      icon: <Search className="w-6 h-6 text-pink-500" />,
    },
    {
      number: completeProfile?.shortlisted ?? 0,
      name: "Shortlisted",
      bg1: "#DEF3C5",
      bg2: "#CEEFA7",
      icon: <Star className="w-6 h-6 text-green-600" />,
    },
    {
      number: completeProfile?.interested ?? 0,
      name: "Interested",
      bg1: "#EBE9F8",
      bg2: "#E4DFF7",
      icon: <ThumbsUp className="w-6 h-6 text-purple-600" />,
    },
    {
      number: completeProfile?.connected ?? 0,
      name: "Connected",
      bg1: "#FFECE9",
      bg2: "#FCDEDA",
      icon: <Link2 className="w-6 h-6 text-orange-600" />,
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col w-full mt-20 gap-6 md:gap-8">
      {/* Profiles Section */}

      {loading ? (
        // 🔹 Show loader while API fetching
        <div className="flex justify-center items-center col-span-4 h-80">
          <Lottie
            animationData={loaderAnimation}
            loop={true}
            className="w-40 h-40"
          />
        </div>
      ) : (
        <>
          <div className="dashboard-sections w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Section */}
            <div
              className={`flex flex-col ${
                profilesData?.length > 0 ? "lg:col-span-3" : "lg:col-span-4"
              }`}
            >
              {/* Header with Button */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="dmserif32600">Profiles</h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-2">
                    Browse detailed member profiles to easily discover your
                    perfect match.
                  </p>
                </div>
                {!(selectedProfileID && selectedProfileID < 0) && (
                  <Link href="/createprofile">
                    <Button
                      className="px-6 py-3 text-white font-semibold rounded-lg
             bg-gradient-to-r from-[#f7ac03] to-[#e69a00] 
             hover:from-[#e69a00] hover:to-[#cc7a00] 
             w-full sm:w-auto flex items-center justify-center gap-2 
             shadow-md hover:shadow-lg transition-all duration-300 text-lg"
                    >
                      <FaPlus className="text-lg" />
                      Add Profile
                    </Button>
                  </Link>
                )}
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {stats.map((stat, idx) => (
                  <StatCard
                    key={idx}
                    number={String(stat.number).padStart(2, "0")}
                    name={stat.name}
                    bg1={stat.bg1}
                    bg2={stat.bg2}
                    icon={stat.icon}
                  />
                ))}
              </div>
            </div>

            {/* Right Section: Profile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4 sm:gap-6 lg:col-span-1">
              {profilesData?.length > 0 &&
                profilesData.map((profile: IProfile, index: number) => (
                  <React.Fragment key={selectedProfileID ?? index}>
                    <Link href="/updateprofile">
                      <div
                        className="relative w-full h-96 rounded-lg overflow-hidden cursor-pointer group"
                        title="Edit Profile Details"
                      >
                        <Image
                          src={profile.imageSrc || profile1}
                          alt={profile.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                          className="object-cover transition-all duration-500 ease-in-out hover:scale-110"
                        />

                        {/* Hover Edit Button (Top Right) */}
                        <Button
                          onClick={() => goTo}
                          variant={"default"}
                          size={"sm"}
                          className="absolute top-3 py-1  right-3 bg-orange-500 text-white text-sm font-semibold rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-orange-600"
                        >
                          <CiEdit size={22} />
                        </Button>

                        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center text-center">
                          <p className="text-white font-semibold text-lg sm:text-xl">
                            {profile.name}
                          </p>
                          <p className="text-gray-200 text-sm sm:text-base">
                            {profile.age} Years old
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link href={`/profiles/${selectedProfileID}`}>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 w-full"
                      >
                        <Eye size={20} />
                        Preview My Profile
                      </Button>
                    </Link>
                  </React.Fragment>
                ))}
            </div>
          </div>
          {/* FAQ Section */}
          <div className="dashboard-sections w-full p-4 sm:p-6 lg:p-8">
            <h2 className="dmserif32600 mb-4 sm:mb-6 text-center text-xl sm:text-2xl lg:text-3xl">
              Frequently Asked Questions
            </h2>
            <div className="max-w-7xl mx-auto">
              <FaqSection items={faqData} />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProfileSection;
