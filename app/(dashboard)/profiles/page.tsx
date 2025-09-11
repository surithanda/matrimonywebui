import React from "react";
import Image from "next/image";
import profile1 from "@/public/images/dashboard/profile1.png";
import profile2 from "@/public/images/dashboard/profile2.png";
import profile3 from "@/public/images/dashboard/profile3.png";
import profile4 from "@/public/images/dashboard/profile4.png";

const page = () => {
  const recommendedProfiles = [
    {
      name: "Shruti K.",
      age: 24,
      location: "Naperville",
      imageSrc: profile1,
    },
    {
      name: "Rashmi",
      age: 23,
      location: "Pinnacles",
      imageSrc: profile2,
    },
    {
      name: "Kaushik",
      age: 28,
      location: "Toledo",
      imageSrc: profile3,
    },
    {
      name: "Shruti K.",
      age: 24,
      location: "Austin",
      imageSrc: profile4,
    },
    {
      name: "Rashmi",
      age: 23,
      location: "Pinnacles",
      imageSrc: profile2,
    },
  ];
  return (
    <div className="dashboard-background md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-16">
      <div className="flex justify-between items-center w-full">
        <h2 className="dmserif32600" style={{ fontFamily: "BR Cobane" }}>Profiles</h2>
        <button className="yellow-btn">Add Profile</button>
      </div>
      <div className="flex gap-6">
        {recommendedProfiles.map((profile, index) => (
          <div
            key={index}
            className="relative bg-white rounded-lg shadow-md overflow-hidden w-fit"
          >
            <Image
              src={profile.imageSrc}
              alt={profile.name}
              className="w-[282px] h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full flex justify-between p-4">
              <div>
                <p className="BRCobane20600 text-white">
                  {profile.name}, {profile.age}
                </p>
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M9 2.02463C5.89465 2.02463 3.375 4.29256 3.375 7.08713C3.375 11.5871 9 17.7746 9 17.7746C9 17.7746 14.625 11.5871 14.625 7.08713C14.625 4.29256 12.1054 2.02463 9 2.02463ZM9 9.89963C8.55499 9.89963 8.11998 9.76767 7.74997 9.52043C7.37996 9.2732 7.09157 8.9218 6.92127 8.51067C6.75097 8.09953 6.70642 7.64713 6.79323 7.21067C6.88005 6.77422 7.09434 6.37331 7.40901 6.05864C7.72368 5.74397 8.12459 5.52968 8.56105 5.44286C8.9975 5.35604 9.4499 5.4006 9.86104 5.5709C10.2722 5.7412 10.6236 6.02958 10.8708 6.39959C11.118 6.76961 11.25 7.20462 11.25 7.64963C11.2493 8.24616 11.0121 8.81808 10.5903 9.2399C10.1685 9.66171 9.59654 9.89898 9 9.89963Z"
                      fill="white"
                    />
                  </svg>
                  <p className="BRCobane14500">{profile.location}</p>
                </div>
              </div>
              <button className="message-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M5.625 19.0246C5.45924 19.0246 5.30027 18.9588 5.18306 18.8416C5.06585 18.7244 5 18.5654 5 18.3996V15.8996H4.0625C3.31683 15.8988 2.60194 15.6022 2.07468 15.075C1.54741 14.5477 1.25083 13.8328 1.25 13.0871V5.58713C1.25083 4.84146 1.54741 4.12657 2.07468 3.5993C2.60194 3.07204 3.31683 2.77545 4.0625 2.77463H15.9375C16.6832 2.77545 17.3981 3.07204 17.9253 3.5993C18.4526 4.12657 18.7492 4.84146 18.75 5.58713V13.0871C18.7492 13.8328 18.4526 14.5477 17.9253 15.075C17.3981 15.6022 16.6832 15.8988 15.9375 15.8996H9.59922L6.02539 18.8797C5.91292 18.9732 5.77128 19.0245 5.625 19.0246Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
