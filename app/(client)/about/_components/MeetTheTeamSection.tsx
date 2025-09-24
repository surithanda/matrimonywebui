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
      <div
        className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-[60px]"
        data-aos="fade-up"
      >
        <h2 className="BRCobane56400 text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-2.5 leading-tight">
          Meet the Hearts Behind Chaturvarnam
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="150"
          data-aos-duration="1000"
          className="BRCobane18400 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto px-2 sm:px-4 md:px-0 leading-relaxed"
        >
          Our team is a perfect blend of experience, innovation, and cultural
          understanding. Each member brings unique expertise to help you find
          your perfect match.
        </p>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-8 md:gap-6 lg:gap-8 xl:gap-[24px] px-0 sm:px-4 md:px-8 lg:px-12 xl:px-[100px]">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            data-aos="zoom-in"
            data-aos-delay={`${index * 200}`} // 👈 Staggered delay
            data-aos-duration="1000"
            className="flex flex-col items-center gap-3 sm:gap-4 md:gap-[12px] w-full sm:max-w-sm md:flex-1 max-w-xs"
          >
            {/* Team Member Image */}
            <div className="relative w-[200px] sm:w-[220px] md:w-[180px] lg:w-[220px] xl:w-[250px] aspect-square rounded-full border-2 border-gray-300 overflow-hidden">
              <Image
                src={member.image}
                alt={member.alt}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Team Member Info */}
            <div className="text-center">
              <h3 className="BRCobane24400 text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2 md:mb-1 leading-tight">
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
