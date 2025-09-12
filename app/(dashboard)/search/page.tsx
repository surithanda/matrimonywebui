"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { RootState, AppDispatch } from "@/app/store/store";
import {
  searchProfiles,
  setFilters,
  clearFilters,
  SearchFilters,
  getUserPreferences,
} from "@/app/store/features/searchSlice";
import {
  getMetaDataAsync,
  getCountriesAsync,
} from "@/app/store/features/metaDataSlice";
import femaleProfile from "@/public/images/dashboard/profile1.png";
import maleProfile from "@/public/images/dashboard/profile3.png";
import defaultAvatar from "@/public/images/dashboard/profile1.png"; // Using as generic avatar
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { useProfileContext } from "@/app/utils/useProfileContext";
import {
  createFavoriteAsync,
  deleteFavoriteAsync,
  getFavoritesAsync,
} from "@/app/store/features/profileSlice";
import { getProfilesByAccountIdAsync } from "@/app/store/features/profileSlice";
import { useURLFormatter } from "@/app/utils/utility";
import { MdFilterList, MdVerified } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { FaDribbble, FaLinkedin } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { Label } from "@/components/ui/label";

// Custom hook for toggle functionality
const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((prev) => !prev), [setState]);
  return {
    isOpen: state,
    onToggle: toggle,
    onOpen: () => setState(true),
    onClose: () => setState(false),
  };
};

