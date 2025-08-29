import mission from "@/public/images/mission.png";
import vision from "@/public/images/vision.png";
import Image from "next/image";

const MissionVisionSection = () => {
  return (
    <section className="pt-16 pb-16 sm:pt-20 sm:pb-20 md:pt-[120px] md:pb-[120px] px-4 sm:px-8 md:px-[100px]">
      <div className="text-center mb-8 sm:mb-12">
        <p className="BRCobane32400 text-base sm:text-lg md:text-xl lg:text-3xl xl:text-[34px] md:w-[90%] mx-auto leading-relaxed">
          Our platform goes beyond traditional matchmaking by offering
          personalized tools and insights to help you connect with someone who
          truly complements you. With advanced technology and a human touch, we
          ensure your experience is safe, trustworthy, and tailored to your
          needs.
        </p>
        <h2 className="BRCobane56400 mt-16 sm:mt-20 md:mt-[120px] mb-8 sm:mb-12 md:mb-[50px] text-4xl sm:text-3xl md:text-5xl lg:text-6xl">
          Our Mission and Vision
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-[56px]">
        {/* Mission Section */}
        <div className="aboutCard text-center md:text-left">
          <Image
            src={mission}
            alt="Mission Illustration"
            className="w-16 h-16 sm:w-[72px] sm:h-[72px] md:w-[84px] md:h-[84px] mb-4 mx-auto md:mx-0"
          />
          <h3 className="BRCobane24400 mb-3 text-lg sm:text-xl md:text-2xl">
            Mission
          </h3>
          <p className="BRCobane16400 text-sm sm:text-base leading-relaxed mx-auto md:mx-0 md:w-4/5">
            To empower individuals to build lasting relationships based on love,
            trust, and compatibility. We are committed to creating a reliable,
            inclusive, and secure environment that transforms the process of
            finding a life partner into a cherished experience. Every match we
            facilitate is made with care, ensuring it's more than just a
            connection—it's a foundation for lifelong happiness.
          </p>
        </div>

        {/* Vision Section */}
        <div className="aboutCard text-center md:text-left">
          <Image
            src={vision}
            alt="Vision Illustration"
            className="w-16 h-16 sm:w-[72px] sm:h-[72px] md:w-[84px] md:h-[84px] mb-4 mx-auto md:mx-0"
          />
          <h3 className="BRCobane24400 mb-3 text-lg sm:text-xl md:text-2xl">
            Vision
          </h3>
          <p className="BRCobane16400 text-sm sm:text-base leading-relaxed mx-auto md:mx-0 md:w-4/5">
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
