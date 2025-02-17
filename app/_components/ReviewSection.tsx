import Image from "next/image";
import Link from "next/link";
import React from "react";
import dp from "@/public/images/dp.png";
import cardbackground from "@/public/images/cardbackground.png";
import invitationcardcurtain from "@/public/images/invitationcardcurtain.png";
import invitationcardtop from "@/public/images/invitationcardtop.png";
import invitationcardtext from "@/public/images/invitationcardtext.png";
import invitationcardline from "@/public/images/invitationcardline.png";

const ReviewSection = () => {
  return (
    <div className="review-section relative md:h-[1476px] md:px-[80px] w-full pt-[60px] flex flex-col justify-between items-center">
      <Image
        src={cardbackground}
        alt="card background"
        className="w-[100%] absolute left-0 top-0 h-full -z-10"
      />
      <div className="md:h-1/2 text-center">
        <p className="BRCobane56600 text-[#222] mb-[50px]">
          Love Stories That Started Here
        </p>
        <div className="carousel mx-auto w-fit">
          <div className="carousel-item flex flex-col justify-center items-center h-[306px] w-[1032.212px] gap-6">
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
        {/* check comment for github */}
        <Link href="/register" className="YellowBtn w-fit mx-auto mt-[50px]">
          <span>Begin Your Journey</span>
        </Link>
      </div>
      <div className="flex items-center gap-[50px] mt-64 md:h-1/2">
        <div className="flex flex-col md:ps-[50px] gap-[20px] md:w-[500px] justify-center">
          <p className="BRCobane56600 w-full">
            Find Your <br /> Perfect Match
          </p>
          <p className="BRCobane18400 w-3/4">
            Fill in your details in this auspicious card, and let our
            matchmaking experts help write your beautiful love story.
          </p>
          <Link href="/register" className="BlackBtn">
            Register Now
          </Link>
        </div>
        <div className="invitation-form-div relative z-10 w-[30%] flex flex-col justify-center items-center">
          <h1 className="coloredTextOne w-3/4">
            Our platform goes beyond traditional matchmaking by offering
            personalized tools and insights to help you connect with someone who
            truly complements you. With advanced technology and a human touch,
            we ensure your experience is safe, trusted, and tailored to your
            needs.
          </h1>
          <Image
            src={invitationcardcurtain}
            alt="DP"
            className="w-[229px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