const Page = () => {
  const { toAbsoluteUrl } = useURLFormatter();
  const dispatch = useDispatch<AppDispatch>();
  const searchState = useSelector((state: RootState) => state.search);
  const metaDataState = useSelector((state: RootState) => state.metaData);
  const { selectedProfileID } = useProfileContext();

  // Use the custom toggle hook
  const {
    isOpen: showFilters,
    onToggle: toggleFilters,
    onOpen: openFilters,
    onClose: closeFilters,
  } = useToggle();

  // Provide default values to prevent destructuring errors
  const {
    profiles = [],
    filters = {},
    loading = false,
    error = null,
  } = searchState || {};

  // console.log(profiles);

  const { loading: metadataLoading = false } = metaDataState || {};

  // Initialize with default values
  const [localFilters, setLocalFilters] = useState<SearchFilters>({
    min_age: 21,
    max_age: 50,
    profile_id: selectedProfileID, // This should come from user's profile
  });

  // Track if preferences have been loaded
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [favorites, setFavorites] = useState<any>([]);

  // Reset preferences loaded when profile changes
  useEffect(() => {
    setPreferencesLoaded(false);
    setLocalFilters({
      min_age: 21,
      max_age: 50,
      profile_id: selectedProfileID,
    });
  }, [selectedProfileID]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (selectedProfileID > 0) {
        const response = await dispatch(
          getFavoritesAsync({ profileId: selectedProfileID })
        ).unwrap();
        setFavorites(response.data.map((item: any) => item.to_profile_id));
      }
    };
    console.log(selectedProfileID);
    loadFavorites();
  }, [dispatch, selectedProfileID]);

  // Load metadata and user preferences on component mount
  useEffect(() => {
    // Prevent multiple executions and ensure we have a valid profile ID
    if (preferencesLoaded || !selectedProfileID || selectedProfileID <= 0) {
      return;
    }

    const loadInitialData = async () => {
      try {
        // Load metadata first
        // await Promise.all([
        //   dispatch(getMetaDataAsync({ category: 'religion' })),
        //   dispatch(getMetaDataAsync({ category: 'education_level' })),
        //   dispatch(getMetaDataAsync({ category: 'profession' })),
        //   dispatch(getMetaDataAsync({ category: 'gender' })),
        //   dispatch(getMetaDataAsync({ category: 'marital_status' })),
        //   dispatch(getMetaDataAsync({ category: 'caste' })),
        //   dispatch(getCountriesAsync({}))
        // ]);

        // Then load user preferences if we have a profile ID
        if (selectedProfileID) {
          try {
            const actionResult = await dispatch(
              getUserPreferences(selectedProfileID) as any
            );
            const preferences = actionResult?.payload;
            console.log(preferences, actionResult);
            // If we have preferences, update the local filters
            if (preferences) {
              const updatedFilters: SearchFilters = {
                min_age: 21,
                max_age: 50,
                profile_id: selectedProfileID,
              };

              // Update filters with preferences if they exist
              if (preferences.min_age !== undefined)
                updatedFilters.min_age = preferences.min_age;
              if (preferences.max_age !== undefined)
                updatedFilters.max_age = preferences.max_age;
              if (preferences.gender)
                updatedFilters.gender = preferences.gender;
              if (preferences.religion)
                updatedFilters.religion = preferences.religion;
              if (preferences.occupation)
                updatedFilters.occupation = preferences.occupation;
              if (preferences.marital_status)
                updatedFilters.marital_status = preferences.marital_status;
              if (preferences.country)
                updatedFilters.country = preferences.country;
              if (preferences.caste_id)
                updatedFilters.caste_id = preferences.caste_id;

              setLocalFilters(updatedFilters);

              // Only trigger search if we have non-default filter values
              const hasNonDefaultFilters =
                (preferences.min_age !== undefined &&
                  preferences.min_age !== 21) ||
                (preferences.max_age !== undefined &&
                  preferences.max_age !== 50) ||
                !!preferences.gender ||
                !!preferences.religion ||
                !!preferences.occupation ||
                !!preferences.marital_status ||
                !!preferences.country ||
                !!preferences.caste_id;

              if (hasNonDefaultFilters) {
                dispatch(setFilters(updatedFilters));
                dispatch(searchProfiles(updatedFilters));
              }
            }
          } catch (prefError) {
            console.error("Error loading preferences:", prefError);
            // Continue without preferences if there's an error
          }
        }

        setPreferencesLoaded(true);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setPreferencesLoaded(true); // Still set to true to avoid infinite loading
      }
    };

    loadInitialData();

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [dispatch, preferencesLoaded]); // Removed localFilters and preferencesLoaded from dependencies

  // Handle filter changes with type safety
  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | number | undefined
  ) => {
    // Convert empty strings to undefined to avoid sending empty values
    const sanitizedValue = value === "" ? undefined : value;

    // Create new filters object with the updated value
    const newFilters: SearchFilters = {
      ...localFilters,
      [key]: sanitizedValue,
    };

    setLocalFilters(newFilters);

    // If the filter is being cleared, also update the search
    if (sanitizedValue === undefined) {
      dispatch(setFilters(newFilters));
      dispatch(searchProfiles(newFilters));
    }
  };

  // Apply filters and search with error handling
  const handleSearch = async () => {
    try {
      // Ensure we have the latest filters
      const currentFilters = { ...localFilters };

      // Update Redux state with current filters
      dispatch(setFilters(currentFilters));

      // Execute the search
      await dispatch(searchProfiles(currentFilters));
    } catch (error) {
      console.error("Error during search:", error);
      // You might want to show an error message to the user here
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      profile_id: localFilters.profile_id, // Keep profile_id
      min_age: 21,
      max_age: 50,
    };
    setLocalFilters(clearedFilters);
    dispatch(clearFilters());
  };

  const handleToggleFavorite = async (profileId: number) => {
    setFavorites((prev: number[]) => {
      if (prev.includes(profileId)) {
        // await dispatch(deleteFavoriteAsync({
        //   profileId: selectedProfileID,
        //   favoriteProfileId: favoriteProfile?.profile_favorite_id,
        // })).unwrap();
        return prev.filter((id) => id !== profileId);
      } else {
        // const result = await dispatch(createFavoriteAsync({
        //   profileId: selectedProfileID,
        //   favoriteProfileId: profileId,
        // })).unwrap();
        return [...prev, profileId];
      }
    });
  };

  // Helper function to get profile image with fallback
  const getProfileImage = (profile: any) => {
    // Return actual image if available
    console.log("ndbhfbdajf", profile);
    if (profile?.profile_image) return toAbsoluteUrl(profile.profile_image);
    if (profile?.url) return toAbsoluteUrl(profile.url);

    // Return null for avatar fallback
    return null;
  };

  // Helper function to get initials from name
  const getInitials = (firstName: string = "", lastName: string = "") => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U"; // 'U' for Unknown if no name
  };

  // Helper function to generate a background color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Generate age options
  const ageOptions = Array.from({ length: 63 }, (_, i) => i + 21);

  return (
    <div className="dashboard-background md:px-[60px] lg:px-[60px] 2xl:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-16">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="dmserif32600">Search Profiles</h2>
        <div className="flex gap-2">
          <Button
            onClick={toggleFilters}
            className="flex gap-2 items-center "
            variant={"outline"}
          >
            <MdFilterList size={24} />
            <span>Filters</span>
          </Button>
          {showFilters && (
            <>
              <Button
                onClick={handleSearch}
                disabled={loading}
                variant={"outline"}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
              <Button onClick={handleClearFilters}>Clear All</Button>
            </>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Age Range */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Age Range
              </Label>
              <div className="flex gap-2">
                <select
                  value={localFilters.min_age || 21}
                  onChange={(e) =>
                    handleFilterChange("min_age", parseInt(e.target.value))
                  }
                  className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Min Age</option>
                  {ageOptions.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
                <select
                  value={localFilters.max_age || 85}
                  onChange={(e) =>
                    handleFilterChange("max_age", parseInt(e.target.value))
                  }
                  className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Max Age</option>
                  {ageOptions.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Religion */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Religion
              </Label>
              <MetadataSelectComponent
                hasAny={true}
                type="religion"
                bindValue={localFilters.religion || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  // console.log('Selected religion:', e.target.value ? parseInt(e.target.value) : undefined);
                  handleFilterChange(
                    "religion",
                    e.target.value ? parseInt(e.target.value) : undefined
                  );
                }}
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Education
              </Label>
              <MetadataSelectComponent
                hasAny={true}
                type="education_level"
                bindValue={localFilters.max_education || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleFilterChange(
                    "max_education",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Occupation
              </Label>
              <MetadataSelectComponent
                hasAny={true}
                type="profession"
                bindValue={localFilters.occupation || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleFilterChange(
                    "occupation",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Country
              </Label>
              <MetadataSelectComponent
                hasAny={true}
                type="country"
                bindValue={localFilters.country || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleFilterChange("country", e.target.value || undefined)
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
                dontUseID={true}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Gender
              </Label>
              <MetadataSelectComponent
                hasAny={true}
                type="gender"
                bindValue={localFilters.gender || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleFilterChange(
                    "gender",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Caste */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Caste
              </Label>
              <MetadataSelectComponent
                hasAny={true}
                type="caste"
                bindValue={localFilters.caste_id || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleFilterChange(
                    "caste_id",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                // disabled={metadataLoading || !localFilters.religion}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
                data-parent-id={localFilters.religion?.toString()}
              />
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Marital Status
              </Label>
              <MetadataSelectComponent
                hasAny={true}
                type="marital_status"
                bindValue={localFilters.marital_status || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleFilterChange(
                    "marital_status",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Search Results */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-4 2xl:gap-10">
        {loading ? (
          <div className="text-center py-12 col-span-full">
            <div className="text-gray-500 text-lg">Loading profiles...</div>
          </div>
        ) : profiles.length > 0 ? (
          profiles.map((profile: any, index: number) => {
            // Debug: Log first profile to see available fields
            if (index === 0) {
              console.log("Profile keys:", Object.keys(profile));
              console.log("Profile data:", profile);
            }
            const isFavorite = favorites.includes(profile.profile_id);
            // console.log('Is favorite:', isFavorite, 'Profile ID:', profile.profile_id, 'All favorites:', favorites, selectedProfileID);

            return (
              <div
                key={
                  profile.id || profile.profile_id || profile.user_id || index
                }
                className="relative bg-white rounded-md shadow-md overflow-hidden"
              >
                {/* Top Cover Photo */}
                <div className="h-36 w-full overflow-hidden bg-gray-200"></div>

                {/* Favorite + Badges */}
                <div className="flex flex-col justify-center items-center gap-2 my-2 text-white absolute top-0 right-2">
                  <button
                    onClick={() => handleToggleFavorite(profile.profile_id)}
                    className="bg-white rounded-full p-1 hover:scale-110 transition-transform"
                  >
                    {isFavorite ? (
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

                      {/* Always render a line (min-h for fixed height) */}
                      <p className="text-gray-500 text-xs min-h-[1rem]">
                        {profile.occupation ||
                        profile.city ||
                        profile.country ? (
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
            );
          })
        ) : (
          <div className="text-center py-12 col-span-full">
            <div className="text-gray-500 text-lg mb-4">
              {showFilters
                ? 'Click "Search" to find profiles'
                : "No profiles found"}
            </div>
            {!showFilters && (
              <button onClick={openFilters} className="black-btn">
                Try Different Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
