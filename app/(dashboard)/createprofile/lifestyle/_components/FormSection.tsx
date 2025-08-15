"use client";
import { createLifestyleAsync, getLifestyleAsync, updateLifestyleAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useProfileContext } from "@/app/utils/useProfileContext";

const FormSection = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();
  const { selectedProfileID } = useProfileContext();

  const [selections, setSelections] = useState<{
    profile_lifestyle_id: number | null;
    eatingHabit: string | null;
    dietHabit: string | null;
    cigarettesPerDay: string | null;
    drinkFrequency: string | null;
    gamblingEngage: string | null;
    physicalActivityLevel: string | null;
    relaxationMethods: string | null;
  }>({
    profile_lifestyle_id: null,
    eatingHabit: null,
    dietHabit: null,
    cigarettesPerDay: null,
    drinkFrequency: null,
    gamblingEngage: null,
    physicalActivityLevel: null,
    relaxationMethods: null,
  });

  // Define categories and their options
  const categories = {
    "What best describes your eating habits?": ["Omnivore", "Vegetarian", "Vegan", "Other"],
    "Do you follow any specific diet plan?": ["Low-carb", "Keto", "Mediterranean", "I don't diet"],
    "How many cigarettes do you smoke per day on average?": ["0-3", "4-6", "7-10", "I don't smoke"],
    "How frequently do you drink?": ["Daily", "Weekly", "Monthly", "Never"],
    "What type of gambling do you engage in?": ["Casino", "Sports Betting", "Lottery", "I don't gamble"],
    "How would you describe your physical activity level?": ["Sedentary", "Lightly active", "Moderately active", "Very active"],
    "Do you practice any relaxation techniques?": ["Meditation", "Yoga", "Deep Breathing", "I don't practice"],
  };

  // Mapping category labels to state keys
  const categoryMapping: { [key: string]: keyof typeof selections } = {
    "What best describes your eating habits?": "eatingHabit",
    "Do you follow any specific diet plan?": "dietHabit",
    "How many cigarettes do you smoke per day on average?": "cigarettesPerDay",
    "How frequently do you drink?": "drinkFrequency",
    "What type of gambling do you engage in?": "gamblingEngage",
    "How would you describe your physical activity level?": "physicalActivityLevel",
    "Do you practice any relaxation techniques?": "relaxationMethods",
  };

  // Handle selection updates
  const handleSelection = (category: string, option: string) => {
    const key = categoryMapping[category];
    if (!key) return;

    setSelections((prev) => ({
      ...prev,
      [key]: option,
    }));
  };

  // Submit data to API
  const handleSubmit = async () => {
    const requestData = {
      profile_lifestyle_id: selections.profile_lifestyle_id || null,
      eating_habit: selections.eatingHabit,
      diet_habit: selections.dietHabit,
      cigarettes_per_day: selections.cigarettesPerDay,
      drink_frequency: selections.drinkFrequency,
      gambling_engage: selections.gamblingEngage,
      physical_activity_level: selections.physicalActivityLevel,
      relaxation_methods: selections.relaxationMethods,
      is_active: true,
      profile_id: selectedProfileID,
    };

    try {
      let result;
      if (requestData.profile_lifestyle_id) {
        console.log("Updating lifestyle with ID:", requestData.profile_lifestyle_id);
        router.push("/createprofile/family");
        // result = await dispatch(updateLifestyleAsync(requestData)).unwrap();
      } else {
        result = await dispatch(createLifestyleAsync(requestData)).unwrap();
        if (result && result.status === 'success') {
          setSelections({...selections, profile_lifestyle_id: result.id});
        }
      }
      if (result) {
        toast.success("Lifestyle information saved successfully!");
        router.push("/createprofile/family");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save lifestyle information");
    }
  };

  // Helper to determine if a button should be selected
  const isOptionSelected = (category: string, option: string, idx: number, options: string[]) => {
    const key = categoryMapping[category];
    const selected = selections[key];
    if (selected && selected.toLowerCase() === "no") {
      return idx === options.length - 1;
    }
    return option?.search(selected) !== -1;
  };

  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(getLifestyleAsync({ profile_id: selectedProfileID })).then((result: any) => {
      if (result?.payload?.data) {
        const data = result.payload.data?.lifestyles[0];
        // console.log("Fetched lifestyle data:", data);
        setSelections(prev => ({
          ...prev,
          profile_lifestyle_id: data.profile_lifestyle_id,
          eatingHabit: data.eating_habit || prev.eatingHabit,
          dietHabit: data.diet_habit || prev.dietHabit,
          cigarettesPerDay: data.cigarettes_per_day || prev.cigarettesPerDay,
          drinkFrequency: data.drink_frequency || prev.drinkFrequency,
          gamblingEngage: data.gambling_engage || prev.gamblingEngage,
          physicalActivityLevel: data.physical_activity_level || prev.physicalActivityLevel,
          relaxationMethods: data.relaxation_methods || prev.relaxationMethods,
        }));
      }
    });
  }, [selectedProfileID, dispatch]);

  return (
    <section className="md:py-5 w-3/4 ps-[50px]">
      <div className="space-y-6">
        {Object.entries(categories).map(([category, options]) => (
          <div key={category}>
            <h3 className="BRCobane18600 mb-3">{category}</h3>
            <div className="flex flex-wrap gap-4">
              {options.map((option, idx) => (
                <button
                  key={option}
                  onClick={() => handleSelection(category, option)}
                  className={`w-[185px] flex p-3 items-start gap-2 flex-[1_0_0] rounded-lg border border-gray-300 font-medium ${
                    isOptionSelected(category, option, idx, options)
                      ? "bg-gradient-to-b from-yellow-400 to-orange-500 text-black"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-[100px]">
        <div className="flex justify-start gap-4">
          <button onClick={handleSubmit} className="yellow-btn hover:bg-orange-600">
            Continue
          </button>
          <button className="gray-btn hover:bg-gray-400">Cancel</button>
        </div>
        <button className="gray-btn hover:bg-gray-400" onClick={() => router.push("/createprofile/family")}>Skip</button>
      </div>
    </section>
  );
};

export default FormSection;