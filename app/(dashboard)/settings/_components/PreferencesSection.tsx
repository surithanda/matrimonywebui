"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { 
  getUserPreferences, 
  saveUserPreferences, 
  setUserPreferences, 
  UserPreferences 
} from "@/app/store/features/searchSlice";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useProfileContext } from "@/app/utils/useProfileContext";


// interface PreferencesSectionProps {
//   profileId?: number;
// }

const PreferencesSection = () => {
  const dispatch = useDispatch();
  const searchState = useSelector((state: RootState) => state.search);
  const { selectedProfileID } = useProfileContext();
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
  const [religion, setReligion] = useState<number | null>(null);
  const [maxEducation, setMaxEducation] = useState<number | null>(null);
  const [occupation, setOccupation] = useState<number | null>(null);
  const [country, setCountry] = useState<string>("");
  const [caste, setCaste] = useState<number | null>(null);
  const [maritalStatus, setMaritalStatus] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null; message: string}>({ type: null, message: '' });

  // Load preferences on component mount and when userPreferences changes
  useEffect(() => {
    if (selectedProfileID && dispatch) {
      try {
        dispatch(getUserPreferences(selectedProfileID) as any);
      } catch (error: any) {
        console.error('Error loading preferences:', error);
        setSaveStatus({ type: 'error', message: 'Failed to load preferences' });
      }
    }
  }, [dispatch, selectedProfileID]);

  // Load metadata
  const { loadMetaData } = useMetaDataLoader();

  // Load metadata and preferences on component mount
  useEffect(() => {
    loadMetaData();
  }, [loadMetaData]);

  // Update local state when userPreferences are loaded
  useEffect(() => {
    if (userPreferences && typeof userPreferences === 'object') {
      if (userPreferences.min_age !== undefined) setMinAge(userPreferences.min_age);
      if (userPreferences.max_age !== undefined) setMaxAge(userPreferences.max_age);
      if (userPreferences.gender) setGender(userPreferences.gender);
      if (userPreferences.religion !== undefined) setReligion(userPreferences.religion);
      if (userPreferences.max_education !== undefined) setMaxEducation(userPreferences.max_education);
      if (userPreferences.occupation !== undefined) setOccupation(userPreferences.occupation);
      if (userPreferences.country) setCountry(userPreferences.country);
      if (userPreferences.caste_id !== undefined) setCaste(userPreferences.caste_id);
      if (userPreferences.marital_status !== undefined) setMaritalStatus(userPreferences.marital_status);
    } else {
      // Set default values if no preferences exist
      setMinAge(18);
      setMaxAge(35);
      setGender("");
      setReligion(null);
      setMaxEducation(null);
      setOccupation(null);
      setCountry("");
      setCaste(null);
      setMaritalStatus(null);
    }
  }, [userPreferences]);

  // Update local state when preferences are loaded
  // useEffect(() => {
  //   if (userPreferences && typeof userPreferences === 'object') {
  //     setMinAge(userPreferences.min_age || 18);
  //     setMaxAge(userPreferences.max_age || 35);
  //     setGender(userPreferences.gender || "");
  //     setLocationPreference(userPreferences.location_preference || "");
  //     setDistancePreference(userPreferences.distance_preference || 50);
  //   }
  // }, [userPreferences]);


  // Handle preference changes with auto-save
  const handlePreferenceChange = (field: string, value: any) => {
    // Update local state based on the field that changed
    switch (field) {
      case 'min_age': setMinAge(value); break;
      case 'max_age': setMaxAge(value); break;
      case 'gender': setGender(value); break;
      case 'religion': setReligion(value); break;
      case 'max_education': setMaxEducation(value); break;
      case 'occupation': setOccupation(value); break;
      case 'country': setCountry(value); break;
      case 'caste_id': setCaste(value); break;
      case 'marital_status': setMaritalStatus(value); break;
    }
  };

  // Handle save button click
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus({ type: null, message: '' });
      
      const preferences = {
        profile_id: selectedProfileID,
        min_age: minAge,
        max_age: maxAge,
        gender,
        religion,
        max_education: maxEducation,
        occupation,
        country,
        caste_id: caste,
        marital_status: maritalStatus,
        created_user: 'current_user@example.com' // This should be replaced with actual user email
      };

      // Update Redux state
      dispatch(setUserPreferences(preferences));
      
      // Save to server
      const result = await dispatch(saveUserPreferences(preferences) as any).unwrap();
      
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      setSaveStatus({ 
        type: 'error', 
        message: error.message || 'Failed to save preferences. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMinAgeChange = (value: number) => handlePreferenceChange('min_age', value);
  const handleMaxAgeChange = (value: number) => handlePreferenceChange('max_age', value);
  const handleGenderChange = (value: string) => handlePreferenceChange('gender', value);
  const handleReligionChange = (value: number | null) => handlePreferenceChange('religion', value);
  const handleMaxEducationChange = (value: number | null) => handlePreferenceChange('max_education', value);
  const handleOccupationChange = (value: number | null) => handlePreferenceChange('occupation', value);
  const handleCountryChange = (value: string) => handlePreferenceChange('country', value);
  const handleCasteChange = (value: number | null) => handlePreferenceChange('caste_id', value);
  const handleMaritalStatusChange = (value: number | null) => handlePreferenceChange('marital_status', value);

  return (
    <>
      <div className="flex items-center justify-between mb-4" style={{ width: '100%' }}>
        <h2 className="dmserif32600 text-left">Search Preferences</h2>
        <div className="absolute right-12">

        <div className="flex items-center space-x-4">
          {saveStatus.type && (
            <div className={`text-sm ${
              saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {saveStatus.message}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
        </div>
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
          <MetadataSelectComponent
            type="gender"
            bindValue={gender}
            changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleGenderChange(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Religion */}
        <div className="mb-6">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Religion
          </label>
          <MetadataSelectComponent
            type="religion"
            bindValue={religion || ""}
            changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleReligionChange(Number(e.target.value) || null)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Max Education */}
        <div className="mb-6">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Education Level
          </label>
          <MetadataSelectComponent
            type="education_level"
            bindValue={maxEducation || ""}
            changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleMaxEducationChange(Number(e.target.value) || null)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Occupation */}
        <div className="mb-6">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Occupation
          </label>
          <MetadataSelectComponent
            type="profession"
            bindValue={occupation || ""}
            changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleOccupationChange(Number(e.target.value) || null)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Country */}
        <div className="mb-6">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Country
          </label>
          <MetadataSelectComponent
            type="country"
            bindValue={country || ""}
            changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleCountryChange(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Caste */}
        <div className="mb-6">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Caste
          </label>
          <MetadataSelectComponent
            type="caste"
            bindValue={caste || ""}
            changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleCasteChange(Number(e.target.value) || null)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Marital Status */}
        <div className="mb-6">
          <label className="block BRCobane20600 text-gray-950 mb-2">
            Marital Status
          </label>
          <MetadataSelectComponent
            type="marital_status"
            bindValue={maritalStatus || ""}
            changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleMaritalStatusChange(Number(e.target.value) || null)}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
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
