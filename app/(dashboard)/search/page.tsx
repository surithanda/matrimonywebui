"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { RootState, AppDispatch } from "@/app/store/store";
import { searchProfiles, setFilters, clearFilters, SearchFilters, getUserPreferences } from "@/app/store/features/searchSlice";
import { getMetaDataAsync, getCountriesAsync } from "@/app/store/features/metaDataSlice";
import femaleProfile from "@/public/images/dashboard/profile1.png";
import maleProfile from "@/public/images/dashboard/profile3.png";
import defaultAvatar from "@/public/images/dashboard/profile1.png"; // Using as generic avatar
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { createFavoriteAsync, deleteFavoriteAsync, getFavoritesAsync } from "@/app/store/features/profileSlice";
import { getProfilesByAccountIdAsync } from "@/app/store/features/profileSlice";

// Custom hook for toggle functionality
const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(prev => !prev), [setState]);
  return { isOpen: state, onToggle: toggle, onOpen: () => setState(true), onClose: () => setState(false) };
};

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchState = useSelector((state: RootState) => state.search);
  const metaDataState = useSelector((state: RootState) => state.metaData);
  const { selectedProfileID } = useProfileContext();

  // Use the custom toggle hook
  const { isOpen: showFilters, onToggle: toggleFilters, onOpen: openFilters, onClose: closeFilters } = useToggle();
  
  // Provide default values to prevent destructuring errors
  const {
    profiles = [],
    filters = {},
    loading = false,
    error = null
  } = searchState || {};

  // console.log(profiles);

  const {
    loading: metadataLoading = false
  } = metaDataState || {};
  
  // Initialize with default values
  const [localFilters, setLocalFilters] = useState<SearchFilters>({
    min_age: 18,
    max_age: 50,
    profile_id: selectedProfileID // This should come from user's profile
  });

  // Track if preferences have been loaded
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [favorites, setFavorites] = useState<any>([]);

  useEffect(() => {
      const loadFavorites = async () => {
        if (selectedProfileID > 0) {
          const response = await dispatch(getFavoritesAsync({ profileId: selectedProfileID })).unwrap();
          setFavorites(response.data.map((item: any) => item.to_profile_id));
        }
      };
      console.log(selectedProfileID);
      loadFavorites();
    }, [dispatch, selectedProfileID]);

  // Load metadata and user preferences on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load metadata first
        await Promise.all([
          dispatch(getMetaDataAsync({ category: 'religion' })),
          dispatch(getMetaDataAsync({ category: 'education_level' })),
          dispatch(getMetaDataAsync({ category: 'profession' })),
          dispatch(getMetaDataAsync({ category: 'gender' })),
          dispatch(getMetaDataAsync({ category: 'marital_status' })),
          dispatch(getMetaDataAsync({ category: 'caste' })),
          dispatch(getCountriesAsync({}))
        ]);
        
        // Then load user preferences if we have a profile ID
        if (localFilters.profile_id) {
          try {
            const actionResult = await dispatch(getUserPreferences(localFilters.profile_id) as any);
            const preferences = actionResult?.payload;
            console.log(preferences, actionResult);
            // If we have preferences, update the local filters
            if (preferences) {
              const updatedFilters: SearchFilters = { ...localFilters };
              
              // Update filters with preferences if they exist
              if (preferences.min_age !== undefined) updatedFilters.min_age = preferences.min_age;
              if (preferences.max_age !== undefined) updatedFilters.max_age = preferences.max_age;
              if (preferences.gender) updatedFilters.gender = preferences.gender;
              if (preferences.religion) updatedFilters.religion = preferences.religion;
              if (preferences.occupation) updatedFilters.occupation = preferences.occupation;
              if (preferences.marital_status) updatedFilters.marital_status = preferences.marital_status;
              if (preferences.country) updatedFilters.country = preferences.country;
              if (preferences.caste_id) updatedFilters.caste_id = preferences.caste_id;
              
              setLocalFilters(updatedFilters);
              
              // Only trigger search if we have non-default filter values
              const hasNonDefaultFilters = 
                (preferences.min_age !== undefined && preferences.min_age !== 18) ||
                (preferences.max_age !== undefined && preferences.max_age !== 50) ||
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
            console.error('Error loading preferences:', prefError);
            // Continue without preferences if there's an error
          }
        }
        
        setPreferencesLoaded(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setPreferencesLoaded(true); // Still set to true to avoid infinite loading
      }
    };
    
    loadInitialData();
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [dispatch, localFilters]);

  // Handle filter changes with type safety
  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    // Convert empty strings to undefined to avoid sending empty values
    const sanitizedValue = value === '' ? undefined : value;
    
    // Create new filters object with the updated value
    const newFilters: SearchFilters = { 
      ...localFilters, 
      [key]: sanitizedValue 
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
      console.error('Error during search:', error);
      // You might want to show an error message to the user here
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      profile_id: localFilters.profile_id, // Keep profile_id
      min_age: 18,
      max_age: 50
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
        return prev.filter(id => id !== profileId);
      } else {
        // const result = await dispatch(createFavoriteAsync({
        //   profileId: selectedProfileID,
        //   favoriteProfileId: profileId,
        // })).unwrap();
        return [...prev, profileId];
      }
    });
  }

  // Helper function to get profile image with fallback
  const getProfileImage = (profile: any) => {
    // Return actual image if available
    if (profile?.profile_image) return profile.profile_image;
    if (profile?.url) return profile.url;
    
    // Return null for avatar fallback
    return null;
  };

  // Helper function to get initials from name
  const getInitials = (firstName: string = '', lastName: string = '') => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'U'; // 'U' for Unknown if no name
  };

  // Helper function to generate a background color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Generate age options
  const ageOptions = Array.from({ length: 63 }, (_, i) => i + 18);

  return (
    <div className="dashboard-background md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="dmserif32600">Search Profiles</h2>
        <div className="flex gap-2">
          <button
            onClick={toggleFilters}
            className="white-btn flex gap-2 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <path
                d="M18.4375 7.0625H1.5625C1.31386 7.0625 1.0754 6.96373 0.899587 6.78791C0.723772 6.6121 0.625 6.37364 0.625 6.125C0.625 5.87636 0.723772 5.6379 0.899587 5.46209C1.0754 5.28627 1.31386 5.1875 1.5625 5.1875H18.4375C18.6861 5.1875 18.9246 5.28627 19.1004 5.46209C19.2762 5.6379 19.375 5.87636 19.375 6.125C19.375 6.37364 19.2762 6.6121 19.1004 6.78791C18.9246 6.96373 18.6861 7.0625 18.4375 7.0625ZM15.3125 11.4375H4.6875C4.43886 11.4375 4.2004 11.3387 4.02459 11.1629C3.84877 10.9871 3.75 10.7486 3.75 10.5C3.75 10.2514 3.84877 10.0129 4.02459 9.83709C4.2004 9.66127 4.43886 9.5625 4.6875 9.5625H15.3125C15.5611 9.5625 15.7996 9.66127 15.9754 9.83709C16.1512 10.0129 16.25 10.2514 16.25 10.5C16.25 10.7486 16.1512 10.9871 15.9754 11.1629C15.7996 11.3387 15.5611 11.4375 15.3125 11.4375ZM11.5625 15.8125H8.4375C8.18886 15.8125 7.9504 15.7137 7.77459 15.5379C7.59877 15.3621 7.5 15.1236 7.5 14.875C7.5 14.6264 7.59877 14.3879 7.77459 14.2121C7.9504 14.0363 8.18886 13.9375 8.4375 13.9375H11.5625C11.8111 13.9375 12.0496 14.0363 12.2254 14.2121C12.4012 14.3879 12.5 14.6264 12.5 14.875C12.5 15.1236 12.4012 15.3621 12.2254 15.5379C12.0496 15.7137 11.8111 15.8125 11.5625 15.8125Z"
                fill="#404040"
              />
            </svg>
            <span>Filters</span>
          </button>
          {showFilters && (
            <>
              <button onClick={handleSearch} className="black-btn" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button onClick={handleClearFilters} className="white-btn">
                Clear All
              </button>
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
              <label className="block text-sm font-medium text-gray-700">Age Range</label>
              <div className="flex gap-2">
                <select
                  value={localFilters.min_age || 18}
                  onChange={(e) => handleFilterChange('min_age', parseInt(e.target.value))}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Min Age</option>
                  {ageOptions.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
                <select
                  value={localFilters.max_age || 50}
                  onChange={(e) => handleFilterChange('max_age', parseInt(e.target.value))}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Max Age</option>
                  {ageOptions.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Religion */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Religion</label>
              <MetadataSelectComponent
                type="religion"
                bindValue={localFilters.religion || ''}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  handleFilterChange('religion', e.target.value ? parseInt(e.target.value) : undefined)
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Education */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Education</label>
              <MetadataSelectComponent
                type="education_level"
                bindValue={localFilters.max_education || ''}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  handleFilterChange('max_education', e.target.value ? parseInt(e.target.value) : undefined)
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Occupation</label>
              <MetadataSelectComponent
                type="profession"
                bindValue={localFilters.occupation || ''}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  handleFilterChange('occupation', e.target.value ? parseInt(e.target.value) : undefined)
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <MetadataSelectComponent
                type="country"
                bindValue={localFilters.country || ''}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  handleFilterChange('country', e.target.value || undefined)
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
                dontUseID={true}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <MetadataSelectComponent
                type="gender"
                bindValue={localFilters.gender || ''}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  handleFilterChange('gender', e.target.value ? parseInt(e.target.value) : undefined)
                }
                disabled={metadataLoading}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Caste */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Caste</label>
              <MetadataSelectComponent
                type="caste"
                bindValue={localFilters.caste_id || ''}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  handleFilterChange('caste_id', e.target.value ? parseInt(e.target.value) : undefined)
                }
                // disabled={metadataLoading || !localFilters.religion}
                className="w-full tab-select focus:outline-none focus:ring-2 focus:ring-orange-500"
                data-parent-id={localFilters.religion?.toString()}
              />
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Marital Status</label>
              <MetadataSelectComponent
                type="marital_status"
                bindValue={localFilters.marital_status || ''}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  handleFilterChange('marital_status', e.target.value ? parseInt(e.target.value) : undefined)
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
      <div className="w-full">
        {profiles.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {profiles.length} Profile{profiles.length !== 1 ? 's' : ''} Found
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile: any, index: number) => {
                // Debug: Log first profile to see available fields
                if (index === 0) {
                  console.log('Profile keys:', Object.keys(profile));
                  console.log('Profile data:', profile);
                }
                
                const isFavorite = favorites.includes(profile.profile_id);
                // console.log('Is favorite:', isFavorite, 'Profile ID:', profile.profile_id, 'All favorites:', favorites, selectedProfileID);
                

                return (
                <div
                  key={profile.id || profile.profile_id || profile.user_id || index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    {getProfileImage(profile) ? (
                      <Image
                        src={getProfileImage(profile)}
                        alt={profile.first_name || 'Profile'}
                        className="w-full h-64 object-cover"
                        width={300}
                        height={256}
                      />
                    ) : (
                      <div className={`w-full h-64 flex items-center justify-center text-white text-4xl font-bold ${getAvatarColor(profile.first_name || 'Unknown')}`}>
                        {getInitials(profile.first_name, profile.last_name)}
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50" onClick={() => handleToggleFavorite(profile.profile_id)}>
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill={isFavorite ? "red" : "none"}
                          stroke="red"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {profile.age} years • {profile.city || profile.country}
                    </p>
                    {profile.occupation && (
                      <p className="text-gray-600 text-sm mb-2">
                        {profile.occupation}
                      </p>
                    )}
                    {profile.education && (
                      <p className="text-gray-600 text-sm mb-3">
                        {profile.education}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Link 
                        href={`/profiles/${profile.id || profile.profile_id || profile.user_id || index}?fromSearch=true`}
                        className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors text-center"
                      >
                        View Profile
                      </Link>
                      <button className="flex-1 border border-orange-500 text-orange-500 py-2 px-4 rounded-md hover:bg-orange-50 transition-colors">
                        Send Interest
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {showFilters ? 'Click "Search" to find profiles' : 'No profiles found'}
              </div>
              {!showFilters && (
                <button
                  onClick={() => openFilters()}
                  className="black-btn"
                >
                  Try Different Filters
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Page;
