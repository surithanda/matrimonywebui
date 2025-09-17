"use client";

import React, { useEffect, useState } from "react";
import profile1 from "@/public/images/dashboard/profile1.png";
import profile2 from "@/public/images/dashboard/profile2.png";
import profile3 from "@/public/images/dashboard/profile3.png";
import profile4 from "@/public/images/dashboard/profile4.png";
import ProfileCard from "../_components/ProfileCard";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { getFavoritesAsync } from "@/app/store/features/profileSlice";

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProfileID } = useProfileContext();

  useEffect(() => {
    const loadFavorites = async () => {
      if (selectedProfileID > 0) {
        const response = await dispatch(
          getFavoritesAsync({ profileId: selectedProfileID })
        ).unwrap();
        console.log("favorite", response.data);
        setFavourites(response.data.map((item: any) => item.to_profile_id));
      }
    };
    console.log(selectedProfileID);
    loadFavorites();
  }, [dispatch, selectedProfileID]);

  // const handleToggleFavorite = (id: string | number) => {
  //   setFavourites((prev) =>
  //     prev.filter((profile) => profile.id !== Number(id))
  //   );
  // };

  

  return (
    <div className="dashboard-background md:px-[60px] lg:px-[60px] 2xl:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-16">
      <div className="flex justify-between items-center w-full">
        <h2 className="dmserif32600">Favourites</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* {favourites.map((profile, index) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isFavorite={true}
            onToggleFavorite={handleToggleFavorite}
          />
        ))} */}
      </div>
    </div>
  );
};

export default FavouritesPage;
