import Image from "next/image";
import dp from "@/public/images/dp.png";
import cardbackground from "@/public/images/h3-bacground-img-1.png";

const TestimonialSection = () => {
  return (
    <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 md:px-8 lg:py-24 lg:px-12 xl:py-[50px] xl:px-[100px] relative">
      <Image
        src={cardbackground}
        alt="card background"
        className="w-[100%] absolute left-0 -top-32 -z-10"
      />
      <div className="text-center w-full max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="BRCobane56400 text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-[50px] leading-tight">
          A Mother's Joy
        </h2>

        {/* Testimonial Card */}
        <div className="carousel-item-stories flex flex-col justify-center items-center  md:gap-4 mx-auto w-full max-w-4xl min-h-[110px] sm:min-h-[250px] md:min-h-[220px] lg:min-h-[306px] px-2 sm:px-4 md:px-6">
          {/* Testimonial Quote */}
          <p className="BRCobane32400 text-[#111] text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-normal w-4/5 sm:w-5/6 md:w-4/5 lg:w-3/4 text-center">
            "Finding a life partner who shares the same values was our biggest
            concern. Chaturvarnam made it simple with their verified profiles
            and family-focused approach."
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mt-1 sm:mt-3 md:mt-3">
            <Image
              src={dp}
              alt="Priya & Rahul profile picture"
              className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex-shrink-0"
            />
            <span className="BRCobane16400 text-xs sm:text-base md:text-base lg:text-lg text-gray-600">
              Priya & Rahul, Matched in 2023
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
