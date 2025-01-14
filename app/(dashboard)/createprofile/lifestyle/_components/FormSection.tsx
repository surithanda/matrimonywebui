"use client";
import React, { useState } from "react";

const FormSection = () => {
  const [selections, setSelections] = useState<{
    [key: string]: string | null;
  }>({
    eatingHabits: null,
    dietPlan: null,
    smoking: null,
    drinking: null,
    gambling: null,
    activityLevel: null,
    relaxation: null,
  });

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

  const handleSelection = (category: string, option: string) => {
    setSelections((prev) => ({
      ...prev,
      [category]: option,
    }));
  };
  return (
    <section className="md:py-5 w-4/5 ps-[50px]">
      {/* Multiple-choice categories */}
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
                    selections[category] === option
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
          <button className="yellow-btn hover:bg-orange-600">Continue</button>
          <button className="gray-btn hover:bg-gray-400">Cancel</button>
        </div>
        <button className="gray-btn hover:bg-gray-400">Skip</button>
      </div>
    </section>
  );
};

export default FormSection;
