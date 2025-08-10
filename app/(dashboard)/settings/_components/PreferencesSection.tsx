"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { getUserPreferences, saveUserPreferences, setUserPreferences } from "@/app/store/features/searchSlice";

// Simple debounce implementation as fallback
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

interface PreferencesSectionProps {
  profileId?: number;
}

const PreferencesSection = ({ profileId = 1 }: PreferencesSectionProps) => {
  const dispatch = useDispatch();
  const searchState = useSelector((state: RootState) => state.search);
  
  // Safely destructure with default values
  const {
    userPreferences = {},
    preferencesLoading = false,
    preferencesError = null
  } = searchState || {};

  // Initialize state with default values from userPreferences
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(35);
  const [gender, setGender] = useState<string>("");
  const [locationPreference, setLocationPreference] = useState<string>("");
  const [distancePreference, setDistancePreference] = useState<number>(50);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null; message: string}>({ type: null, message: '' });

  // Load preferences on component mount and when userPreferences changes
  useEffect(() => {
    if (profileId && dispatch) {
      try {
        dispatch(getUserPreferences(profileId) as any);
      } catch (error) {
        console.error('Error loading preferences:', error);
        setSaveStatus({ type: 'error', message: 'Failed to load preferences' });
      }
    }
  }, [dispatch, profileId]);

  // Update local state when userPreferences are loaded
  useEffect(() => {
    if (userPreferences) {
      if (userPreferences.min_age !== undefined) setMinAge(userPreferences.min_age);
      if (userPreferences.max_age !== undefined) setMaxAge(userPreferences.max_age);
      if (userPreferences.gender) setGender(userPreferences.gender);
      if (userPreferences.location_preference) setLocationPreference(userPreferences.location_preference);
      if (userPreferences.distance_preference !== undefined) setDistancePreference(userPreferences.distance_preference);
    }
  }, [userPreferences]);

  // Update local state when preferences are loaded
  useEffect(() => {
    if (userPreferences && typeof userPreferences === 'object') {
      setMinAge(userPreferences.min_age || 18);
      setMaxAge(userPreferences.max_age || 35);
      setGender(userPreferences.gender || "");
      setLocationPreference(userPreferences.location_preference || "");
      setDistancePreference(userPreferences.distance_preference || 50);
    }
  }, [userPreferences]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((preferences) => {
      try {
        if (dispatch && preferences) {
          dispatch(saveUserPreferences(preferences) as any);
        }
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    }, 1000),
    [dispatch]
  );

  // Handle preference changes with auto-save
  const handlePreferenceChange = (field: string, value: any) => {
    const updatedPreferences = {
      profile_id: profileId,
      min_age: minAge,
      max_age: maxAge,
      gender,
      location_preference: locationPreference,
      distance_preference: distancePreference,
      [field]: value
    };
    
    // Update Redux state immediately
    dispatch(setUserPreferences(updatedPreferences));
    
    // Auto-save with debounce
    debouncedSave(updatedPreferences);
  };

  const handleMinAgeChange = (value: number) => {
    setMinAge(value);
    handlePreferenceChange('min_age', value);
  };

  const handleMaxAgeChange = (value: number) => {
    setMaxAge(value);
    handlePreferenceChange('max_age', value);
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    handlePreferenceChange('gender', value);
  };

  const handleLocationChange = (value: string) => {
    setLocationPreference(value);
    handlePreferenceChange('location_preference', value);
  };

  const handleDistanceChange = (value: number) => {
    setDistancePreference(value);
    handlePreferenceChange('distance_preference', value);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="dmserif32600 text-left">Search Preferences</h2>
        {preferencesLoading && (
          <div className="text-sm text-gray-500">Saving...</div>
        )}
      </div>

      {preferencesError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {preferencesError}
        </div>
      )}

      {/* Age Range */}
      <div className="mb-6">
        <label className="block BRCobane20600 text-gray-950 mb-2">
          Age Range: {minAge} - {maxAge} years
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Age</label>
            <input
              type="range"
              min="18"
              max="60"
              value={minAge}
              onChange={(e) => handleMinAgeChange(Number(e.target.value))}
              className="w-full bg-[#CDCDCD] rounded-full h-2"
            />
            <div className="text-center text-sm text-gray-600">{minAge}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Age</label>
            <input
              type="range"
              min="18"
              max="60"
              value={maxAge}
              onChange={(e) => handleMaxAgeChange(Number(e.target.value))}
              className="w-full bg-[#CDCDCD] rounded-full h-2"
            />
            <div className="text-center text-sm text-gray-600">{maxAge}</div>
          </div>
        </div>
      </div>

      {/* Select Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Gender */}
        <div className="mb-6">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Gender Preference
          </label>
          <select
            value={gender}
            onChange={(e) => handleGenderChange(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Any Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Location Preference
          </label>
          <input
            type="text"
            value={locationPreference}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="Enter preferred location"
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Distance Preference */}
      <div className="mb-6">
        <label className="block BRCobane20600 text-gray-950 mb-2">
          Distance Preference: {distancePreference} km
        </label>
        <input
          type="range"
          min="5"
          max="500"
          step="5"
          value={distancePreference}
          onChange={(e) => handleDistanceChange(Number(e.target.value))}
          className="w-full bg-[#CDCDCD] rounded-full h-2"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>5 km</span>
          <span>500 km</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Auto-Save Enabled</h3>
        <p className="text-sm text-gray-600">
          Your preferences are automatically saved as you make changes. These preferences will be used as default filters when you search for profiles.
        </p>
      </div>
    </>
  );
};

export default PreferencesSection;
