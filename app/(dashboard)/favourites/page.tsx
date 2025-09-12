"use client";

import React, { useState } from "react";
import profile1 from "@/public/images/dashboard/profile1.png";
import profile2 from "@/public/images/dashboard/profile2.png";
import profile3 from "@/public/images/dashboard/profile3.png";
import profile4 from "@/public/images/dashboard/profile4.png";
import ProfileCard from "../_components/ProfileCard";

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([
    { id: 1, name: "Shruti K.", age: 24, location: "Naperville", imageSrc: profile1, religion: "Hindu", gender: "Female" },
    { id: 2, name: "Rashmi", age: 23, location: "Pinnacles", imageSrc: profile2, religion: "Hindu", gender: "Female" },
    { id: 3, name: "Kaushik", age: 28, location: "Toledo", imageSrc: profile3, religion: "Hindu", gender: "Male" },
    { id: 4, name: "Shruti K.", age: 24, location: "Austin", imageSrc: profile4, religion: "Hindu", gender: "Female" },
  ]);

  const handleToggleFavorite = (id: string | number) => {
    setFavourites(prev => prev.filter(profile => profile.id !== Number(id)));
  };

  return (
    <div className="dashboard-background md:px-[60px] lg:px-[60px] 2xl:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-16">
      <div className="flex justify-between items-center w-full">
        <h2 className="dmserif32600">Favourites</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {favourites.map((profile, index) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isFavorite={true}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default FavouritesPage;
