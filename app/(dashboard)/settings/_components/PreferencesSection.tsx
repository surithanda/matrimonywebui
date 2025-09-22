"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  getUserPreferences,
  saveUserPreferences,
  setUserPreferences,
  UserPreferences,
} from "@/app/store/features/searchSlice";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
    preferencesError = null,
  } = searchState || {};

  // Initialize state with default values from userPreferences
  const [minAge, setMinAge] = useState<number>(21);
  const [maxAge, setMaxAge] = useState<number>(50);
  const [gender, setGender] = useState<string>("");
  const [religion, setReligion] = useState<number | null>(null);
  const [maxEducation, setMaxEducation] = useState<number | null>(null);
  const [occupation, setOccupation] = useState<number | null>(null);
  const [country, setCountry] = useState<string>("");
  const [caste, setCaste] = useState<number | null>(null);
  const [maritalStatus, setMaritalStatus] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Load preferences on component mount and when userPreferences changes
  useEffect(() => {
    if (selectedProfileID && dispatch) {
      try {
        dispatch(getUserPreferences(selectedProfileID) as any);
      } catch (error: any) {
        console.error("Error loading preferences:", error);
        setSaveStatus({ type: "error", message: "Failed to load preferences" });
      }
    }
  }, [dispatch, selectedProfileID]);

  // Load metadata
  // const { loadMetaData } = useMetaDataLoader();

  // Load metadata and preferences on component mount
  // useEffect(() => {
  //   loadMetaData();
  // }, [loadMetaData]);

  // Update local state when userPreferences are loaded
  useEffect(() => {
    if (userPreferences && typeof userPreferences === "object") {
      if (userPreferences.min_age !== undefined)
        setMinAge(userPreferences.min_age);
      if (userPreferences.max_age !== undefined)
        setMaxAge(userPreferences.max_age);
      if (userPreferences.gender) setGender(userPreferences.gender);
      if (userPreferences.religion !== undefined)
        setReligion(userPreferences.religion);
      if (userPreferences.max_education !== undefined)
        setMaxEducation(userPreferences.max_education);
      if (userPreferences.occupation !== undefined)
        setOccupation(userPreferences.occupation);
      if (userPreferences.country) setCountry(userPreferences.country);
      if (userPreferences.caste_id !== undefined)
        setCaste(userPreferences.caste_id);
      if (userPreferences.marital_status !== undefined)
        setMaritalStatus(userPreferences.marital_status);
    } else {
      // Set default values if no preferences exist
      setMinAge(21);
      setMaxAge(50);
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
  //     setMaxAge(userPreferences.max_age || 50);
  //     setGender(userPreferences.gender || "");
  //     setLocationPreference(userPreferences.location_preference || "");
  //     setDistancePreference(userPreferences.distance_preference || 50);
  //   }
  // }, [userPreferences]);

  // Handle preference changes with auto-save
  const handlePreferenceChange = (field: string, value: any) => {
    // Update local state based on the field that changed
    switch (field) {
      case "min_age":
        setMinAge(value);
        break;
      case "max_age":
        setMaxAge(value);
        break;
      case "gender":
        setGender(value);
        break;
      case "religion":
        setReligion(value);
        break;
      case "max_education":
        setMaxEducation(value);
        break;
      case "occupation":
        setOccupation(value);
        break;
      case "country":
        setCountry(value);
        break;
      case "caste_id":
        setCaste(value);
        break;
      case "marital_status":
        setMaritalStatus(value);
        break;
    }
  };

  // Handle save button click
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus({ type: null, message: "" });

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
        created_user: "current_user@example.com", // This should be replaced with actual user email
      };

      // Update Redux state
      dispatch(setUserPreferences(preferences));

      // Save to server
      const result = await dispatch(
        saveUserPreferences(preferences) as any
      ).unwrap();
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      setSaveStatus({
        type: "error",
        message:
          error.message || "Failed to save preferences. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMinAgeChange = (value: number) =>
    handlePreferenceChange("min_age", value);
  const handleMaxAgeChange = (value: number) =>
    handlePreferenceChange("max_age", value);
  const handleGenderChange = (value: string) =>
    handlePreferenceChange("gender", value);
  const handleReligionChange = (value: number | null) =>
    handlePreferenceChange("religion", value);
  const handleMaxEducationChange = (value: number | null) =>
    handlePreferenceChange("max_education", value);
  const handleOccupationChange = (value: number | null) =>
    handlePreferenceChange("occupation", value);
  const handleCountryChange = (value: string) =>
    handlePreferenceChange("country", value);
  const handleCasteChange = (value: number | null) =>
    handlePreferenceChange("caste_id", value);
  const handleMaritalStatusChange = (value: number | null) =>
    handlePreferenceChange("marital_status", value);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h2 className="dmserif32600">Search Preferences</h2>
        <div className="flex items-center space-x-4">
          {saveStatus.type && (
            <div
              className={`text-sm ${
                saveStatus.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {saveStatus.message}
            </div>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {preferencesError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {preferencesError}
        </div>
      )}

      <div className="border border-gray-100  bg-gray-100 rounded-lg w-full">
        {/* <h3
          className="text-lg font-semibold bg-gray-100 px-4 py-3"
          style={{ fontFamily: "BR Cobane" }}
        >
          Personal Details
        </h3> */}
        <div className="px-4 py-4 m-1 bg-white rounded-md">
          {/* Age Range */}
          <div className=" w-full">
            <label >
              Age Range: {minAge} - {maxAge} years
            </label>
            <div className="grid grid-cols-2 gap-4 w-full mt-2">
              <div>
                <Label className="block text-sm text-gray-600 mb-1">
                  Min Age
                </Label>
                <Input
                  type="range"
                  min="21"
                  max="85"
                  value={minAge}
                  onChange={(e) => handleMinAgeChange(Number(e.target.value))}
                  className="w-full bg-[#CDCDCD] rounded-full h-2"
                />
                <div className="text-center text-sm text-gray-600">
                  {minAge}
                </div>
              </div>
              <div>
                <Label className="block text-sm text-gray-600 mb-1">
                  Max Age
                </Label>
                <Input
                  type="range"
                  min="21"
                  max="85"
                  value={maxAge}
                  onChange={(e) => handleMaxAgeChange(Number(e.target.value))}
                  className="w-full bg-[#CDCDCD] rounded-full h-2"
                />
                <div className="text-center text-sm text-gray-600">
                  {maxAge}
                </div>
              </div>
            </div>
          </div>

          {/* Select Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4 gap-6 w-full">
            {/* Gender */}
            <div className="">
              <Label >
                Gender Preference
              </Label>
              <MetadataSelectComponent
                type="gender"
                bindValue={gender}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleGenderChange(e.target.value)
                }
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Religion */}
            <div className="">
              <Label >
                Religion
              </Label>
              <MetadataSelectComponent
                type="religion"
                bindValue={religion || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleReligionChange(Number(e.target.value) || null)
                }
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Max Education */}
            <div className="">
              <Label >
                Education Level
              </Label>
              <MetadataSelectComponent
                type="education_level"
                bindValue={maxEducation || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleMaxEducationChange(Number(e.target.value) || null)
                }
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Occupation */}
            <div className="">
              <Label >
                Occupation
              </Label>
              <MetadataSelectComponent
                type="profession"
                bindValue={occupation || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleOccupationChange(Number(e.target.value) || null)
                }
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Country */}
            <div className="">
              <Label >
                Country
              </Label>
              <MetadataSelectComponent
                type="country"
                bindValue={country || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleCountryChange(e.target.value)
                }
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Caste */}
            <div className="">
              <Label >
                Caste
              </Label>
              <MetadataSelectComponent
                type="caste"
                bindValue={caste || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleCasteChange(Number(e.target.value) || null)
                }
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Marital Status */}
            <div className="">
              <Label >
                Marital Status
              </Label>
              <MetadataSelectComponent
                type="marital_status"
                bindValue={maritalStatus || ""}
                changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleMaritalStatusChange(Number(e.target.value) || null)
                }
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3
          className="text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: "BR Cobane" }}
        >
          Auto-Save Enabled
        </h3>
        <p className="text-sm text-gray-600">
          Your preferences are automatically saved as you make changes. These
          preferences will be used as default filters when you search for
          profiles.
        </p>
      </div>
    </>
  );
};

export default PreferencesSection;
