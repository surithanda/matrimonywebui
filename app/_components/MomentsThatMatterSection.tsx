import Image from "next/image";
import moment1 from "@/public/images/moment1.png";
import moment2 from "@/public/images/moment2.png";
import moment3 from "@/public/images/moment3.png";
import moment4 from "@/public/images/moment4.png";

const moments = [
  {
    src: moment1,
    alt: "Moment 1",
  },
  {
    src: moment2,
    alt: "Moment 2",
  },
  {
    src: moment3,
    alt: "Moment 3",
  },
  {
    src: moment4,
    alt: "Moment 4",
  },
];

interface MomentsThatMatterSectionProps {
  heading: string;
}

const MomentsThatMatterSection = ({
  heading,
}: MomentsThatMatterSectionProps) => {
  return (
    <section className="md:px-[100px] md:pb-[100px]">
      <div className="text-center md:mb-[50px]">
        <h2 className="BRCobane56600">{heading}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {moments.map((moment, index) => (
          <div key={index} className="overflow-hidden rounded-[10px]">
            <Image
              src={moment.src}
              alt={moment.alt}
              className="md:w-[320px] md:h-[320px] object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MomentsThatMatterSection;
