"use client";
import { createLifestyleAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const FormSection = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();

  const [selections, setSelections] = useState<{
    eatingHabit: string | null;
    dietHabit: string | null;
    cigarettesPerDay: string | null;
    drinkFrequency: string | null;
    gamblingEngage: string | null;
    physicalActivityLevel: string | null;
    relaxationMethods: string | null;
  }>({
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
      profile_lifestyle_id: 1, // Static ID (should be dynamic if needed)
      eating_habit: selections.eatingHabit || "Omnivore",
      diet_habit: selections.dietHabit || "Balanced",
      cigarettes_per_day: selections.cigarettesPerDay || "0",
      drink_frequency: selections.drinkFrequency || "Occasionally",
      gambling_engage: selections.gamblingEngage || "No",
      physical_activity_level: selections.physicalActivityLevel || "Moderate",
      relaxation_methods: selections.relaxationMethods || "Meditation",
      is_active: true,
      profile_id: 46, // Ensure this is dynamic if needed
    };

    try {
      const result = await dispatch(createLifestyleAsync(requestData)).unwrap();
      if (result) {
        toast.success("Lifestyle information saved successfully!");
        router.push("/createprofile/family");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save lifestyle information");
    }
  };

  return (
    <section className="md:py-5 w-4/5 ps-[50px]">
      <div className="space-y-6">
        {Object.entries(categories).map(([category, options]) => (
          <div key={category}>
            <h3 className="BRCobane18600 mb-3">{category}</h3>
            <div className="flex flex-wrap gap-4">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelection(category, option)}
                  className={`w-[185px] flex p-3 items-start gap-2 flex-[1_0_0] rounded-lg border border-gray-300 font-medium ${
                    selections[categoryMapping[category]] === option
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