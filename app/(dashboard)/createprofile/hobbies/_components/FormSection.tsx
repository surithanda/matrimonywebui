"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FormSection = () => {
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const router = useRouter();

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    type: "hobbies" | "interests"
  ) => {
    if (
      event.key === "Enter" &&
      (type === "hobbies" ? hobbyInput.trim() : interestInput.trim())
    ) {
      if (type === "hobbies") {
        setHobbies((prev) => [...prev, hobbyInput.trim()]);
        setHobbyInput(""); // Clear input after adding
      } else {
        setInterests((prev) => [...prev, interestInput.trim()]);
        setInterestInput("");
      }
      event.preventDefault(); // Prevent new line on Enter key
    }
  };

  const removeTag = (type: "hobbies" | "interests", index: number) => {
    if (type === "hobbies") {
      setHobbies((prev) => prev.filter((_, i) => i !== index));
    } else {
      setInterests((prev) => prev.filter((_, i) => i !== index));
    }
  };
  return (
    <section className="md:py-5 w-4/5 mx-[50px]">
      {/* Hobbies Section */}
      <div className="mb-6">
        <h3 className="BRCobane18600 mb-3">Hobbies</h3>
        <div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Type to search"
              className="w-full bg-white border rounded-lg py-2 px-4 text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "hobbies")}
            />
            <div className="flex gap-2 flex-wrap">
              {hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 rounded-[10px] p-[8px_12px] text-sm flex items-center shadow-sm border"
                >
                  {hobby}
                  <button
                    onClick={() => removeTag("hobbies", index)}
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
            <input
              type="text"
              placeholder="Type to search"
              className="w-full bg-white border rounded-lg py-2 px-4 text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "interests")}
            />
            <div className="flex gap-2 flex-wrap">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 rounded-[10px] p-[8px_12px] text-sm flex items-center shadow-sm border"
                >
                  {interest}
                  <button
                    onClick={() => removeTag("interests", index)}
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
