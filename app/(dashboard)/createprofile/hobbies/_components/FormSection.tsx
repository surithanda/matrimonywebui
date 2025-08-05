"use client";
import React, { useEffect, useState, useContext } from "react";
import Autosuggest from "react-autosuggest";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { getHobbiesInterestsAsync, addHobbyAsync, removeHobbyAsync, addInterestAsync, removeInterestAsync } from "@/app/store/features/profileSlice";
import { ProfileIDContext } from "../../_components/Sidebar";

// const hobbySuggestions = [
//   "Reading", "Traveling", "Cooking", "Gardening", "Photography", "Painting", "Dancing", "Music", "Sports", "Writing", "Fishing", "Hiking", "Cycling", "Yoga", "Crafts"
// ];
// const interestSuggestions = [
//   "Technology", "Science", "Art", "History", "Movies", "Fitness", "Fashion", "Food", "Nature", "Politics", "Business", "Finance", "Languages", "Gaming", "Volunteering"
// ];

const FormSection = () => {
  const router = useRouter();
  const { selectedProfileID } = useContext(ProfileIDContext);
  const dispatch = useAppDispatch();
  const reduxProfile = useAppSelector((state) => state.profile);
  const {countryList, hobbyList, interestList} = useAppSelector((state) => state.metaData);
  const hobbySuggestions = hobbyList.map(hobby => hobby.name);
  const interestSuggestions = interestList.map(interest => interest.name);
const [hobbies, setHobbies] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const loading = reduxProfile.loading;
  const error = reduxProfile.error;
  const { register, setValue, watch, reset } = useForm<{ hobbyInput: string; interestInput: string }>({ defaultValues: { hobbyInput: "", interestInput: "" } });
  const hobbyInput = watch("hobbyInput") || "";
  const interestInput = watch("interestInput") || "";
  // Autosuggest state
  const [hobbySuggestionsList, setHobbySuggestionsList] = useState<string[]>([]);
  const [interestSuggestionsList, setInterestSuggestionsList] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  // Fetch properties from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(getHobbiesInterestsAsync({ profile_id: selectedProfileID, category: 'hobby' })).then((result: any) => {
      if (result.payload?.data) {
        setHobbies(
          result.payload.data?.hobby_interests
            ?.map((hobby: any) => hobby.hobby_interest_name)
            ?.filter((name: string | null | undefined) => !!name && typeof name === 'string' && name.trim() !== "")
        );
      }
    });
    dispatch(getHobbiesInterestsAsync({ profile_id: selectedProfileID, category: 'interest' })).then((result: any) => {
      if (result.payload?.data) {
        setInterests(
          result.payload.data?.hobby_interests
            ?.map((interest: any) => interest.hobby_interest_name)
            ?.filter((name: string | null | undefined) => !!name && typeof name === 'string' && name.trim() !== "")
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfileID, dispatch]);

  // Autosuggest handlers
  const getSuggestions = (value: string, suggestions: string[]): string[] => {
    const inputValue = value.trim().toLowerCase();
    return inputValue.length === 0
      ? []
      : suggestions.filter(s => s.toLowerCase().includes(inputValue) && inputValue !== s.toLowerCase());
  };

  const onHobbySuggestionsFetchRequested = ({ value }: { value: string }) => {
    setHobbySuggestionsList(getSuggestions(value, hobbySuggestions));
  };
  const onHobbySuggestionsClearRequested = () => {
    setHobbySuggestionsList([]);
  };
  const onInterestSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setInterestSuggestionsList(getSuggestions(value, interestSuggestions));
  };
  const onInterestSuggestionsClearRequested = () => {
    setInterestSuggestionsList([]);
  };

  // Add on Enter or on suggestion select
  const handleAdd = async (type: "hobbies" | "interests", value: string) => {
    if (!selectedProfileID) {
      setLocalError("Profile ID not found.");
      return;
    }
    
    let selection;
    if (type === "hobbies") {
      selection = hobbyList.reduce((acc, curr) => {
        if (curr.name === value) {
          // setLocalError("Hobby already exists.");
          acc = curr;
        }
        return acc;
      }, {id: "", name: ""});
    }
    else {
      selection = interestList.reduce((acc, curr) => {
        if (curr.name === value) {
          // setLocalError("Interest already exists.");
          acc = curr;
        }
        return acc;
      }, {id: "", name: ""});
    }
    
    setLocalError(null);
    if (type === "hobbies") {
      if (!value.trim() || hobbies?.includes(selection.name.trim())) return;
      try {
        await dispatch(addHobbyAsync({ profile_id: selectedProfileID, hobby: selection?.id })).unwrap();
        setHobbies(prev => [...prev, selection.name.trim()]);
        setValue("hobbyInput", "");
      } catch (err: any) {
        setLocalError(err.message || "Error adding hobby");
      }
    } else {
      if (!value.trim() || interests?.includes(selection.name.trim())) return;
      try {
        await dispatch(addInterestAsync({ profile_id: selectedProfileID, hobby: selection?.id })).unwrap();
        setInterests(prev => [...prev, selection.name.trim()]);
        setValue("interestInput", "");
      } catch (err: any) {
        setLocalError(err.message || "Error adding interest");
      }
    }
  };

  const handleHobbyKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && hobbyInput.trim()) {
      await handleAdd("hobbies", hobbyInput);
      event.preventDefault();
    }
  };
  const handleInterestKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && interestInput.trim()) {
      await handleAdd("interests", interestInput);
      event.preventDefault();
    }
  };

  const removeTag = async (type: "hobbies" | "interests", index: number) => {
    if (!selectedProfileID) {
      setLocalError("Profile ID not found.");
      return;
    }
    setLocalError(null);
    if (type === "hobbies") {
      const hobby = hobbies[index];
      try {
        await dispatch(removeHobbyAsync({ profile_id: selectedProfileID, hobby })).unwrap();
        setHobbies(prev => prev.filter((_, i) => i !== index));
      } catch (err: any) {
        setLocalError(err.message || "Error removing hobby");
      }
    } else {
      const interest = interests[index];
      try {
        await dispatch(removeInterestAsync({ profile_id: selectedProfileID, interest })).unwrap();
        setInterests(prev => prev.filter((_, i) => i !== index));
      } catch (err: any) {
        setLocalError(err.message || "Error removing interest");
      }
    }
  };
  // Custom styles for react-autosuggest to match input and dropdown
  const autosuggestTheme = {
    container: "relative",
    input: "w-full bg-white border rounded-lg py-2 px-4 text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none",
    suggestionsContainer: "absolute z-10 w-full bg-white rounded-lg mt-1 shadow-lg",
    suggestionsList: "m-0 p-0 list-none",
    suggestion: "px-4 py-2 cursor-pointer text-gray-700 hover:bg-orange-100",
    suggestionHighlighted: "bg-orange-200 text-orange-900"
  };

  return (
    <section className="md:py-5 w-4/5 mx-[50px]">
      {/* Hobbies Section */}
      <div className="mb-6">
        <h3 className="BRCobane18600 mb-3">Hobbies</h3>
        <div>
          <div className="flex flex-col gap-2">
            <Autosuggest
              suggestions={hobbySuggestionsList}
              onSuggestionsFetchRequested={onHobbySuggestionsFetchRequested}
              onSuggestionsClearRequested={onHobbySuggestionsClearRequested}
              getSuggestionValue={(suggestion: string) => suggestion}
              renderSuggestion={(suggestion: string) => <span>{suggestion}</span>}
              inputProps={{
                ...register("hobbyInput"),
                placeholder: "Type to search",
                className: autosuggestTheme.input,
                value: hobbyInput,
                onChange: (_: any, { newValue }: { newValue: string }) => setValue("hobbyInput", newValue),
                onKeyDown: handleHobbyKeyDown,
                disabled: loading
              }}
              onSuggestionSelected={(_: any, { suggestion }: { suggestion: string }) => handleAdd("hobbies", suggestion)}
              theme={autosuggestTheme}
            />
            <div className="flex gap-2 flex-wrap">
              {hobbies && hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 rounded-[10px] p-[8px_12px] text-sm flex items-center shadow-sm border"
                >
                  {hobby}
                  <button
                    // onClick={() => removeTag("hobbies", index)}
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
      <div className="mb-6">
        <h3 className="BRCobane18600 mb-3">Interests</h3>
        <div>
          <div className="flex flex-col gap-2">
            <Autosuggest
              suggestions={interestSuggestionsList}
              onSuggestionsFetchRequested={onInterestSuggestionsFetchRequested}
              onSuggestionsClearRequested={onInterestSuggestionsClearRequested}
              getSuggestionValue={(suggestion: string) => suggestion}
              renderSuggestion={(suggestion: string) => <span>{suggestion}</span>}
              inputProps={{
                ...register("interestInput"),
                placeholder: "Type to search",
                className: autosuggestTheme.input,
                value: interestInput,
                onChange: (_: any, { newValue }: { newValue: string }) => setValue("interestInput", newValue),
                onKeyDown: handleInterestKeyDown,
                disabled: loading
              }}
              onSuggestionSelected={(_: any, { suggestion }: { suggestion: string }) => handleAdd("interests", suggestion)}
              theme={autosuggestTheme}
            />
            <div className="flex gap-2 flex-wrap">
              {interests && interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 rounded-[10px] p-[8px_12px] text-sm flex items-center shadow-sm border"
                >
                  {interest}
                  <button
                    // onClick={() => removeTag("interests", index)}
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
      {(loading) && <div className="mb-2 text-blue-600">Loading...</div>}
      {(localError || error) && <div className="mb-2 text-red-600">{localError || error}</div>}
      <div className="flex justify-between mt-[250px]">
        <div className="flex justify-start gap-4">
          <button className="yellow-btn hover:bg-orange-600">Continue</button>
          <button className="gray-btn hover:bg-gray-400">Cancel</button>
        </div>
        <button className="gray-btn hover:bg-gray-400" onClick={() =>router.push("/createprofile/lifestyle")}>Skip</button>
      </div>
    </section>
  );
};

export default FormSection;
