import team1 from "@/public/images/team1.png";
import team2 from "@/public/images/team2.png";
import suresh from "@/public/images/founders/suresh.jpeg";
import Image from "next/image";

const teamMembers = [
  {
    name: "Suresh Thanda",
    position: "Founder & CEO",
    image: suresh,
    alt: "Suresh Thanda",
  },
  {
    name: "Prashanth Sri Perambuduru",
    position: "President",
    image: team2,
    alt: "Prashanth Sri Perambuduru",
  },
  {
    name: "Sadanandam Bharata",
    position: "Vice President",
    image: team2,
    alt: "Sadanandam Bharata",
  },
  {
    name: "Ramesh Thanda",
    position: "CFO India",
    image: team2,
    alt: "Sadanandam Bharata",
  },
];

const MeetTheTeamSection = () => {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] pb-16 sm:pb-20 md:pb-24 lg:pb-28 xl:pb-[120px]">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-[60px]">
        <h2 className="BRCobane56400 text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-2.5 leading-tight">
          Meet the Hearts Behind Chaturvarnam
        </h2>
        <p className="BRCobane18400 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto px-2 sm:px-4 md:px-0 leading-relaxed">
          Our team is a perfect blend of experience, innovation, and cultural
          understanding. Each member brings unique expertise to help you find
          your perfect match.
        </p>
      </div>

      {/* Team Members Grid */}
      <div className="flex flex-col sm:flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-4 lg:gap-6 xl:gap-[24px] px-0 sm:px-4 md:px-8 lg:px-12 xl:px-[100px]">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-3 sm:gap-4 md:gap-[12px] w-full sm:max-w-sm md:flex-1 max-w-xs sm:max-w-none"
          >
            {/* Team Member Image */}
            <div className="relative w-full max-w-[200px] sm:max-w-[220px] md:max-w-[180px] lg:max-w-[220px] xl:max-w-[260px]">
              <Image
                src={member.image}
                alt={member.alt}
                className="w-full h-[200px] sm:h-[220px] md:h-[180px] lg:h-[220px] xl:h-[260px] object-cover rounded-[8px] sm:rounded-[8px] md:rounded-[10px] mb-2 sm:mb-3"
              />
            </div>

            {/* Team Member Info */}
            <div className="text-center">
              <h3 className="BRCobane24400 text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2 md:mb-3 leading-tight">
                {member.name}
              </h3>
              <p className="BRCobane16400 text-sm sm:text-base md:text-sm lg:text-base text-gray-600">
                {member.position}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetTheTeamSection;
