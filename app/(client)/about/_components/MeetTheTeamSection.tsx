import team1 from "@/public/images/team1.png";
import team2 from "@/public/images/team2.png";
import team3 from "@/public/images/team3.png";
import team4 from "@/public/images/team4.png";
import Image from "next/image";

const teamMembers = [
  {
    name: "Suresh Thanda",
    position: "Founder & CEO",
    image: team2,
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
];

const MeetTheTeamSection = () => {
  return (
    <section className="md:px-[100px] md:pb-[120px]">
      <div className="text-center md:mb-[60px]">
        <h2 className="BRCobane56400 mb-2.5">
          Meet the Hearts Behind Chaturvarnam
        </h2>
        <p className="BRCobane18400 max-w-2xl mx-auto">
          Our team is a perfect blend of experience, innovation, and cultural
          understanding. Each member brings unique expertise to help you find
          your perfect match.
        </p>
      </div>

      <div className="flex p-[0px_100px] items-center justify-center gap-[24px] self-stretch">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex flex-col items-center gap-[12px]">
            <Image
              src={member.image}
              alt={member.alt}
              className="w-auto h-[260px] text-center object-cover md:rounded-[10px] mb-3"
            />
            <h3 className="BRCobane24400 mb-3">{member.name}</h3>
            <p className="BRCobane16400">{member.position}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetTheTeamSection;
