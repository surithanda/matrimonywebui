"use client";
import React, { useEffect, useState, useContext } from "react";
import CustomAutocomplete from "@/app/_components/custom_components/CustomAutocomplete";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  getHobbiesInterestsAsync,
  addHobbyAsync,
  removeHobbyAsync,
  addInterestAsync,
  removeInterestAsync,
} from "@/app/store/features/profileSlice";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { AddHobbieModal } from "./hobbies-modals/AddHobbieModal";

interface HobbyInterestData {
  hobby_interest_id?: number;
  hobby_interest_name: string;
  id?: number; // Add ID field for deletion
}

// const hobbySuggestions = [
//   "Reading", "Traveling", "Cooking", "Gardening", "Photography", "Painting", "Dancing", "Music", "Sports", "Writing", "Fishing", "Hiking", "Cycling", "Yoga", "Crafts"
// ];
// const interestSuggestions = [
//   "Technology", "Science", "Art", "History", "Movies", "Fitness", "Fashion", "Food", "Nature", "Politics", "Business", "Finance", "Languages", "Gaming", "Volunteering"
// ];

const FormSection = () => {
  const router = useRouter();
  const { selectedProfileID } = useProfileContext();
  const dispatch = useAppDispatch();
  const reduxProfile = useAppSelector((state) => state.profile);
  const { countryList, hobbyList, interestList } = useAppSelector(
    (state) => state.metaData
  );
  const hobbySuggestions = hobbyList.map((hobby) => hobby.name);
  const interestSuggestions = interestList.map((interest) => interest.name);
  const [hobbies, setHobbies] = useState<HobbyInterestData[]>([]);
  const [interests, setInterests] = useState<HobbyInterestData[]>([]);
  const loading = reduxProfile.loading;
  const error = reduxProfile.error;
  const { register, setValue, watch, reset } = useForm<{
    hobbyInput: string;
    interestInput: string;
  }>({ defaultValues: { hobbyInput: "", interestInput: "" } });
  const hobbyInput = watch("hobbyInput") || "";
  const interestInput = watch("interestInput") || "";
  const [localError, setLocalError] = useState<string | null>(null);

  // Fetch properties from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;

    dispatch(
      getHobbiesInterestsAsync({
        profile_id: selectedProfileID,
        category: "hobby",
      })
    ).then((result) => {
      if (
        result.payload?.success &&
        Array.isArray(result.payload.data?.hobby_interests)
      ) {
        const hobbyData = result.payload.data?.hobby_interests.filter(Boolean) as HobbyInterestData[];
        setHobbies(hobbyData.map((h: any) => ({
          hobby_interest_id: h.profile_hobby_intereste_id,
          hobby_interest_name: h.hobby_interest_name,
          id: h.hobby_interest_id // Ensure ID is set for deletion
        })));
      }
    });
    dispatch(
      getHobbiesInterestsAsync({
        profile_id: selectedProfileID,
        category: "interest",
      })
    ).then((result) => {
      if (
        result.payload?.success &&
        Array.isArray(result.payload.data?.hobby_interests)
      ) {
        const interestData = result.payload.data?.hobby_interests.filter(Boolean) as HobbyInterestData[];
        setInterests(interestData.map((i: any) => ({
          hobby_interest_id: i.profile_hobby_intereste_id,
          hobby_interest_name: i.hobby_interest_name,
          id: i.hobby_interest_id // Ensure ID is set for deletion
        })));
      }
    });
  }, [selectedProfileID, dispatch]);

  // Add on Enter or on suggestion select
  const handleAdd = async (type: "hobbies" | "interests", value: string) => {
    if (!selectedProfileID) {
      setLocalError("Profile ID not found.");
      return;
    }

    const selection =
      type === "hobbies"
        ? hobbyList.find((item) => item.name === value)
        : interestList.find((item) => item.name === value);

    setLocalError(null);
    if (type === "hobbies") {
      if (
        !selection ||
        !value.trim() ||
        hobbies?.some(h => h.hobby_interest_name === selection.name.trim())
      )
        return;
      try {
        const result = await dispatch(
          addHobbyAsync({
            profile_id: selectedProfileID,
            hobby: String(selection.id),
          })
        ).unwrap();
        
        // Add the new hobby with both name and id if available
        const newHobby: HobbyInterestData = {
          hobby_interest_name: selection.name.trim(),
          hobby_interest_id: result?.data?.hobby_id,// || selection.id,
          id: result?.data?.hobby_interest_id || selection.id
        };
        setHobbies((prev) => [...prev, newHobby]);
        setValue("hobbyInput", "");
      } catch (err: any) {
        setLocalError(err.message || "Error adding hobby");
      }
    } else {
      if (
        !selection ||
        !value.trim() ||
        interests?.some(i => i.hobby_interest_name === selection.name.trim())
      )
        return;
      try {
        const result = await dispatch(
          addInterestAsync({
            profile_id: selectedProfileID,
            hobby: String(selection.id),
          })
        ).unwrap();
        
        // Add the new interest with both name and id if available
        const newInterest: HobbyInterestData = {
          hobby_interest_name: selection.name.trim(),
          hobby_interest_id: result?.data?.id,// || selection.id,
          id: result?.data?.hobby_interest_id || selection.id
        };
        setInterests((prev) => [...prev, newInterest]);
        setValue("interestInput", "");
      } catch (err: any) {
        setLocalError(err.message || "Error adding interest");
      }
    }
  };

  const removeTag = async (type: "hobbies" | "interests", index: number) => {
    if (!selectedProfileID) {
      setLocalError("Profile ID not found.");
      return;
    }
    setLocalError(null);
    if (type === "hobbies") {
      const hobbyItem = hobbies[index];
      console.log("Removing hobby item:", hobbyItem);
      const hobbyId = hobbyItem.hobby_interest_id; // || hobbyItem.id;
      if (!hobbyId) {
        setLocalError("Hobby ID not found for deletion.");
        return;
      }
      try {
        await dispatch(
          removeHobbyAsync({ 
            id: hobbyId,
            created_user: "user" // You may want to get this from auth context
          })
        ).unwrap();
        setHobbies((prev) => prev.filter((_, i) => i !== index));
      } catch (err: any) {
        setLocalError(err.message || "Error removing hobby");
      }
    } else {
      const interestItem = interests[index];
      const interestId = interestItem.hobby_interest_id;
      if (!interestId) {
        setLocalError("Interest ID not found for deletion.");
        return;
      }
      try {
        await dispatch(
          removeInterestAsync({ 
            id: interestId,
            created_user: "user" // You may want to get this from auth context
          })
        ).unwrap();
        setInterests((prev) => prev.filter((_, i) => i !== index));
      } catch (err: any) {
        setLocalError(err.message || "Error removing interest");
      }
    }
  };

  return (
    <>
      <section className="px-4 py-5 md:px-0 md:py-2 w-full">
        {/* Hobbies Section */}
        <div className="mb-6 p-5">
          <h3 className="BRCobane18600 mb-3">Hobbies</h3>
          <div>
            <div className="flex flex-col gap-2">
              <CustomAutocomplete
                suggestions={hobbySuggestions}
                value={hobbyInput}
                onChange={(value) => setValue("hobbyInput", value)}
                onSuggestionSelect={(suggestion) => handleAdd("hobbies", suggestion)}
                placeholder="Type to search hobbies"
                disabled={loading}
              />
              <div className="flex gap-2 flex-wrap">
                {hobbies &&
                  hobbies.map((hobby, index) => (
                    <span
                      key={hobby.hobby_interest_id || hobby.id || index}
                      className="bg-gray-100 text-gray-700 rounded-[10px] p-[8px_12px] text-sm flex items-center shadow-sm border"
                    >
                      {hobby.hobby_interest_name}
                      <button
                        onClick={() => removeTag("hobbies", index)}
                        disabled={loading}
                        className="ml-2 text-red-500 font-bold hover:text-red-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="mb-6 p-5">
          <h3 className="BRCobane18600 mb-3">Interests</h3>
          <div>
            <div className="flex flex-col gap-2">
              <CustomAutocomplete
                suggestions={interestSuggestions}
                value={interestInput}
                onChange={(value) => setValue("interestInput", value)}
                onSuggestionSelect={(suggestion) => handleAdd("interests", suggestion)}
                placeholder="Type to search interests"
                disabled={loading}
              />
              <div className="flex gap-2 flex-wrap">
                {interests &&
                  interests.map((interest, index) => (
                    <span
                      key={interest.hobby_interest_id || interest.id || index}
                      className="bg-gray-100 text-gray-700 rounded-[10px] p-[8px_12px] text-sm flex items-center shadow-sm border"
                    >
                      {interest.hobby_interest_name}
                      <button
                        onClick={() => removeTag("interests", index)}
                        disabled={loading}
                        className="ml-2 text-red-500 font-bold hover:text-red-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {loading && <div className="mb-2 text-blue-600">Loading...</div>}
        {(localError || error) && (
          <div className="mb-2 text-red-600">{localError || error}</div>
        )}
        <div className="flex justify-between mt-[250px]">
          <div className="flex justify-start gap-4">
            <button
              className="yellow-btn hover:bg-orange-600"
              onClick={() => router.push("/createprofile/lifestyle")}
            >
              Continue
            </button>
            <button className="gray-btn hover:bg-gray-400">Cancel</button>
          </div>
          <button
            className="gray-btn hover:bg-gray-400"
            onClick={() => router.push("/createprofile/lifestyle")}
          >
            Skip
          </button>
        </div>
      </section>
    </>
  );
};

export default FormSection;
