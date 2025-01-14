import ambitionmarriage from "@/public/images/ambitionmarriage.png";
import modernwedding from "@/public/images/modernwedding.png";
import weddingproposal from "@/public/images/weddingproposal.png";
import lantern from "@/public/images/lantern.png";
import Image from "next/image";
const WeddingWisdomSection = () => {
  return (
    <section className="text-center py-[120px] px-[100px] relative">
      <Image
        src={lantern}
        alt="Lantern"
        className="w-[210px] h-[300px] mx-auto absolute -top-4 left-0"
      />
      <h2 className="BRCobane56600 mb-12">
        Wedding Wisdom:
        <br /> Stories, Traditions & Modern Love
      </h2>

      <div className="flex gap-6 text-left">
        <div className="grow">
          <Image
            src={modernwedding}
            alt="The Modern Indian Wedding"
            className="w-full h-64 object-cover rounded-lg"
          />
          <h3 className="BRCobane24600 mt-4">
            The Modern Indian Wedding: Where Tradition Meets Instagram
          </h3>
          <p className="mt-4 BRCobane16400">
            Discover how today's couples are blending age-old customs with
            contemporary celebrations.
          </p>
        </div>

        <div className="grow mx-auto">
          <Image
            src={weddingproposal}
            alt="7 Essential Questions to Ask"
            className="w-full h-64 object-cover rounded-lg"
          />
          <h3 className="BRCobane24600 mt-4">
            7 Essential Questions to Ask Before Saying 'Yes' to Forever
          </h3>
          <p className="mt-4 BRCobane16400">
            Beyond horoscope matching, these crucial conversations can make or
            break your future together.
          </p>
        </div>

        <div className="grow mx-auto">
          <Image
            src={ambitionmarriage}
            alt="Love in the Time of Career Goals"
            className="w-full h-64 object-cover rounded-lg"
          />
          <h3 className="BRCobane24600 mt-4">
            Love in the Time of Career Goals: Balancing Marriage & Ambition
          </h3>
          <p className="mt-4 BRCobane16400">
            Meet power couples who are redefining traditional marriage dynamics.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeddingWisdomSection;
