"use client";

import Image from "next/image";
import Link from "next/link";
import profile1 from "@/public/images/dashboard/profile1.png";
import profile2 from "@/public/images/dashboard/profile2.png";
import profile3 from "@/public/images/dashboard/profile3.png";
import { useAppSelector } from "@/app/store/store";

// Profile Data for dynamic rendering
const profilesData = [
  {
    name: "Shruti Sinha",
    age: 24,
    location: "Naperville",
    imageSrc: profile1,
  },
  {
    name: "Rashmi Sinha",
    age: 22,
    location: "Pinnacles",
    imageSrc: profile2,
  },
  {
    name: "Kaushik Sinha",
    age: 28,
    location: "Toledo",
    imageSrc: profile3,
  },
];

const ProfileSection = () => {
  //@ts-ignore
  const user = useAppSelector((state) => state.auth.userData)?.user;
  const faqData = [
    {
      question: "How do I create a new profile?",
      answer:
        "Navigate to 'Add Profile' and fill out the basic details form. Upload at least 2 recent photos and complete sections for education, career, family background, and partner preferences.",
    },
    {
      question: "What are the privacy settings available?",
      answer:
        "Control who sees your profile through Privacy Settings. Options include 'Everyone', 'Premium Members Only', 'Connected Matches Only', or 'Hidden'. You can also block specific profiles.",
    },
    {
      question: "How do I search for matches?",
      answer:
        "Use the Search tab with filters for age, location, education, profession, and more. Save searches for quick access. Premium members get advanced filters like horoscope matching.",
    },
    {
      question: "What does the 'Interest Sent' status mean?",
      answer:
        "When you send an interest, the status shows as 'Pending' until they respond. 'Accepted' means they’re interested too, while 'Declined' means they’ve passed.",
    },
    {
      question: "How do I verify my profile?",
      answer:
        "Submit government ID proof through the Verification Center. Options include passport, driver’s license, or national ID. Verification badge appears within 24-48 hours.",
    },
    {
      question: "What’s included in premium membership?",
      answer:
        "Premium gives unlimited messages, contact viewing, advanced search filters, profile highlighting, and priority customer support. Access detailed horoscopes and family background info.",
    },
    {
      question: "Can I edit my profile after creation?",
      answer:
        "Yes, click 'Edit Profile' to update any section. Photos can be added/removed anytime. Major changes like marital status require verification.",
    },
    {
      question: "How do I report fake profiles?",
      answer:
        "Click the 'Report' button on any profile and select the reason. Our team reviews reports within 24 hours. Include screenshots for faster action.",
    },
  ];

  return (
    <section className="flex flex-col md:gap-8 w-full">
      <div className="flex flex-row md:gap-8 w-full">
        {/* Profiles Section */}
        <div className="dashboard-sections md:w-4/5">
          <div className="flex justify-between items-center w-full">
            <h2 className="dmserif32600">Profiles</h2>
            <Link href="/createprofile">
              <button className="px-5 py-3 bg-gray-950 text-white rounded-[12px] hover:bg-gray-600">
                Add Profile
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profilesData.map((profile, index) => (
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info Section */}
 {/* Account Info Section */}
 <div className="dashboard-sections md:w-1/5">
          <h2 className="dmserif32600">Account Info</h2>
          <div className="dashboard-inner-sections">
            <p className="font-medium">
              <span>Full Name:</span>
              <span className="text-gray-600">{user?.full_name || 'N/A'}</span>
            </p>
            <p className="font-medium">
              <span>Email:</span>
              <span className="text-gray-600">{user?.email || 'N/A'}</span>
            </p>
            <p className="font-medium">
              <span>Phone:</span>{" "}
              <span className="text-gray-600">{user?.phone || 'N/A'}</span>
            </p>
            <p className="font-medium">
              <span>Date of Birth:</span>{" "}
              <span className="text-gray-600">{user?.date_of_birth || 'N/A'}</span>
            </p>
            <p className="font-medium">
              <span>Address:</span>
              <span className="text-gray-600">{user?.address || 'N/A'}</span>
            </p>
            <p className="font-medium">
              <span>City:</span>{" "}
              <span className="text-gray-600">{user?.city || 'N/A'}</span>
            </p>
            <p className="font-medium">
              <span>State:</span>{" "}
              <span className="text-gray-600">{user?.state || 'N/A'}</span>
            </p>
            <p className="font-medium">
              <span>Country:</span>
              <span className="text-gray-600">{user?.country || 'N/A'}</span>
            </p>
            <p className="font-medium">
              <span>Zip Code:</span>{" "}
              <span className="text-gray-600">{user?.zip_code || 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>
      {/* Account Info Section */}
      <div className="dashboard-sections md:w-full">
        <h2 className="dmserif32600">Frequently Asked Questions</h2>
        <div className="flex flex-col md:h-[700px] flex-wrap md:gap-6">
          {faqData.map((faq, index) => (
            <div key={index} className="dashboard-inner-sections md:w-[49%]">
              <h3 className="BRCobane18600">{faq.question}</h3>
              <p className="BRCobane18500 opacity-50">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
