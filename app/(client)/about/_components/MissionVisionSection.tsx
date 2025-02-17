import mission from "@/public/images/mission.png";
import vision from "@/public/images/vision.png";
import Image from "next/image";

const MissionVisionSection = () => {
  return (
    <section className="pt-[120px] pb-[120px] md:px-[100px]">
      <div className="text-center mb-12">
        <p className="BRCobane32400 md:w-[90%] mx-auto">
          Our platform goes beyond traditional matchmaking by offering
          personalized tools and insights to help you connect with someone who
          truly complements you. With advanced technology and a human touch, we
          ensure your experience is safe, trustworthy, and tailored to your
          needs.
        </p>
        <h2 className="BRCobane56400  mt-[120px] mb-[50px]">
          Our Mission and Vision
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-[56px]">
        {/* Mission Section */}
        <div className="aboutCard">
          <Image
            src={mission}
            alt="Mission Illustration"
            className="w-[84px] h-[84px] mb-0"
          />
          <h3 className="BRCobane24400 mb-3">Mission</h3>
          <p className="BRCobane16400 mx-auto md:w-4/5">
            To empower individuals to build lasting relationships based on love,
            trust, and compatibility. We are committed to creating a reliable,
            inclusive, and secure environment that transforms the process of
            finding a life partner into a cherished experience. Every match we
            facilitate is made with care, ensuring it's more than just a
            connection—it's a foundation for lifelong happiness.
          </p>
        </div>

        {/* Vision Section */}
        <div className="aboutCard">
          <Image
            src={vision}
            alt="Mission Illustration"
            className="w-[84px] h-[84px] mb-0"
          />
          <h3 className="BRCobane24400 mb-3">Vision</h3>
          <p className="BRCobane16400 mx-auto md:w-4/5">
            Lorem ipsum dolor sit amet consectetur. Mattis rhoncus est integer
            ut et ut purus sem. Vitae sit lacus dictum mauris convallis in at
            pellentesque. Quis amet fusce augue massa orci. Felis quis ultrices
            viverra interdum aliquet mi orci. Eu enim arcu proin pellentesque
            libero convallis. Tellus tortor scelerisque iaculis eget elementum
            tincidunt egestas nec. Habitant nec neque eu risus viverra orci.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
