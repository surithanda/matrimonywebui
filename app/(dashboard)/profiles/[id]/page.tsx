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
} from "@/app/store/features/profileSlice";
import { toAbsoluteUrl as envToAbsoluteUrl } from "@/app/lib/env";

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
  } = useSelector((state: RootState) => state.profile);

  interface ImageFile {
    url: string;
    file?: File | null;
  }

  const [activeTab, setActiveTab] = useState("personal");
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
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
    return envToAbsoluteUrl(u);
  }, []);

  const photoTypeAssociation = useMemo(
    () => ({
      profile: 450,
      cover: 454,
      individual: 456,
    }),
    []
  );

  // Derive display images from redux photos once, not during render
  useEffect(() => {
    const photoData = (photos as any)?.data || photos;
    if (!Array.isArray(photoData)) return;

    const resolved = photoData
      .map((p: any) => ({
        ...p,
        _rawUrl: p?.url || p?.photo_url || p?.file_url,
      }))
      .map((p: any) => ({ ...p, _src: toAbsoluteUrl(p?._rawUrl) }))
      .filter((p: any) => !!p._src);

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
    console.log(accountProfileID);
    loadFavorites();
  }, [dispatch, accountProfileID, profileId]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

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

  const ProfileSection = ({
    title,
    children,
    buttonName,
    onButtonClick,
  }: {
    title: string;
    children: React.ReactNode;
    buttonName?: string;
    onButtonClick?: () => void;
  }) => {
    return (
      <div className="overflow-hidden">
        <div className="flex flex-row justify-between items-center gap-6 px-6 py-4">
          <h2
            className="text-black text-2xl font-bold"
            style={{ fontFamily: "BR Cobane" }}
          >
            {title}
          </h2>

          {/* Button (only render if buttonName is passed) */}
          {buttonName && (
            <button
              onClick={onButtonClick}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-shrink-0"
            >
              <FaPlus />
              {buttonName}
            </button>
          )}
        </div>

        <div className="px-6">{children}</div>
      </div>
    );
  };

  const ProfileDetail = ({
    title,
    value,
    colspan = null,
  }: {
    title: string;
    value?: string | null;
    colspan?: number | null;
  }) => {
    if (!value) return null;

    return (
      <div className={colspan ? `col-span-${colspan}` : ""}>
        <p className="text-slate-500">{title}</p>
        <p className="text-black font-semibold mt-1 text-xl">{value}</p>
      </div>
    );
  };

  useEffect(() => {
    console.log("Profile ID:", profileId);
    console.log("From search:", fromSearch);
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
    }
  }, [dispatch, profileId]);

  // Debug: Log the Redux state data
  useEffect(() => {
    console.log('Redux State Debug:');
    console.log('personalProfile:', personalProfile);
    console.log('address:', address);
  console.log("education:", education);
  console.log("employment:", employment);
  console.log("family:", family);
    console.log('properties:', properties);
  console.log("hobbies:", hobbies);
  console.log("interests:", interests);
  console.log("references:", references);
  }, [personalProfile, address, education, employment, family, properties, hobbies, interests, references]);

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

  // const renderPhotos = () => {
  //   return (
  //     <ProfileSection title="Photos" buttonName="Add Photo">
  //       {/* Photos (by type) */}
  //       <div className="w-full">
  //         <div className="flex flex-wrap gap-6">
  //           {/* Profile (450) */}
  //           <div className="flex flex-col gap-2">
  //             <p className="text-sm font-medium">Profile</p>
  //             <div className="relative w-[200px] h-[200px] border rounded-lg bg-gray-50 overflow-hidden">
  //               {profileImage ? (
  //                 <Image
  //                   src={profileImage.url}
  //                   alt="Profile photo"
  //                   fill
  //                   sizes="200px"
  //                   className="object-cover"
  //                 />
  //               ) : (
  //                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
  //                   No photo
  //                 </div>
  //               )}
  //             </div>
  //           </div>

  //           {/* Cover (454) */}
  //           <div className="flex flex-col gap-2">
  //             <p className="text-sm font-medium">Cover</p>
  //             <div className="relative w-[300px] h-[150px] border rounded-lg bg-gray-50 overflow-hidden">
  //               {coverImage ? (
  //                 <Image
  //                   src={coverImage.url}
  //                   alt="Cover photo"
  //                   fill
  //                   sizes="300px"
  //                   className="object-cover"
  //                 />
  //               ) : (
  //                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
  //                   No photo
  //                 </div>
  //               )}
  //             </div>
  //           </div>

  //           {/* Additional (456) */}
  //           <div className="flex-1 min-w-full">
  //             <p className="text-sm font-medium mb-2">Additional</p>
  //             <div className="flex flex-wrap gap-3">
  //               {individualImages && individualImages.length > 0 ? (
  //                 individualImages.map((img, idx) => (
  //                   <div
  //                     key={idx}
  //                     className="relative w-[150px] h-[150px] border rounded-lg bg-gray-50 overflow-hidden"
  //                   >
  //                     <Image
  //                       src={img.url}
  //                       alt={`Additional ${idx + 1}`}
  //                       fill
  //                       sizes="150px"
  //                       className="object-cover"
  //                     />
  //                   </div>
  //                 ))
  //               ) : (
  //                 <div className="text-xs text-gray-500">No photos</div>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </ProfileSection>
  //   );
  // };

  // const renderPersonalInfo = () => {
  //   const profileData = personalProfile?.data || personalProfile;

  //   return (
  //     // <ProfileSection title="Personal Information">
  //     //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //     //     {profileData ? (
  //     //       // Object.entries(profileData)
  //     //       //   .filter(([key, value]) => value !== null && value !== undefined && value !== '')
  //     //       //   .map(([key, value]) => (
  //     //       //     <ProfileDetail key={key} title={key.replace(/_/g, ' ')} value={String(value)} />
  //     //       //   ))
  //     //       <>
  //     //         <ProfileDetail
  //     //           title="First Name"
  //     //           value={profileData?.first_name}
  //     //         />
  //     //         <ProfileDetail title="Last Name" value={profileData?.last_name} />
  //     //         <ProfileDetail title="Gender" value={profileData?.gender} />
  //     //         <ProfileDetail title="DOB" value={profileData?.dob} />
  //     //         <ProfileDetail title="Religion" value={profileData?.religion} />
  //     //         <ProfileDetail
  //     //           title="Mother Tounge"
  //     //           value={profileData?.mother_tounge}
  //     //         />
  //     //         <ProfileDetail
  //     //           title="Marital Status"
  //     //           value={profileData?.marital_status}
  //     //         />
  //     //         <ProfileDetail title="Height" value={profileData?.height} />
  //     //         <ProfileDetail title="Weight" value={profileData?.weight} />
  //     //       </>
  //     //     ) : (
  //     //       <p className="text-gray-500 col-span-2">
  //     //         No personal information available
  //     //       </p>
  //     //     )}
  //     //   </div>
  //     // </ProfileSection>
  //     <div className="overflow-hidden">
  //       <div className="flex flex-row justify-between items-center gap-6 px-6 py-6">
  //         <h2
  //           className=" text-black text-xl font-bold"
  //           style={{ fontFamily: "BR Cobane" }}
  //         >
  //           Personal Information
  //         </h2>
  //         {/* Edit Button */}
  //         <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-shrink-0">
  //           <FaRegEdit size={15} />
  //           Edit
  //         </button>
  //       </div>

  //       <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-8">
  //         <ProfileDetail title="First Name" value={profileData?.first_name} />
  //         <ProfileDetail title="Last Name" value={profileData?.last_name} />
  //         <ProfileDetail
  //           title="Email"
  //           value={personalProfile?.data?.email_id}
  //         />
  //         <ProfileDetail title="Phone" value={personalProfile?.data?.phone} />
  //         <ProfileDetail title="Gender" value={profileData?.gender} />
  //         <ProfileDetail title="DOB" value={profileData?.dob} />
  //         <ProfileDetail title="Religion" value={profileData?.religion} />
  //         <ProfileDetail
  //           title="Mother Tounge"
  //           value={profileData?.mother_tounge}
  //         />
  //         <ProfileDetail
  //           title="Marital Status"
  //           value={profileData?.marital_status}
  //         />
  //         <ProfileDetail title="Height" value={profileData?.height} />
  //         <ProfileDetail title="Weight" value={profileData?.weight} />
  //       </div>
  //     </div>
  //   );
  // };

  // const renderAddresses = () => {
  //   const addressList = address?.data?.addresses || (address ? [address] : []);

  //   return (
  //     <ProfileSection
  //       title="Address"
  //       buttonName="Add Address"
  //       onButtonClick={() => {}}
  //     >
  //       <div className="space-y-4">
  //         {addressList.length > 0 ? (
  //           addressList.map((addr: any, index: number) => {
  //             const title = `Address ${index + 1}${
  //               addr.type ? ` (${addr.type})` : ""
  //             }`;
  //             return (
  //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //                 <ProfileDetail
  //                   title="Type"
  //                   value={addr?.type || addr?.address_type}
  //                   key={index}
  //                 />
  //                 <ProfileDetail title="Street" value={addr?.street} />
  //                 <ProfileDetail title="City" value={addr?.city} />
  //                 <ProfileDetail title="State" value={addr?.state} />
  //                 <ProfileDetail title="Country" value={addr?.country} />
  //                 <ProfileDetail title="Pincode" value={addr?.pincode} />
  //                 <ProfileDetail
  //                   title="Is Current"
  //                   value={addr?.is_current ? "Yes" : "No"}
  //                 />
  //               </div>
  //             );
  //           })
  //         ) : (
  //           <p className="text-gray-500">No address information available</p>
  //         )}
  //       </div>
  //     </ProfileSection>
  //   );
  // };

  // const renderEducation = () => {
  //   const educationList =
  //     education?.data?.educations || (education ? [education] : []);

  //   return (
  //     <ProfileSection title="Education" buttonName="Add Education">
  //       <div className="space-y-4">
  //         {educationList.length > 0 ? (
  //           educationList.map((edu: any, index: number) => {
  //             const title = edu?.degree || `Education ${index + 1}`;
  //             return (
  //               <></>
  //               // <AccordionItem
  //               //   key={index}
  //               //   title={title}
  //               //   sectionKey={`education-${index}`}
  //               //   defaultExpanded={index === 0}
  //               // >
  //               //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //               //     <ProfileDetail
  //               //       title="Institution"
  //               //       value={edu?.institution}
  //               //     />
  //               //     <ProfileDetail
  //               //       title="Field of Study"
  //               //       value={edu?.field_of_study}
  //               //     />
  //               //     <ProfileDetail title="Degree" value={edu?.degree} />
  //               //     <ProfileDetail
  //               //       title="Year of Completion"
  //               //       value={edu?.year_of_completion}
  //               //     />
  //               //     <ProfileDetail
  //               //       title="Grade/Percentage"
  //               //       value={edu?.grade}
  //               //     />
  //               //     <ProfileDetail
  //               //       title="Is Current"
  //               //       value={edu?.is_current ? "Yes" : "No"}
  //               //     />
  //               //   </div>
  //               // </AccordionItem>
  //             );
  //           })
  //         ) : (
  //           <p className="text-gray-500">No education information available</p>
  //         )}
  //       </div>
  //     </ProfileSection>
  //   );
  // };

  // const renderCareer = () => {
  //   // Handle both array and object responses from the API
  //   let employmentList = [];

  //   if (Array.isArray(employment?.data)) {
  //     employmentList = employment.data;
  //   } else if (employment?.data?.employments) {
  //     employmentList = employment.data.employments;
  //   } else if (employment) {
  //     employmentList = [employment];
  //   }

  //   return (
  //     <ProfileSection title="Employment" buttonName="Add Employment">
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
  //         <div className="w-full mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
  //           <div className="px-6 py-4">
  //             {/* Author section */}
  //             <div className="flex items-center justify-between mb-2">
  //               <div className="flex items-center gap-3">
  //                 {/* Left: Company & Role */}
  //                 <div className="flex items-center gap-2">
  //                   <div>
  //                     <h3
  //                       className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
  //                       style={{ fontFamily: "BR Cobane" }}
  //                     >
  //                       Spack Solution Pvt Ltd
  //                     </h3>
  //                     <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
  //                       Frontend Developer
  //                     </p>
  //                   </div>
  //                   {/* Verified Badge */}
  //                   <BiSolidBadgeCheck className="w-5 h-5 text-orange-500" />
  //                 </div>
  //               </div>

  //               {/* Right Icons (Badge + Dropdown) */}
  //               <div className="flex items-center gap-2">
  //                 <DropdownMenu>
  //                   <DropdownMenuTrigger asChild>
  //                     <button
  //                       type="button"
  //                       className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
  //                     >
  //                       <CgMoreVertical className="w-5 h-5 text-zinc-400" />
  //                     </button>
  //                   </DropdownMenuTrigger>
  //                   <DropdownMenuContent align="end" className="w-40">
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineModeEditOutline />
  //                       Edit
  //                     </DropdownMenuItem>
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineDeleteOutline />
  //                       Delete
  //                     </DropdownMenuItem>
  //                   </DropdownMenuContent>
  //                 </DropdownMenu>
  //               </div>
  //             </div>

  //             {/* Content section */}
  //             <p className="text-zinc-600 dark:text-zinc-300">
  //               2022 - Present <br />
  //               Hyderbad University, 2024 <br />
  //               Near by Max <br />
  //               Hyderabad, India, 500100
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //       {/* <div className="space-y-4">
  //         {employmentList.length > 0 ? (
  //           employmentList.map((emp: any, index: number) => {
  //             const title =
  //               emp?.job_title || emp?.company || `Employment ${index + 1}`;
  //             return (
  //               <AccordionItem
  //                 key={index}
  //                 title={title}
  //                 sectionKey={`employment-${index}`}
  //                 defaultExpanded={index === 0}
  //               >
  //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //                   <ProfileDetail title="Company" value={emp?.company} />
  //                   <ProfileDetail title="Job Title" value={emp?.job_title} />
  //                   <ProfileDetail title="Job Type" value={emp?.job_type} />
  //                   <ProfileDetail
  //                     title="Annual Income"
  //                     value={emp?.annual_income}
  //                   />
  //                   <ProfileDetail title="Industry" value={emp?.industry} />
  //                   <ProfileDetail title="Start Date" value={emp?.start_date} />
  //                   <ProfileDetail
  //                     title="End Date"
  //                     value={
  //                       emp?.end_date ||
  //                       (emp?.is_current ? "Present" : "Not specified")
  //                     }
  //                   />
  //                   <ProfileDetail
  //                     title="Is Current"
  //                     value={emp?.is_current ? "Yes" : "No"}
  //                   />
  //                   {emp?.description && (
  //                     <div className="md:col-span-3">
  //                       <ProfileDetail
  //                         title="Description"
  //                         value={emp.description}
  //                       />
  //                     </div>
  //                   )}
  //                 </div>
  //               </AccordionItem>
  //             );
  //           })
  //         ) : (
  //           <p className="text-gray-500">No employment information available</p>
  //         )}
  //       </div> */}
  //     </ProfileSection>
  //   );
  // };

  // const renderFamily = () => {
  //   const familyList =
  //     (family as any)?.data?.family || (family ? [family] : []);

  //   return (
  //     <ProfileSection title="Family Information" buttonName="Add Family">
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
  //         <div className="w-full max-w-xs mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
  //           <div className="px-6 py-4">
  //             {/* Author section */}
  //             <div className="flex items-center justify-between mb-2">
  //               <div className="flex items-center gap-3">
  //                 {/* Left: Company & Role */}
  //                 <div className="flex items-center gap-2">
  //                   <div>
  //                     <h3
  //                       className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
  //                       style={{ fontFamily: "BR Cobane" }}
  //                     >
  //                       Yakub Moodu{" "}
  //                       <span className="text-xs">(21-01-1996)</span>
  //                     </h3>
  //                     <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
  //                       Brother
  //                     </p>
  //                   </div>
  //                   {/* Verified Badge */}
  //                   {/* <BiSolidBadgeCheck className="w-5 h-5 text-orange-500" /> */}
  //                 </div>
  //               </div>

  //               {/* Right Icons (Badge + Dropdown) */}
  //               <div className="flex items-center gap-2">
  //                 <DropdownMenu>
  //                   <DropdownMenuTrigger asChild>
  //                     <button
  //                       type="button"
  //                       className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
  //                     >
  //                       <CgMoreVertical className="w-5 h-5 text-zinc-400" />
  //                     </button>
  //                   </DropdownMenuTrigger>
  //                   <DropdownMenuContent align="end" className="w-40">
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineModeEditOutline />
  //                       Edit
  //                     </DropdownMenuItem>
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineDeleteOutline />
  //                       Delete
  //                     </DropdownMenuItem>
  //                   </DropdownMenuContent>
  //                 </DropdownMenu>
  //               </div>
  //             </div>

  //             {/* Content section */}
  //             <a href="#" className="flex items-center gap-1">
  //               <IoIosPhonePortrait /> 9692152142
  //             </a>
  //             <a href="" className="flex items-center gap-1">
  //               <CiMail /> badalnayak@gmail.com
  //             </a>
  //             <p className="text-zinc-600 dark:text-zinc-300">
  //               Hyderbad University, 2024 <br />
  //               Near by Max <br />
  //               Hyderabad, India, 500100
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //       {/* <div className="space-y-4">
  //         {familyList.length > 0 ? (
  //           familyList.map((member: any, index: number) => {
  //             const title = member?.name || `Family Member ${index + 1}`;
  //             return (
  //               <AccordionItem
  //                 key={index}
  //                 title={title}
  //                 sectionKey={`family-${index}`}
  //                 defaultExpanded={index === 0}
  //               >
  //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //                   <ProfileDetail title="Relation" value={member?.relation} />
  //                   <ProfileDetail title="Age" value={member?.age} />
  //                   <ProfileDetail
  //                     title="Occupation"
  //                     value={member?.occupation}
  //                   />
  //                   <ProfileDetail
  //                     title="Marital Status"
  //                     value={member?.marital_status}
  //                   />
  //                   <ProfileDetail
  //                     title="Contact"
  //                     value={member?.contact_number}
  //                   />
  //                   <ProfileDetail
  //                     title="Is Dependent"
  //                     value={member?.is_dependent ? "Yes" : "No"}
  //                   />
  //                 </div>
  //               </AccordionItem>
  //             );
  //           })
  //         ) : (
  //           <p className="text-gray-500">No family information available</p>
  //         )}
  //       </div> */}
  //     </ProfileSection>
  //   );
  // };

  // const renderLifestyle = () => {
  //   // Mapping category labels to state keys
  //   const categoryMapping = {
  //     "What best describes your eating habits?": "eatingHabit",
  //     "Do you follow any specific diet plan?": "dietHabit",
  //     "How many cigarettes do you smoke per day on average?":
  //       "cigarettesPerDay",
  //     "How frequently do you drink?": "drinkFrequency",
  //     "What type of gambling do you engage in?": "gamblingEngage",
  //     "How would you describe your physical activity level?":
  //       "physicalActivityLevel",
  //     "Do you practice any relaxation techniques?": "relaxationMethods",
  //   };

  //   return (
  //     <ProfileSection title="Lifestyle">
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
  //         {Object.keys(categoryMapping).map((category, index) => (
  //           <div
  //             key={index}
  //             className="w-full mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm"
  //           >
  //             <div className="px-6 py-4">
  //               {/* Header */}
  //               <div className="flex items-center justify-between">
  //                 <div className="flex items-center gap-2">
  //                   <h3
  //                     className="text-base font-bold text-zinc-900 dark:text-zinc-100"
  //                     style={{ fontFamily: "BR Cobane" }}
  //                   >
  //                     {category}
  //                   </h3>
  //                 </div>

  //                 {/* Dropdown Menu */}
  //                 <div className="flex items-center gap-2">
  //                   <DropdownMenu>
  //                     <DropdownMenuTrigger asChild>
  //                       <button
  //                         type="button"
  //                         className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
  //                       >
  //                         <CgMoreVertical className="w-5 h-5 text-zinc-400" />
  //                       </button>
  //                     </DropdownMenuTrigger>
  //                     <DropdownMenuContent align="end" className="w-40">
  //                       <DropdownMenuItem className="flex items-center gap-2">
  //                         <MdOutlineModeEditOutline />
  //                         Edit
  //                       </DropdownMenuItem>
  //                       <DropdownMenuItem className="flex items-center gap-2">
  //                         <MdOutlineDeleteOutline />
  //                         Delete
  //                       </DropdownMenuItem>
  //                     </DropdownMenuContent>
  //                   </DropdownMenu>
  //                 </div>
  //               </div>

  //               {/* Content (replace with actual values later) */}
  //               <p className="text-zinc-600 dark:text-zinc-300">hello</p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </ProfileSection>
  //   );
  // };

  // const renderProperties = () => {
  //   console.log("properties", properties);
  //   const propertiesData = Array.isArray(properties)
  //     ? properties
  //     : (properties as any)?.properties || [];

  //   return (
  //     <ProfileSection title="Properties" buttonName="Add Properties">
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
  //         <div className="w-full mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
  //           <div className="px-6 py-4">
  //             {/* Author section */}
  //             <div className="flex items-center justify-between ">
  //               <div className="flex items-center gap-3">
  //                 {/* Left: Company & Role */}
  //                 <div className="flex items-center gap-2">
  //                   <div>
  //                     <h3
  //                       className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
  //                       style={{ fontFamily: "BR Cobane" }}
  //                     >
  //                       Apartment <span className="text-xs">(1450 sq.ft )</span>
  //                     </h3>
  //                     <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
  //                       Community Property
  //                     </p>
  //                   </div>
  //                   {/* Verified Badge */}
  //                   {/* <BiSolidBadgeCheck className="w-5 h-5 text-orange-500" /> */}
  //                 </div>
  //               </div>

  //               {/* Right Icons (Badge + Dropdown) */}
  //               <div className="flex items-center gap-2">
  //                 <DropdownMenu>
  //                   <DropdownMenuTrigger asChild>
  //                     <button
  //                       type="button"
  //                       className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
  //                     >
  //                       <CgMoreVertical className="w-5 h-5 text-zinc-400" />
  //                     </button>
  //                   </DropdownMenuTrigger>
  //                   <DropdownMenuContent align="end" className="w-40">
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineModeEditOutline />
  //                       Edit
  //                     </DropdownMenuItem>
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineDeleteOutline />
  //                       Delete
  //                     </DropdownMenuItem>
  //                   </DropdownMenuContent>
  //                 </DropdownMenu>
  //               </div>
  //             </div>

  //             {/* Content section */}
  //             <p className="text-zinc-600 dark:text-zinc-300">
  //               Kompally main road, <br />
  //               Near by Max <br />
  //               Hyderabad, India, 500100
  //             </p>
  //           </div>
  //         </div>
  //       </div>

  //       {/* <div className="space-y-4">
  //         {propertiesData.length > 0 ? (
  //           propertiesData.map((property: any, index: number) => {
  //             const title =
  //               property.type ||
  //               findPropertyTypeName(property.property_type) ||
  //               `Property ${index + 1}`;
  //             return (
  //               <AccordionItem
  //                 key={index}
  //                 title={title}
  //                 sectionKey={`property-${index}`}
  //                 defaultExpanded={index === 0}
  //               >
  //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //                   <ProfileDetail
  //                     title="Type"
  //                     value={findPropertyTypeName(property.property_type)}
  //                   />
  //                   <ProfileDetail
  //                     title="Ownership"
  //                     value={findOwnershipTypeName(property.ownership_type)}
  //                   />
  //                   <ProfileDetail
  //                     title="Location"
  //                     value={property.property_address}
  //                   />
  //                   <ProfileDetail
  //                     title="Value"
  //                     value={property.property_value}
  //                   />
  //                 </div>
  //               </AccordionItem>
  //             );
  //           })
  //         ) : (
  //           <p className="text-gray-500">No property information available</p>
  //         )}
  //       </div> */}
  //     </ProfileSection>
  //   );
  // };

  // const renderReferences = () => {
  //   const referencesList =
  //     (references as any)?.data?.family || (references ? [references] : []);

  //   return (
  //     <ProfileSection title="References" buttonName="Add Reference">
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
  //         <div className="w-full max-w-xs mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
  //           <div className="px-6 py-4">
  //             {/* Author section */}
  //             <div className="flex items-center justify-between mb-2">
  //               <div className="flex items-center gap-3">
  //                 {/* Left: Company & Role */}
  //                 <div className="flex items-center gap-2">
  //                   <div>
  //                     <h3
  //                       className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
  //                       style={{ fontFamily: "BR Cobane" }}
  //                     >
  //                       Yakub Moodu{" "}
  //                       <span className="text-xs">(21-01-1996)</span>
  //                     </h3>
  //                     <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
  //                       Brother
  //                     </p>
  //                   </div>
  //                   {/* Verified Badge */}
  //                   {/* <BiSolidBadgeCheck className="w-5 h-5 text-orange-500" /> */}
  //                 </div>
  //               </div>

  //               {/* Right Icons (Badge + Dropdown) */}
  //               <div className="flex items-center gap-2">
  //                 <DropdownMenu>
  //                   <DropdownMenuTrigger asChild>
  //                     <button
  //                       type="button"
  //                       className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
  //                     >
  //                       <CgMoreVertical className="w-5 h-5 text-zinc-400" />
  //                     </button>
  //                   </DropdownMenuTrigger>
  //                   <DropdownMenuContent align="end" className="w-40">
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineModeEditOutline />
  //                       Edit
  //                     </DropdownMenuItem>
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineDeleteOutline />
  //                       Delete
  //                     </DropdownMenuItem>
  //                   </DropdownMenuContent>
  //                 </DropdownMenu>
  //               </div>
  //             </div>

  //             {/* Content section */}
  //             <a href="#" className="flex items-center gap-1">
  //               <IoIosPhonePortrait /> 9692152142
  //             </a>
  //             <a href="" className="flex items-center gap-1">
  //               <CiMail /> badalnayak@gmail.com
  //             </a>
  //             <p className="text-zinc-600 dark:text-zinc-300">
  //               Hyderbad University, 2024 <br />
  //               Near by Max <br />
  //               Hyderabad, India, 500100
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //       {/* <div className="space-y-4">
  //         {referencesList.length > 0 ? (
  //           referencesList.map((ref: any, index: number) => (
  //             <AccordionItem
  //               key={index}
  //               title={ref?.name || `Reference ${index + 1}`}
  //               sectionKey={`reference-${index}`}
  //               defaultExpanded={index === 0}
  //             >
  //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //                 <ProfileDetail title="Relation" value={ref?.relation} />
  //                 <ProfileDetail
  //                   title="Contact Number"
  //                   value={ref?.contact_number}
  //                 />
  //                 <ProfileDetail title="Email" value={ref?.email} />
  //                 <ProfileDetail
  //                   title="Address"
  //                   value={ref?.address}
  //                   colspan={3}
  //                 />
  //                 <ProfileDetail title="Known Since" value={ref?.known_since} />
  //                 <ProfileDetail title="Occupation" value={ref?.occupation} />
  //               </div>
  //             </AccordionItem>
  //           ))
  //         ) : (
  //           <p className="text-gray-500">No references available</p>
  //         )}
  //       </div> */}
  //     </ProfileSection>
  //   );
  // };

  // const renderHobbies = () => {
  //   const referencesList =
  //     (references as any)?.data?.family || (references ? [references] : []);

  //   return (
  //     <ProfileSection title="Hobbies" buttonName="Add Hobbie">
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
  //         <div className="w-full max-w-xs mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
  //           <div className="px-6 py-4">
  //             {/* Author section */}
  //             <div className="flex items-center justify-between ">
  //               <div className="flex items-center gap-3">
  //                 {/* Left: Company & Role */}
  //                 <div className="flex items-center gap-2">
  //                   <div>
  //                     <h3
  //                       className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
  //                       style={{ fontFamily: "BR Cobane" }}
  //                     >
  //                       Photography
  //                     </h3>
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* Right Icons (Badge + Dropdown) */}
  //               <div className="flex items-center gap-2">
  //                 <DropdownMenu>
  //                   <DropdownMenuTrigger asChild>
  //                     <button
  //                       type="button"
  //                       className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
  //                     >
  //                       <CgMoreVertical className="w-5 h-5 text-zinc-400" />
  //                     </button>
  //                   </DropdownMenuTrigger>
  //                   <DropdownMenuContent align="end" className="w-40">
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineModeEditOutline />
  //                       Edit
  //                     </DropdownMenuItem>
  //                     <DropdownMenuItem className="flex items-center gap-2">
  //                       <MdOutlineDeleteOutline />
  //                       Delete
  //                     </DropdownMenuItem>
  //                   </DropdownMenuContent>
  //                 </DropdownMenu>
  //               </div>
  //             </div>

  //             {/* Content section */}
  //             <p className="text-zinc-600 dark:text-zinc-300">
  //               Wild Photography
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </ProfileSection>
  //   );
  // };

  const profileData = personalProfile?.data || personalProfile;
  const addressList = address?.data?.addresses || (address ? [address] : []);
  const educationList =
    education?.data?.educations || (education ? [education] : []);

  const categoryMapping = {
    // "What best describes your eating habits?": "eatingHabit",
    // "Do you follow any specific diet plan?": "dietHabit",
    // "How many cigarettes do you smoke per day on average?":
    //   "cigarettesPerDay",
    // "How frequently do you drink?": "drinkFrequency",
    // "What type of gambling do you engage in?": "gamblingEngage",
    // "How would you describe your physical activity level?":
    //   "physicalActivityLevel",
    // "Do you practice any relaxation techniques?": "relaxationMethods",
  };

  let employmentList = [];

  if (Array.isArray(employment?.data)) {
    employmentList = employment.data;
  } else if (employment?.data?.employments) {
    employmentList = employment.data.employments;
  } else if (employment) {
    employmentList = [employment];
  }

  // const familyList = Array.isArray((family as any)?.family)
  //   ? (family as any).family
  //   : [];

  const familyList = (family as any)?.family || [];

  const referencesList = (references as any)?.family || [];

  // console.log("reference data", references);

  const formatWeight = (weight?: number | string, pound?: string) => {
    if (!weight) return null;

    const num = Number(weight);
    return Number.isInteger(num)
      ? `${num}${pound ?? ""}`
      : `${num.toFixed(2)}${pound ?? ""}`;
  };

  const CARD_DATA = [
    {
      id: 1,
      imgUrl:
        "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices dolor ac massa maximus, blandit ullamcorper eros accumsan. Sed facilisis lacinia venenatis. Donec bibendum, eros ut porttitor consectetur, enim sapien vehicula mi, et consequat lacus turpis vel dolor. Vestibulum sagittis facilisis ipsum vitae suscipit. Proin in nisl sollicitudin, interdum erat eu, consequat odio. Sed auctor felis ac lorem molestie, a cursus elit malesuada. Etiam et varius erat. Aliquam pharetra convallis aliquet. Vestibulum eros ipsum, sodales ac imperdiet id, pellentesque sed tortor.",
    },
    {
      id: 2,
      imgUrl:
        "https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=800",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices dolor ac massa maximus, blandit ullamcorper eros accumsan. Sed facilisis lacinia venenatis. Donec bibendum, eros ut porttitor consectetur, enim sapien vehicula mi, et consequat lacus turpis vel dolor. Vestibulum sagittis facilisis ipsum vitae suscipit. Proin in nisl sollicitudin, interdum erat eu, consequat odio. Sed auctor felis ac lorem molestie, a cursus elit malesuada. Etiam et varius erat. Aliquam pharetra convallis aliquet. Vestibulum eros ipsum, sodales ac imperdiet id, pellentesque sed tortor.",
    },
    {
      id: 3,
      imgUrl:
        "https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg?auto=compress&cs=tinysrgb&w=800",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices dolor ac massa maximus, blandit ullamcorper eros accumsan. Sed facilisis lacinia venenatis. Donec bibendum, eros ut porttitor consectetur, enim sapien vehicula mi, et consequat lacus turpis vel dolor. Vestibulum sagittis facilisis ipsum vitae suscipit. Proin in nisl sollicitudin, interdum erat eu, consequat odio. Sed auctor felis ac lorem molestie, a cursus elit malesuada. Etiam et varius erat. Aliquam pharetra convallis aliquet. Vestibulum eros ipsum, sodales ac imperdiet id, pellentesque sed tortor.",
    },
    {
      id: 4,
      imgUrl:
        "https://images.pexels.com/photos/2220336/pexels-photo-2220336.jpeg?auto=compress&cs=tinysrgb&w=800",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices dolor ac massa maximus, blandit ullamcorper eros accumsan. Sed facilisis lacinia venenatis. Donec bibendum, eros ut porttitor consectetur, enim sapien vehicula mi, et consequat lacus turpis vel dolor. Vestibulum sagittis facilisis ipsum vitae suscipit. Proin in nisl sollicitudin, interdum erat eu, consequat odio. Sed auctor felis ac lorem molestie, a cursus elit malesuada. Etiam et varius erat. Aliquam pharetra convallis aliquet. Vestibulum eros ipsum, sodales ac imperdiet id, pellentesque sed tortor.",
    },
    {
      id: 5,
      imgUrl:
        "https://images.pexels.com/photos/52500/horse-herd-fog-nature-52500.jpeg?auto=compress&cs=tinysrgb&w=800",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices dolor ac massa maximus, blandit ullamcorper eros accumsan. Sed facilisis lacinia venenatis. Donec bibendum, eros ut porttitor consectetur, enim sapien vehicula mi, et consequat lacus turpis vel dolor. Vestibulum sagittis facilisis ipsum vitae suscipit. Proin in nisl sollicitudin, interdum erat eu, consequat odio. Sed auctor felis ac lorem molestie, a cursus elit malesuada. Etiam et varius erat. Aliquam pharetra convallis aliquet. Vestibulum eros ipsum, sodales ac imperdiet id, pellentesque sed tortor.",
    },
    {
      id: 6,
      imgUrl:
        "https://images.pexels.com/photos/372166/pexels-photo-372166.jpeg?auto=compress&cs=tinysrgb&w=800",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices dolor ac massa maximus, blandit ullamcorper eros accumsan. Sed facilisis lacinia venenatis. Donec bibendum, eros ut porttitor consectetur, enim sapien vehicula mi, et consequat lacus turpis vel dolor. Vestibulum sagittis facilisis ipsum vitae suscipit. Proin in nisl sollicitudin, interdum erat eu, consequat odio. Sed auctor felis ac lorem molestie, a cursus elit malesuada. Etiam et varius erat. Aliquam pharetra convallis aliquet. Vestibulum eros ipsum, sodales ac imperdiet id, pellentesque sed tortor.",
    },
  ];

  return (
    <>
      <div className="dashboard-background min-h-screen md:px-[20px] lg:px-[60px] md:pt-8 mt-16">
        {/* ✅ Breadcrumb added here */}
        <AppBreadcrumb
          items={[
            { label: "Dahsboard", href: "/dashboard" },
            { label: "Preview My Profile" },
          ]}
        />
        {/* Profile Header */}
        <div>
          <div className="w-full rounded-lg overflow-hidden shadow-md mb-4 relative">
            {/* Banner with gradient background */}
            <div className="relative h-32 sm:h-40 lg:h-56 w-full">
              {coverImage ? (
                <Image width={100} height={100}
                  src={coverImage.url}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
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
        border-4 border-white rounded-lg overflow-hidden bg-gray-300 shadow-lg flex-shrink-0"
                  >
                    {profileImage?.url ? (
                      <Image width={100} height={100}
                        src={profileImage.url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
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
                {fromSearch && (
                  <div className="flex flex-col xs:flex-row sm:flex-col md:flex-row gap-2 sm:gap-3 w-full md:w-auto justify-end">
                    <Button className="bg-orange-500 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-md hover:bg-orange-600 transition-colors whitespace-nowrap text-sm sm:text-base">
                      Send Interest
                    </Button>

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

                    <Button
                      variant={"outline"}
                      className="border border-gray-300 text-gray-700 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap text-sm sm:text-base"
                    >
                      Send Message
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-8 px-2 md:px-0">
              {/* Personal Details */}
              <div className="flex flex-col sm:flex-col gap-2 mb-3 lg:col-span-1">
                <div className="border border-gray-100 rounded-lg shadow-lg mb-4">
                  <div className="flex items-center gap-2 bg-gray-200 px-4 py-4 rounded-t">
                    <h2
                      className=" text-black text-xl font-bold "
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      Personal Information
                    </h2>
                    <BiSolidBadgeCheck className="text-blue-500" size={18} />
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

                <div className="border border-gray-100 rounded-lg shadow-lg mb-4">
                  <h2
                    className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    Contact Information
                  </h2>
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

                <div className="border border-gray-100 rounded-lg shadow-lg mb-4">
                  <h2
                    className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    Social Information
                  </h2>

                  <div className="px-4 py-8 bg-white rounded-md gap-4 space-y-4">
                    {/* Social Media Links */}
                    <div className="flex items-center gap-8">
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-4xl"
                      >
                        <FaFacebook />
                      </a>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-700 text-4xl"
                      >
                        <FaInstagram />
                      </a>

                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 text-4xl"
                      >
                        <FaLinkedin />
                      </a>

                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 hover:text-sky-700 text-4xl"
                      >
                        <FaTwitter />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 items-center gap-2 mb-3 lg:col-span-3">
                <div className="mb-3">
                  <Card data={CARD_DATA} />
                </div>

                <div className="border border-gray-100 rounded-lg shadow-md mb-4 h-auto">
                  <h2
                    className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    Address
                  </h2>
                  <div className="px-4 pb-4 bg-white rounded-b-lg overflow-x-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 pb-3">
                      {addressList?.length > 0 ? (
                        addressList.map((addr: any, index: number) => {
                          const title = `Address ${index + 1}${
                            addr.type ? ` (${addr.type})` : ""
                          }`;

                          return (
                            <div
                              key={index}
                              className="bg-white dark:bg-zinc-900 border rounded-xl shadow-sm"
                            >
                              <div className="px-6 py-4">
                                {/* Author section */}
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <h3
                                      className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                                      style={{ fontFamily: "BR Cobane" }}
                                    >
                                      {title}
                                    </h3>
                                    <BiSolidBadgeCheck className="w-5 h-5 text-blue-500" />
                                  </div>
                                </div>

                                {/* Content section */}
                                <p className="text-zinc-600 dark:text-zinc-300">
                                  {addr.address_line1}, {addr.year || "2024"}{" "}
                                  <br />
                                  {addr.address_line2 || "Near by Max"} <br />
                                  {addr.city}, {addr.country}, {addr.zipcode}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500">
                          No address information available
                        </p>
                      )}

                      {/* {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-zinc-900 border rounded-xl shadow-sm"
                      >
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3
                                className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                                style={{ fontFamily: "BR Cobane" }}
                              >
                                Address {i + 1}
                              </h3>
                              <BiSolidBadgeCheck className="w-5 h-5 text-blue-500" />
                            </div>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-300">
                            Hyderabad University, 2024 <br />
                            Near by Max <br />
                            Hyderabad, India, 500100
                          </p>
                        </div>
                      </div>
                    ))} */}
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-lg shadow-lg mb-4">
                  <h2
                    className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    Educational Information
                  </h2>

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
                        </tr>
                      </thead>
                      <tbody>
                        {educationList.length > 0 ? (
                          educationList.map((edu: any, index: number) => {
                            return (
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
                                  {/* {findStateName(
                                    edu?.state_id ?? edu?.state_name ?? 0
                                  ) || "N/A"}
                                  ,{" "} */}
                                  {findCountryName(
                                    edu?.country_id ?? edu?.country_name ?? 0
                                  ) || "N/A"}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-3 text-center text-gray-500"
                            >
                              No education information available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {employmentList.length > 0 && (
                  <div className="border border-gray-100 rounded-lg shadow-lg mb-4">
                    <h2
                      className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      Professional Information
                    </h2>
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
                                {emp?.start_year} - {emp?.end_year}
                              </td>
                              <td className="px-4 py-3 border-b">
                                {emp?.city || "N/A"},{" "}
                                {findCountryName(
                                  emp?.country_id ?? emp?.country_name ?? 0
                                ) || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-2 h-full">
                  {familyList.length > 0 && (
                    <div className="border border-gray-100 rounded-lg shadow-lg mb-4 h-full">
                      <h2
                        className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Family Information
                      </h2>
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {referencesList.length > 0 && (
                    <div className="border border-gray-100 rounded-lg shadow-lg mb-4 h-full">
                      <h2
                        className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Friends & Reference
                      </h2>
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-100 rounded-lg shadow-lg mb-4 h-full">
                    <h2
                      className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      Lifestyle
                    </h2>
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
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(categoryMapping).map(
                            (category, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors text-sm"
                              >
                                <td className="px-2 py-3 border-b">
                                  {category}
                                </td>
                                <td className="px-4 py-3 border-b"></td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-lg shadow-lg mb-4 h-full">
                    <h2
                      className="bg-gray-200 text-black text-xl font-bold px-4 py-4 rounded-t"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      Hobbies & Intrested
                    </h2>
                    <div className="px-4 pb-4 bg-white rounded-md grid grid-cols-1 gap-4 mt-4">
                      <table className="w-full text-sm sm:text-base">
                        <thead className="">
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 items-center gap-2 h-full">
                  {/* <div className="border border-gray-100 rounded-lg shadow-lg h-full mb-4">
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
                  </div> */}
                  <div className="border border-gray-100 rounded-lg shadow-lg mb-4 h-full">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProfile;
