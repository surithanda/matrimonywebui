import ambitionmarriage from "@/public/images/ambitionmarriage.png";
import modernwedding from "@/public/images/modernwedding.png";
import weddingproposal from "@/public/images/weddingproposal.png";
import lantern from "@/public/images/lantern.png";
import Image from "next/image";

const WeddingWisdomSection = () => {
  return (
    <section className="text-center py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 relative overflow-hidden">
      {/* Lantern decoration - hidden on mobile, positioned responsively */}
      <Image
        src={lantern}
        alt="Lantern"
        className="hidden lg:block w-32 h-44 xl:w-52 xl:h-72 2xl:w-60 2xl:h-80 absolute -top-2 lg:-top-4 left-0 xl:left-4 2xl:left-8 z-10"
      />

      {/* Main heading */}
      <h2 className=" mb-8 sm:mb-10 md:mb-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight px-4 sm:px-0 font-bold">
        Wedding Wisdom:
        <br />
        Stories, Traditions & Modern Love
      </h2>

      {/* Cards container */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 text-left max-w-7xl mx-auto">
        {/* Card 1 */}
        <article className="group cursor-pointer">
          <div className="overflow-hidden rounded-lg mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Image
              src={modernwedding}
              alt="The Modern Indian Wedding"
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="BRCobane24600 mb-3 md:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug">
            The Modern Indian Wedding: Where Tradition Meets Instagram
          </h3>
          <p className="BRCobane16400 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            Discover how today's couples are blending age-old customs with
            contemporary celebrations.
          </p>
        </article>

        {/* Card 2 */}
        <article className="group cursor-pointer">
          <div className="overflow-hidden rounded-lg mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Image
              src={weddingproposal}
              alt="7 Essential Questions to Ask"
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="BRCobane24600 mb-3 md:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug">
            7 Essential Questions to Ask Before Saying 'Yes' to Forever
          </h3>
          <p className="BRCobane16400 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            Beyond horoscope matching, these crucial conversations can make or
            break your future together.
          </p>
        </article>

        {/* Card 3 */}
        <article className="group cursor-pointer md:col-span-2 xl:col-span-1">
          <div className="overflow-hidden rounded-lg mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Image
              src={ambitionmarriage}
              alt="Love in the Time of Career Goals"
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="BRCobane24600 mb-3 md:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug">
            Love in the Time of Career Goals: Balancing Marriage & Ambition
          </h3>
          <p className="BRCobane16400 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            Meet power couples who are redefining traditional marriage dynamics.
          </p>
        </article>
      </div>
    </section>
  );
};

export default WeddingWisdomSection;
