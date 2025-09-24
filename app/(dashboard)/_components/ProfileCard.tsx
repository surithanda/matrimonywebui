"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { MdVerified } from "react-icons/md";
import { Button } from "@/components/ui/button"; // adjust path if needed

// utility functions
function getInitials(firstName?: string, lastName?: string) {
  if (!firstName && !lastName) return "?";
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}
function getAvatarColor(name: string) {
  const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}
function getProfileImage(profile: any) {
  return profile.imageSrc || null;
}

interface ProfileCardProps {
  profile: any;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number | string) => void;
  index?: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isFavorite = false,
  onToggleFavorite,
  index = 0,
}) => {
  return (
    <div
      key={profile.id || profile.profile_id || profile.user_id || index}
      className="relative bg-white rounded-md shadow-md overflow-hidden"
    >
      {/* Top Cover Photo */}
      <div className="h-36 w-full overflow-hidden bg-gray-200"></div>

      {/* Favorite + Badges */}
      <div className="flex flex-col justify-center items-center gap-2 my-2 text-white absolute top-0 right-2">
        <button
          onClick={() =>
            onToggleFavorite?.(
              profile.id || profile.profile_id || profile.user_id || index
            )
          }
          className="bg-white rounded-full p-1 hover:scale-110 transition-transform"
        >
          {isFavorite ? (
            <IoIosHeart size={20} className="text-red-500" />
          ) : (
            <IoIosHeartEmpty size={20} className="text-black" />
          )}
        </button>
        <div className="flex flex-col gap-1">
          <MdVerified
            className="inline text-blue-500 cursor-pointer"
            size={14}
            title="Verified Address"
          />
          <MdVerified
            className="inline text-red-500 cursor-pointer"
            size={14}
            title="Verified Education"
          />
          <MdVerified
            className="inline text-orange-500 cursor-pointer"
            size={14}
            title="Verified Contact"
          />
          <MdVerified
            className="inline text-yellow-500 cursor-pointer"
            size={14}
            title="Verified Employment"
          />
          <MdVerified
            className="inline text-sky-500 cursor-pointer"
            size={14}
            title="Verified Family"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="absolute left-3 top-[7rem]">
            {(() => {
              const profileImage = getProfileImage(profile);
              return profileImage ? (
                <Image
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  src={profileImage}
                  alt={profile.first_name || "Profile"}
                  width={96}
                  height={96}
                />
              ) : (
                <div
                  className={`w-24 h-24 flex items-center justify-center text-white text-2xl font-bold rounded-full border-4 border-white ${getAvatarColor(
                    profile.first_name || "Unknown"
                  )}`}
                >
                  {getInitials(profile.first_name, profile.last_name)}
                </div>
              );
            })()}
          </div>

          <div className="flex flex-col ms-[6rem] mt-1">
            <h2
              className="font-bold text-lg"
              style={{ fontFamily: "BR Cobane" }}
            >
              {profile.first_name || profile.name} {profile.last_name}
            </h2>
            <p className="text-gray-500 text-xs min-h-[1rem]">
              {profile.occupation}
              {profile.occupation && profile.city ? " · " : ""}
              {profile.city || profile.location}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around mt-3">
          <div>
            <p className="font-bold text-lg">{profile.age}</p>
            <p className="text-gray-400 text-sm">Age</p>
          </div>
          <div>
            <p className="font-bold text-lg">{profile.religion || "N/A"}</p>
            <p className="text-gray-400 text-sm">Religion</p>
          </div>
          <div>
            <p className="font-bold text-lg">{profile.gender || "N/A"}</p>
            <p className="text-gray-400 text-sm">Gender</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center gap-4 mt-6 overflow-hidden">
          <Button
            className="w-full text-orange-500 border border-orange-500 rounded-md hover:bg-orange-600 hover:text-white transition-colors"
            variant="outline"
            size="md"
          >
            Send Interest
          </Button>

          <Button
            asChild
            className="w-full text-white rounded-md bg-orange-500 hover:bg-orange-600 transition-colors"
            size="md"
          >
            <Link
              href={`/profiles/${
                profile.id || profile.profile_id || profile.user_id || index
              }?fromSearch=true`}
            >
              View Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
