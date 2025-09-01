import Image from "next/image";
import moment1 from "@/public/images/moment1.png";
import moment2 from "@/public/images/moment2.png";
import moment3 from "@/public/images/moment3.png";
import moment4 from "@/public/images/moment4.png";

const moments = [
  {
    src: moment1,
    alt: "Moment 1 - Beautiful wedding ceremony",
  },
  {
    src: moment2,
    alt: "Moment 2 - Happy couple celebration",
  },
  {
    src: moment3,
    alt: "Moment 3 - Traditional wedding rituals",
  },
  {
    src: moment4,
    alt: "Moment 4 - Family gathering moment",
  },
];

interface MomentsThatMatterSectionProps {
  heading: string;
}

const MomentsThatMatterSection = ({
  heading,
}: MomentsThatMatterSectionProps) => {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-[100px] bg-gradient-to-b from-transparent to-gray-50/30">
      {/* Section Heading */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-[50px]">
        <h2 className="BRCobane56600 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight max-w-4xl mx-auto px-2">
          {heading}
        </h2>
      </div>

      {/* Moments Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 max-w-8xl mx-auto">
        {moments.map((moment, index) => (
          <div
            key={index}
            data-aos={index % 2 === 0 ? "flip-left" : "flip-right"}
            data-aos-delay={index * 200} 
            className="group overflow-hidden rounded-[10px] sm:rounded-[12px] md:rounded-[16px] aspect-square w-full max-w-xs mx-auto sm:max-w-none shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <Image
              src={moment.src}
              alt={moment.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={index < 2}
              quality={85}
            />
          </div>
        ))}
      </div>

      {/* Optional: View More Button for mobile */}
      {/* <div className="text-center mt-8 sm:mt-10 md:hidden">
        <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200">
          View More Moments
        </button>
      </div> */}
    </section>
  );
};

export default MomentsThatMatterSection;
