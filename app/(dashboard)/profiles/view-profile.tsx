import React from "react";

const ViewProfileDummy = () => {
  const badgesData = [
    {
      name: "Profiles Reviewed",
      value: 90,
    },
    {
      name: "Profiles Requested for Discussion",
      value: 24,
    },
    {
      name: "Added to Favorites",
      value: 75,
    },
    {
      name: "Rejected",
      value: 34,
    },
    {
      name: "Profiles Shortlisted",
      value: 40,
    },
    {
      name: "Recommended Profiles",
      value: 100,
    },
  ];
  const ProfileBadge = ({ name, value }) => (
    <p className="py-3 px-6 bg-[#FEF6E6] text-slate-600 rounded-md">
      {name} : {value}
    </p>
  );
  const ProfileSection = ({ title, children }) => {
    return (
      <div className="bg-[#F3F3F3] mt-10 rounded-xl overflow-hidden">
        <p className="bg-[#2F3C1F] px-6 py-4 text-white text-xl">{title}</p>
        <div className="p-6">{children}</div>
      </div>
    );
  };
  const ProfileDetail = ({ title, value, colspan = null }) => {
    return (
      <div className={colspan ? `col-span-${colspan}` : ""}>
        <p className="text- text-slate-500">{title}</p>
        <p className="text-black font-semibold mt-1 text-xl">{value}</p>
      </div>
    );
  };
  const profileImages = [
    "/public/assets/profiles/shruti/1.png",
    "/public/assets/profiles/shruti/2.png",
    "/public/assets/profiles/shruti/3.png",
    "/public/assets/profiles/shruti/4.png",
    "/public/assets/profiles/shruti/5.png",
  ];
  return (
    <main className="bg-[url('/assets/bg-pattern.png')] bg-cover pb-10">
      {/* Profile banenr */}
      <div className="bg-[url('/assets/profiles/banner_shruti.png')] h-[380px] bg-cover bg-center bg-no-repeat"></div>
      {/* Porfile Picture */}
      <div className=" -mt-[8%] flex flex-col items-center">
        <img
          src="/assets/profiles/shruti.png"
          className="w-[250px] h-[250px] rounded-full border-white border-[15px] border-solid object-cover"
          alt=""
        />
        <h3 className="text-4xl font-semibold mt-3 mb-4">Shruti K</h3>
      </div>
      <div className="w-[80%] mx-auto">
        <div className="flex justify-center">
          <button className="bg-[#FFB000] px-10 py-3 text-white rounded">
            Connect Now
          </button>
        </div>
        {/* Profile Images */}
        <div className="grid-cols-5 gap-8 grid mt-14 mb-10">
          {profileImages.map((e) => (
            <img src={e} alt="" />
          ))}
        </div>
        <div className="border-slate-400 border"></div>

        {/* Personal Information */}
        <ProfileSection title={"Profile Information"}>
          <div className="grid grid-cols-5 gap-6">
            <ProfileDetail title={"First Name"} value={"Shruti"} />
            <ProfileDetail title={"Last name"} value={"Kinnera"} />
            <ProfileDetail title={"Gender"} value={"Female"} />
            <ProfileDetail title={"DOB"} value={"21-04-1995"} />
            <ProfileDetail title={"Religion"} value={"Hindu"} />
          </div>
          <div className="my-5 border"></div>
          <div className="grid grid-cols-5 gap-6">
            <ProfileDetail title={"Mother Tounge"} value={"Telugu"} />
            <ProfileDetail title={"Marital Status"} value={"Un Married"} />
            <ProfileDetail title={"Height"} value={"5'9''"} />
            <ProfileDetail title={"Weight"} value={"75kg"} />
          </div>
        </ProfileSection>

        {/* Contact Information */}
        <ProfileSection title={"Contact Information"}>
          <div className="grid grid-cols-5 gap-6">
            <ProfileDetail title={"Email"} value={"Shruthi@gmail.com"} />
            <ProfileDetail
              title={"Address"}
              value={"Apt. 459 78727 Littel Estates, Hyderabad"}
              colspan={"2"}
            />
            <ProfileDetail title={"Mobile"} value={"+91 0123456789"} />
            <ProfileDetail title={"Social Media"} value={"Facebook"} />
          </div>
        </ProfileSection>

        {/* Educational Details */}
        <ProfileSection title={"Educational Details"}>
          <div className="grid grid-cols-5 gap-6">
            <ProfileDetail title={"Highest Qualification"} value={"B-Tech"} />
            <ProfileDetail
              title={"College/University"}
              value={"JNTU College"}
            />
            <ProfileDetail
              title={"Field of Study"}
              value={"Software Development"}
            />
          </div>
        </ProfileSection>

        {/* Professional Details */}
        <ProfileSection title={"Professional Details"}>
          <div className="grid grid-cols-4 gap-6">
            <ProfileDetail title={"Job Title"} value={"UI / UX Developer"} />
            <ProfileDetail title={"Company"} value={"Wipro"} />
            <ProfileDetail title={"Annual Income"} value={"10 LPA"} />
          </div>
        </ProfileSection>

        {/* Lifestyle and Hobbies */}
        <ProfileSection title={"Lifestyle and Hobbies"}>
          <div className="grid grid-cols-5 gap-6">
            <ProfileDetail title={"Dietary preferences"} value={"Vegitarian"} />
            <ProfileDetail title={"Smoking habits"} value={"No"} />
            <ProfileDetail title={"Drinking Habits"} value={"No"} />
            <ProfileDetail title={"Other Hobbies"} value={"Eat Egg"} />
            <ProfileDetail title={"Interests"} value={"Gym"} />
          </div>
        </ProfileSection>

        {/* Partner Preferences */}
        <ProfileSection title={"Partner Preferences"}>
          <div className="grid grid-cols-5 gap-10">
            <ProfileDetail title={"Age Range"} value={"28-33"} />
            <ProfileDetail title={"Religion"} value={"Hindu"} />
            <ProfileDetail title={"Location"} value={"Hyderabad"} />
            <ProfileDetail title={"Professional"} value={"Software"} />
          </div>
        </ProfileSection>
        {/* Family information */}
        <ProfileSection title={"Family information"}>
          <div className="grid grid-cols-4 gap-10">
            <ProfileDetail title={"Parents"} value={"Father, Mother"} />
            <ProfileDetail title={"Siblings"} value={"Brother"} />
            <ProfileDetail
              title={"Parents siblings details"}
              value={"1 Sister, 1 Brother"}
            />
          </div>
        </ProfileSection>

        {/* Profile Summary */}
        <ProfileSection title={"Profile Summary"}>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </ProfileSection>
      </div>
    </main>
  );
};

export default ViewProfileDummy;
