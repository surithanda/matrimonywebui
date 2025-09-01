import Image from "next/image";
import Link from "next/link";
import React from "react";
import dp from "@/public/images/dp.png";
import patternbackground from "@/public/images/pattern.png";
import flowerbackground from "@/public/images/flower.png";

const ReviewSection = () => {
  return (
    <div className="review-section relative md:h-[1476px] md:px-[80px] w-full pt-[60px] flex flex-col justify-between items-center">
      <Image
        src={patternbackground}
        alt="card background"
        className="w-[100%] absolute left-0 top-0 h-full -z-10"
      />
      <Image
        src={flowerbackground}
        alt="card background"
        className="w-[100%] absolute left-0 -top-32 h-full -z-10 scale-x-[-1] opacity-50"
      />
      <div className=" text-center">
        <p
          data-aos="fade-up"
          className="BRCobane56600 text-[#222] mb-[50px] text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl sm:mb-4 md:mb-12 leading-tight"
        >
          Love Stories That Started Here
        </p>
        <div className="carousel mx-auto w-fit">
          <div className="carousel-item flex flex-col justify-center items-center h-[120px] md:h-[206px] lg:h-[306px] w-[1032.212px] gap-0 md:gap-2">
            <p
              className="BRCobane32400 text-[#111] w-[30%] md:w-2/3 lg:w-3/4 text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
              data-aos="fade-down"
            >
              "Finding a life partner who shares the same values was our biggest
              concern. Chaturvarnam made it simple with their verified profiles
              and family-focused approach."
            </p>
            <div
              className="flex items-center gap-5 mt-2 md:mt-0"
              data-aos="fade-down"
            >
              <Image src={dp} alt="DP" className="w-6 h-6 md:w-" />
              <span className="BRCobane16400 text-sm lg:text-xl">
                Priya & Rahul, Matched in 2023
              </span>
            </div>
          </div>
        </div>
        {/* check comment for github */}
        <Link
          href="#"
          className="YellowBtn bg-[#f7ac03] hover:bg-[#e69a00] w-fit mx-auto mt-[50px]"
        >
          <span>Begin Your Journey</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:justify-evenly items-center gap-10 sm:gap-12 lg:gap-16 mt-16 sm:mt-24 md:mt-20 lg:mt-16 xl:mt-12">
        {/* Left Content */}
        <div
          data-aos="fade-right"
          className="flex flex-col bg-white/80  lg:ps-12 lg:py-12 gap-5 md:w-[500px] justify-center items-center lg:items-start text-center lg:text-left"
        >
          <p className="BRCobane56600 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-tight mb-4">
            Find Your <br /> Perfect Match
          </p>
          <p className="BRCobane18400 text-[#222] w-11/12 sm:w-3/4">
            Fill in your details in this auspicious card, and let our
            matchmaking experts help write your beautiful love story.
          </p>
          <Link href="/register" className="BlackBtn mt-4">
            Register Now
          </Link>
        </div>

        {/* Right Content */}
        <div
          data-aos="zoom-in"
          data-aos-delay="150"
          data-aos-duration="2000"
          className="invitation-form-div relative z-10 w-[95%] sm:w-[90%] md:w-[100%] lg:w-full xl:w-[60%] h-[50vh] sm:h-[60vh] md:h-[50vh] lg:h-[527px] xl:h-[650px] flex flex-col justify-center items-center overflow-hidden rounded-[150px_0_150px_0] sm:rounded-[250px_0_250px_0] lg:rounded-[250px_0_250px_0] xl:rounded-[350px_0_350px_0]"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 rounded-[150px_0_150px_0] sm:rounded-[250px_0_250px_0] lg:rounded-[250px_0_250px_0] xl:rounded-[350px_0_350px_0]"></div>

          {/* Text Content */}
          <h1 className="coloredTextOne relative z-10 w-11/12 md:w-3/4 text-base sm:text-lg md:text-xl lg:text-2xl text-white text-center lg:text-left">
            Our platform goes beyond traditional matchmaking by offering
            personalized tools and insights to help you connect with someone who
            truly complements you. With advanced technology and a human touch,
            we ensure your experience is safe, trusted, and tailored to your
            needs.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
