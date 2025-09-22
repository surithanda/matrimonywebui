"use client";
import {
  createLifestyleAsync,
  getLifestyleAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Loader from "@/app/(dashboard)/_components/Loader";

interface ILifestyleSelections {
  profile_lifestyle_id: number | null;
  eatingHabit: string;
  dietHabit: string;
  cigarettesPerDay: string;
  drinkFrequency: string;
  gamblingEngage: string;
  physicalActivityLevel: string;
  relaxationMethods: string;
}

const FormSection = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();
  const { selectedProfileID } = useProfileContext();
  const {loading} = useAppSelector((state)=>state.profile)

  const [selections, setSelections] = useState<ILifestyleSelections>({
    profile_lifestyle_id: null,
    eatingHabit: "",
    dietHabit: "",
    cigarettesPerDay: "",
    drinkFrequency: "",
    gamblingEngage: "",
    physicalActivityLevel: "",
    relaxationMethods: "",
  });

  // Define categories and their options
  const categories = {
    "What best describes your eating habits?": [
      "Omnivore",
      "Vegetarian",
      "Vegan",
      "Other",
    ],
    "Do you follow any specific diet plan?": [
      "Low-carb",
      "Keto",
      "Mediterranean",
      "I don't diet",
    ],
    "How many cigarettes do you smoke per day on average?": [
      "0-3",
      "4-6",
      "7-10",
      "I don't smoke",
    ],
    "How frequently do you drink?": ["Daily", "Weekly", "Monthly", "Never"],
    "What type of gambling do you engage in?": [
      "Casino",
      "Sports Betting",
      "Lottery",
      "I don't gamble",
    ],
    "How would you describe your physical activity level?": [
      "Sedentary",
      "Lightly active",
      "Moderately active",
      "Very active",
    ],
    "Do you practice any relaxation techniques?": [
      "Meditation",
      "Yoga",
      "Deep Breathing",
      "I don't practice",
    ],
  };

  // Mapping category labels to state keys
  const categoryMapping: { [key: string]: keyof ILifestyleSelections } = {
    "What best describes your eating habits?": "eatingHabit",
    "Do you follow any specific diet plan?": "dietHabit",
    "How many cigarettes do you smoke per day on average?": "cigarettesPerDay",
    "How frequently do you drink?": "drinkFrequency",
    "What type of gambling do you engage in?": "gamblingEngage",
    "How would you describe your physical activity level?":
      "physicalActivityLevel",
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
        // result = await dispatch(updateLifestyleAsync(requestData)).unwrap();
        result = [];
      } else {
        result = await dispatch(createLifestyleAsync(requestData)).unwrap();
        if (result && result.status === "success") {
          setSelections({ ...selections, profile_lifestyle_id: result.id });
        }
      }
      if (result) {
        toast.success("Lifestyle information saved successfully!");
        router.push("/createprofile/property");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save lifestyle information");
    }
  };

  // Helper to determine if a button should be selected
  const isOptionSelected = (category: string, option: string) => {
    const key = categoryMapping[category];
    return selections[key] === option;
  };

  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(getLifestyleAsync({ profile_id: selectedProfileID })).then(
      (result) => {
        if (result.payload?.success && result.payload.data) {
          const data = result.payload.data.lifestyles?.[0];
          if (data) {
            setSelections({
              profile_lifestyle_id: data.profile_lifestyle_id,
              eatingHabit: data.eating_habit || "",
              dietHabit: data.diet_habit || "",
              cigarettesPerDay: data.cigarettes_per_day || "",
              drinkFrequency: data.drink_frequency || "",
              gamblingEngage: data.gambling_engage || "",
              physicalActivityLevel: data.physical_activity_level || "",
              relaxationMethods: data.relaxation_methods || "",
            });
          }
        }
      }
    );
  }, [selectedProfileID, dispatch]);

    if (loading) {
      return (
        <Loader />
      );
    }

  return (
    <>
      <section className="md:py-5 w-full">
        <div className="space-y-6">
          {Object.entries(categories).map(([category, options]) => (
            <div key={category}>
              <h3 className="BRCobane18600 mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {options.map((option) => {
                  const checked = isOptionSelected(category, option);

                  return (
                    <Label
                      key={option}
                      className={`hover:bg-accent/50 w-full flex items-start gap-3 rounded-lg border p-3 cursor-pointer
          ${
            checked
              ? "border-orange-500 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
              : "border-gray-300 bg-white dark:bg-gray-800"
          }
        `}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() =>
                          handleSelection(category, option)
                        }
                        className="data-[state=checked]:border-orange-500 data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-yellow-400 data-[state=checked]:to-orange-500 data-[state=checked]:text-white dark:data-[state=checked]:border-orange-700 dark:data-[state=checked]:bg-orange-700"
                      />
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                          {option}
                        </p>
                      </div>
                    </Label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="gray-btn hover:bg-gray-400 w-full sm:w-auto">
              Cancel
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            className="yellow-btn hover:bg-orange-600 w-full sm:w-auto"
          >
            Save
          </Button>
          {/* <button
            className="gray-btn hover:bg-gray-400 w-full sm:w-auto"
            onClick={() => router.push("/createprofile/family")}
          >
            Skip
          </button> */}
        </div>
      </section>
    </>
  );
};

export default FormSection;
