"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import femaleProfile from "@/public/images/dashboard/profile1.png";
import maleProfile from "@/public/images/dashboard/profile3.png";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { profile } from "console";
import coverPhoto from "@/public/images/couple1.jpg";
import {
  MdOutlineDeleteOutline,
  MdOutlineModeEditOutline,
  MdOutlinePreview,
} from "react-icons/md";
import { Eye, MoreHorizontal } from "lucide-react";
import { FaHome, FaRegEdit } from "react-icons/fa";
import { IoIosAdd, IoIosPhonePortrait } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { CgMoreVertical } from "react-icons/cg";
import { BiSolidBadgeCheck } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CiMail } from "react-icons/ci";
import { AddAddressModal } from "../../createprofile/primarycontact/_components/address-modals/AddAddressModal";
import { EditAddressModal } from "../../createprofile/primarycontact/_components/address-modals/EditAddressModal";


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

  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
  });

  const closeAddModal = () => {
    setOpenModal((prev) => ({
      ...prev,
      add: false,
    }));
  };

  // Hoisted helpers for photos (avoid hooks inside conditional renders)
  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const photoTypeAssociation = useMemo(
    () => ({
      profile: 450,
      cover: 454,
      individual: 456,
    }),
    []
  );

  const toAbsoluteUrl = useCallback(
    (u?: string | null) => {
      if (!u || typeof u !== "string") return null;
      if (u.startsWith("http")) return u;
      if (apiOrigin) return `${apiOrigin}${u.startsWith("/") ? "" : "/"}${u}`;
      return u.startsWith("/") ? u : `/${u}`;
    },
    [apiOrigin]
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
    value: string;
    colspan?: number | null;
  }) => {
    return (
      <div className={colspan ? `col-span-${colspan}` : ""}>
        <p className="text- text-slate-500">{title}</p>
        <p className="text-black font-semibold mt-1 text-xl">{value}</p>
      </div>
    );
  };

  // Accordion component for array items
  const AccordionItem = ({
    title,
    children,
    sectionKey,
    defaultExpanded = false,
  }: {
    title: string;
    children: React.ReactNode;
    sectionKey: string;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections[sectionKey] ?? defaultExpanded;

    return (
      <div className="border border-gray-200 rounded-lg mb-3">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-4 py-3 text-left bg-orange-50 hover:bg-orange-100 rounded-t-lg flex justify-between items-center transition-colors"
        >
          <span className="font-medium text-gray-800">{title}</span>
          <svg
            className={`w-5 h-5 text-gray-600 transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isExpanded && (
          <div className="p-4 border-t border-gray-200">{children}</div>
        )}
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
      dispatch(getFamilyAsync({ profile_id: profileId, type: "references" }));
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
  // useEffect(() => {
  //   console.log('Redux State Debug:');
  //   console.log('personalProfile:', personalProfile);
  //   console.log('address:', address);
  //   console.log('education:', education);
  //   console.log('employment:', employment);
  //   console.log('family:', family);
  //   console.log('properties:', properties);
  //   console.log('hobbies:', hobbies);
  //   console.log('interests:', interests);
  //   console.log('references:', references);
  // }, [personalProfile, address, education, employment, family, properties, hobbies, interests, references]);

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

  const tabs = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "Address", label: "Address", icon: "📍" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "employment", label: "Employment", icon: "💼" },
    { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },

    { id: "references", label: "Friends & References", icon: "🧘" },
    { id: "photos", label: "Photos", icon: "📸" },
    { id: "lifestyle", label: "Lifestyle", icon: "🌟" },
    { id: "hobbies", label: "Hobbies", icon: "🎯" },
    { id: "properties", label: "Properties", icon: "🏘️" },
  ];

  const renderPhotos = () => {
    return (
      <ProfileSection title="Photos" buttonName="Add Photo">
        {/* Photos (by type) */}
        <div className="w-full">
          <div className="flex flex-wrap gap-6">
            {/* Profile (450) */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Profile</p>
              <div className="relative w-[200px] h-[200px] border rounded-lg bg-gray-50 overflow-hidden">
                {profileImage ? (
                  <Image
                    src={profileImage.url}
                    alt="Profile photo"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No photo
                  </div>
                )}
              </div>
            </div>

            {/* Cover (454) */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Cover</p>
              <div className="relative w-[300px] h-[150px] border rounded-lg bg-gray-50 overflow-hidden">
                {coverImage ? (
                  <Image
                    src={coverImage.url}
                    alt="Cover photo"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No photo
                  </div>
                )}
              </div>
            </div>

            {/* Additional (456) */}
            <div className="flex-1 min-w-full">
              <p className="text-sm font-medium mb-2">Additional</p>
              <div className="flex flex-wrap gap-3">
                {individualImages && individualImages.length > 0 ? (
                  individualImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-[150px] h-[150px] border rounded-lg bg-gray-50 overflow-hidden"
                    >
                      <Image
                        src={img.url}
                        alt={`Additional ${idx + 1}`}
                        fill
                        sizes="150px"
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500">No photos</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ProfileSection>
    );
  };

  const renderPersonalInfo = () => {
    const profileData = personalProfile?.data || personalProfile;

    return (
      // <ProfileSection title="Personal Information">
      //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      //     {profileData ? (
      //       // Object.entries(profileData)
      //       //   .filter(([key, value]) => value !== null && value !== undefined && value !== '')
      //       //   .map(([key, value]) => (
      //       //     <ProfileDetail key={key} title={key.replace(/_/g, ' ')} value={String(value)} />
      //       //   ))
      //       <>
      //         <ProfileDetail
      //           title="First Name"
      //           value={profileData?.first_name}
      //         />
      //         <ProfileDetail title="Last Name" value={profileData?.last_name} />
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
      //       </>
      //     ) : (
      //       <p className="text-gray-500 col-span-2">
      //         No personal information available
      //       </p>
      //     )}
      //   </div>
      // </ProfileSection>
      <div className="overflow-hidden">
        <div className="flex flex-row justify-between items-center gap-6 px-6 py-4">
          <h2
            className=" text-black text-xl font-bold"
            style={{ fontFamily: "BR Cobane" }}
          >
            Personal Information
          </h2>
          {/* Edit Button */}
          <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-shrink-0">
            <FaRegEdit size={15} />
            Edit
          </button>
        </div>

        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          <ProfileDetail title="First Name" value={profileData?.first_name} />
          <ProfileDetail title="Last Name" value={profileData?.last_name} />
          <ProfileDetail title="Email" value={personalProfile?.data?.email} />
          <ProfileDetail title="Phone" value={personalProfile?.data?.phone} />
          <ProfileDetail title="Gender" value={profileData?.gender} />
          <ProfileDetail title="DOB" value={profileData?.dob} />
          <ProfileDetail title="Religion" value={profileData?.religion} />
          <ProfileDetail
            title="Mother Tounge"
            value={profileData?.mother_tounge}
          />
          <ProfileDetail
            title="Marital Status"
            value={profileData?.marital_status}
          />
          <ProfileDetail title="Height" value={profileData?.height} />
          <ProfileDetail title="Weight" value={profileData?.weight} />
        </div>
      </div>
    );
  };

  const renderAddresses = () => {
    const addressList = address?.data?.addresses || (address ? [address] : []);

    return (
      <ProfileSection
        title="Address"
        buttonName="Add Address"
        onButtonClick={() =>
          setOpenModal((prev) => ({
            ...prev,
            add: true,
          }))
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
          <div className="w-full mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
            <div className="px-6 py-4">
              {/* Author section */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FaHome size={20} />
                      <h3
                        className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Home Address
                      </h3>
                    </div>
                    <BiSolidBadgeCheck className="w-5 h-5 text-green-500" />
                  </div>
                </div>

                {/* Right Icons (Badge + Dropdown) */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                      >
                        <CgMoreVertical className="w-5 h-5 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => {
                          setOpenModal((prev) => ({
                            ...prev,
                            edit: true,
                          }));
                        }}
                      >
                        <MdOutlineModeEditOutline />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineDeleteOutline />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content section */}
              <p className="text-zinc-600 dark:text-zinc-300">
                Kompally main road, <br />
                Near by Max <br />
                Hyderabad, India, 500100
              </p>
            </div>
          </div>
        </div>
        {/* <div className="space-y-4">
          {addressList.length > 0 ? (
            addressList.map((addr: any, index: number) => {
              const title = `Address ${index + 1}${
                addr.type ? ` (${addr.type})` : ""
              }`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`address-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail
                      title="Type"
                      value={addr?.type || addr?.address_type}
                    />
                    <ProfileDetail title="Street" value={addr?.street} />
                    <ProfileDetail title="City" value={addr?.city} />
                    <ProfileDetail title="State" value={addr?.state} />
                    <ProfileDetail title="Country" value={addr?.country} />
                    <ProfileDetail title="Pincode" value={addr?.pincode} />
                    <ProfileDetail
                      title="Is Current"
                      value={addr?.is_current ? "Yes" : "No"}
                    />
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No address information available</p>
          )}
        </div> */}
      </ProfileSection>
    );
  };

  const renderEducation = () => {
    const educationList =
      education?.data?.educations || (education ? [education] : []);

    return (
      <ProfileSection title="Education" buttonName="Add Education">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
          <div className="w-full mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
            <div className="px-6 py-4">
              {/* Author section */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-4">
                    <h3
                      className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      Computer Science
                    </h3>
                    <BiSolidBadgeCheck className="w-5 h-5 text-blue-500" />
                  </div>
                </div>

                {/* Right Icons (Badge + Dropdown) */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                      >
                        <CgMoreVertical className="w-5 h-5 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineModeEditOutline />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineDeleteOutline />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content section */}
              <p className="text-zinc-600 dark:text-zinc-300">
                Hyderbad University, 2024 <br />
                Near by Max <br />
                Hyderabad, India, 500100
              </p>
            </div>
          </div>
        </div>
        {/* <div className="space-y-4">
          {educationList.length > 0 ? (
            educationList.map((edu: any, index: number) => {
              const title = edu?.degree || `Education ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`education-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail
                      title="Institution"
                      value={edu?.institution}
                    />
                    <ProfileDetail
                      title="Field of Study"
                      value={edu?.field_of_study}
                    />
                    <ProfileDetail title="Degree" value={edu?.degree} />
                    <ProfileDetail
                      title="Year of Completion"
                      value={edu?.year_of_completion}
                    />
                    <ProfileDetail
                      title="Grade/Percentage"
                      value={edu?.grade}
                    />
                    <ProfileDetail
                      title="Is Current"
                      value={edu?.is_current ? "Yes" : "No"}
                    />
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No education information available</p>
          )}
        </div> */}
      </ProfileSection>
    );
  };

  const renderCareer = () => {
    // Handle both array and object responses from the API
    let employmentList = [];

    if (Array.isArray(employment?.data)) {
      employmentList = employment.data;
    } else if (employment?.data?.employments) {
      employmentList = employment.data.employments;
    } else if (employment) {
      employmentList = [employment];
    }

    return (
      <ProfileSection title="Employment" buttonName="Add Employment">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
          <div className="w-full mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
            <div className="px-6 py-4">
              {/* Author section */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Left: Company & Role */}
                  <div className="flex items-center gap-2">
                    <div>
                      <h3
                        className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Spack Solution Pvt Ltd
                      </h3>
                      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                        Frontend Developer
                      </p>
                    </div>
                    {/* Verified Badge */}
                    <BiSolidBadgeCheck className="w-5 h-5 text-orange-500" />
                  </div>
                </div>

                {/* Right Icons (Badge + Dropdown) */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                      >
                        <CgMoreVertical className="w-5 h-5 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineModeEditOutline />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineDeleteOutline />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content section */}
              <p className="text-zinc-600 dark:text-zinc-300">
                2022 - Present <br />
                Hyderbad University, 2024 <br />
                Near by Max <br />
                Hyderabad, India, 500100
              </p>
            </div>
          </div>
        </div>
        {/* <div className="space-y-4">
          {employmentList.length > 0 ? (
            employmentList.map((emp: any, index: number) => {
              const title =
                emp?.job_title || emp?.company || `Employment ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`employment-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail title="Company" value={emp?.company} />
                    <ProfileDetail title="Job Title" value={emp?.job_title} />
                    <ProfileDetail title="Job Type" value={emp?.job_type} />
                    <ProfileDetail
                      title="Annual Income"
                      value={emp?.annual_income}
                    />
                    <ProfileDetail title="Industry" value={emp?.industry} />
                    <ProfileDetail title="Start Date" value={emp?.start_date} />
                    <ProfileDetail
                      title="End Date"
                      value={
                        emp?.end_date ||
                        (emp?.is_current ? "Present" : "Not specified")
                      }
                    />
                    <ProfileDetail
                      title="Is Current"
                      value={emp?.is_current ? "Yes" : "No"}
                    />
                    {emp?.description && (
                      <div className="md:col-span-3">
                        <ProfileDetail
                          title="Description"
                          value={emp.description}
                        />
                      </div>
                    )}
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No employment information available</p>
          )}
        </div> */}
      </ProfileSection>
    );
  };

  const renderFamily = () => {
    const familyList =
      (family as any)?.data?.family || (family ? [family] : []);

    return (
      <ProfileSection title="Family Information" buttonName="Add Family">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
          <div className="w-full max-w-xs mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
            <div className="px-6 py-4">
              {/* Author section */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Left: Company & Role */}
                  <div className="flex items-center gap-2">
                    <div>
                      <h3
                        className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Yakub Moodu{" "}
                        <span className="text-xs">(21-01-1996)</span>
                      </h3>
                      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                        Brother
                      </p>
                    </div>
                    {/* Verified Badge */}
                    {/* <BiSolidBadgeCheck className="w-5 h-5 text-orange-500" /> */}
                  </div>
                </div>

                {/* Right Icons (Badge + Dropdown) */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                      >
                        <CgMoreVertical className="w-5 h-5 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineModeEditOutline />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineDeleteOutline />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content section */}
              <a href="#" className="flex items-center gap-1">
                <IoIosPhonePortrait /> 9692152142
              </a>
              <a href="" className="flex items-center gap-1">
                <CiMail /> badalnayak@gmail.com
              </a>
              <p className="text-zinc-600 dark:text-zinc-300">
                Hyderbad University, 2024 <br />
                Near by Max <br />
                Hyderabad, India, 500100
              </p>
            </div>
          </div>
        </div>
        {/* <div className="space-y-4">
          {familyList.length > 0 ? (
            familyList.map((member: any, index: number) => {
              const title = member?.name || `Family Member ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`family-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail title="Relation" value={member?.relation} />
                    <ProfileDetail title="Age" value={member?.age} />
                    <ProfileDetail
                      title="Occupation"
                      value={member?.occupation}
                    />
                    <ProfileDetail
                      title="Marital Status"
                      value={member?.marital_status}
                    />
                    <ProfileDetail
                      title="Contact"
                      value={member?.contact_number}
                    />
                    <ProfileDetail
                      title="Is Dependent"
                      value={member?.is_dependent ? "Yes" : "No"}
                    />
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No family information available</p>
          )}
        </div> */}
      </ProfileSection>
    );
  };

  const renderLifestyle = () => {
    // Mapping category labels to state keys
    const categoryMapping = {
      "What best describes your eating habits?": "eatingHabit",
      "Do you follow any specific diet plan?": "dietHabit",
      "How many cigarettes do you smoke per day on average?":
        "cigarettesPerDay",
      "How frequently do you drink?": "drinkFrequency",
      "What type of gambling do you engage in?": "gamblingEngage",
      "How would you describe your physical activity level?":
        "physicalActivityLevel",
      "Do you practice any relaxation techniques?": "relaxationMethods",
    };

    return (
      <ProfileSection title="Lifestyle">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
          {Object.keys(categoryMapping).map((category, index) => (
            <div
              key={index}
              className="w-full mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm"
            >
              <div className="px-6 py-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-base font-bold text-zinc-900 dark:text-zinc-100"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      {category}
                    </h3>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                          <CgMoreVertical className="w-5 h-5 text-zinc-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <MdOutlineModeEditOutline />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <MdOutlineDeleteOutline />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Content (replace with actual values later) */}
                <p className="text-zinc-600 dark:text-zinc-300">hello</p>
              </div>
            </div>
          ))}
        </div>
      </ProfileSection>
    );
  };

  const renderProperties = () => {
    console.log("properties", properties);
    const propertiesData = Array.isArray(properties)
      ? properties
      : (properties as any)?.properties || [];

    return (
      <ProfileSection title="Properties" buttonName="Add Properties">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
          <div className="w-full mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
            <div className="px-6 py-4">
              {/* Author section */}
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  {/* Left: Company & Role */}
                  <div className="flex items-center gap-2">
                    <div>
                      <h3
                        className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Apartment <span className="text-xs">(1450 sq.ft )</span>
                      </h3>
                      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                        Community Property
                      </p>
                    </div>
                    {/* Verified Badge */}
                    {/* <BiSolidBadgeCheck className="w-5 h-5 text-orange-500" /> */}
                  </div>
                </div>

                {/* Right Icons (Badge + Dropdown) */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                      >
                        <CgMoreVertical className="w-5 h-5 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineModeEditOutline />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineDeleteOutline />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content section */}
              <p className="text-zinc-600 dark:text-zinc-300">
                Kompally main road, <br />
                Near by Max <br />
                Hyderabad, India, 500100
              </p>
            </div>
          </div>
        </div>

        {/* <div className="space-y-4">
          {propertiesData.length > 0 ? (
            propertiesData.map((property: any, index: number) => {
              const title =
                property.type ||
                findPropertyTypeName(property.property_type) ||
                `Property ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`property-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail
                      title="Type"
                      value={findPropertyTypeName(property.property_type)}
                    />
                    <ProfileDetail
                      title="Ownership"
                      value={findOwnershipTypeName(property.ownership_type)}
                    />
                    <ProfileDetail
                      title="Location"
                      value={property.property_address}
                    />
                    <ProfileDetail
                      title="Value"
                      value={property.property_value}
                    />
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No property information available</p>
          )}
        </div> */}
      </ProfileSection>
    );
  };

  const renderReferences = () => {
    const referencesList =
      (references as any)?.data?.family || (references ? [references] : []);

    return (
      <ProfileSection title="References" buttonName="Add Reference">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
          <div className="w-full max-w-xs mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
            <div className="px-6 py-4">
              {/* Author section */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Left: Company & Role */}
                  <div className="flex items-center gap-2">
                    <div>
                      <h3
                        className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Yakub Moodu{" "}
                        <span className="text-xs">(21-01-1996)</span>
                      </h3>
                      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                        Brother
                      </p>
                    </div>
                    {/* Verified Badge */}
                    {/* <BiSolidBadgeCheck className="w-5 h-5 text-orange-500" /> */}
                  </div>
                </div>

                {/* Right Icons (Badge + Dropdown) */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                      >
                        <CgMoreVertical className="w-5 h-5 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineModeEditOutline />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineDeleteOutline />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content section */}
              <a href="#" className="flex items-center gap-1">
                <IoIosPhonePortrait /> 9692152142
              </a>
              <a href="" className="flex items-center gap-1">
                <CiMail /> badalnayak@gmail.com
              </a>
              <p className="text-zinc-600 dark:text-zinc-300">
                Hyderbad University, 2024 <br />
                Near by Max <br />
                Hyderabad, India, 500100
              </p>
            </div>
          </div>
        </div>
        {/* <div className="space-y-4">
          {referencesList.length > 0 ? (
            referencesList.map((ref: any, index: number) => (
              <AccordionItem
                key={index}
                title={ref?.name || `Reference ${index + 1}`}
                sectionKey={`reference-${index}`}
                defaultExpanded={index === 0}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileDetail title="Relation" value={ref?.relation} />
                  <ProfileDetail
                    title="Contact Number"
                    value={ref?.contact_number}
                  />
                  <ProfileDetail title="Email" value={ref?.email} />
                  <ProfileDetail
                    title="Address"
                    value={ref?.address}
                    colspan={3}
                  />
                  <ProfileDetail title="Known Since" value={ref?.known_since} />
                  <ProfileDetail title="Occupation" value={ref?.occupation} />
                </div>
              </AccordionItem>
            ))
          ) : (
            <p className="text-gray-500">No references available</p>
          )}
        </div> */}
      </ProfileSection>
    );
  };

  const renderHobbies = () => {
    const referencesList =
      (references as any)?.data?.family || (references ? [references] : []);

    return (
      <ProfileSection title="Hobbies" buttonName="Add Hobbie">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 pb-5">
          <div className="w-full max-w-xs mx-auto bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
            <div className="px-6 py-4">
              {/* Author section */}
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  {/* Left: Company & Role */}
                  <div className="flex items-center gap-2">
                    <div>
                      <h3
                        className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                        style={{ fontFamily: "BR Cobane" }}
                      >
                        Photography
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Right Icons (Badge + Dropdown) */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                      >
                        <CgMoreVertical className="w-5 h-5 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineModeEditOutline />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MdOutlineDeleteOutline />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content section */}
              <p className="text-zinc-600 dark:text-zinc-300">
                Wild Photography
              </p>
            </div>
          </div>
        </div>
      </ProfileSection>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return renderPersonalInfo();
      case "Address":
        return renderAddresses();
      case "education":
        return renderEducation();
      case "employment":
        return renderCareer();
      case "family":
        return renderFamily();
      case "lifestyle":
        return renderLifestyle();
      case "hobbies":
        return renderHobbies();
      case "properties":
        return renderProperties();
      case "references":
        return renderReferences();
      case "photos":
        return renderPhotos();
      default:
        return renderPersonalInfo();
    }
  };

  const profileData = personalProfile?.data || personalProfile;

  return (
    <>
      <div className="dashboard-background min-h-screen md:px-[120px] md:pt-8 mt-16">
        {/* Profile Header */}
        <div>
          <div className="w-full rounded-lg overflow-hidden shadow-md">
            {/* Banner with gradient background */}
            <div className="relative h-32 sm:h-40 lg:h-56 w-full">
              {coverPhoto ? (
                <Image
                  src={coverPhoto}
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
              <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {/* Profile Image - positioned to overlap banner */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 -mt-10 sm:-mt-12 lg:-mt-14 border-4 border-white rounded-lg overflow-hidden bg-gray-300 shadow-lg flex-shrink-0">
                    {profileImage?.url ? (
                      <img
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
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="text-black">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
                      {profileData?.first_name ||
                        profileData?.name ||
                        "Unknown"}{" "}
                      {profileData?.last_name || ""}
                    </h1>
                  </div>
                </div>

                {/* View my profile */}
                <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-shrink-0">
                  <Eye size={20} />
                  Preview Profile
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto sm:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mb-3">{renderTabContent()}</div>
          </div>
        </div>
      </div>
      <AddAddressModal open={openModal.add} onOpenChange={closeAddModal} />
      <EditAddressModal
        open={openModal.edit}
        onOpenChange={(value: boolean) =>
          setOpenModal((prev) => ({
            ...prev,
            edit: value,
          }))
        }
      />
    </>
  );
};

export default ViewProfile;
