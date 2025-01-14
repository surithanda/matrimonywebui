import Image from "next/image";
import dp from "@/public/images/dp.png"; // Replace with your actual image path

const TestimonialSection = () => {
  return (
    <section className="md:py-[120px] md:px-[100px]">
      <div className="text-center w-full">
        <h2 className="BRCobane56400 md:mb-[50px]">A Mother's Joy</h2>
        <div className="carousel-item-stories flex flex-col justify-center items-center h-[306px] w-[1032.212px] gap-6 mx-auto">
          <p className="BRCobane32400 text-[#111] w-3/4">
            "Finding a life partner who shares the same values was our biggest
            concern. Chaturvarnam made it simple with their verified profiles
            and family-focused approach."
          </p>
          <div className="flex items-center gap-5">
            <Image src={dp} alt="DP" className="w-8 h-8" />
            <span className="BRCobane16400">
              Priya & Rahul, Matched in 2023
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
