import React from "react";
import Image from "next/image";
import Link from "next/link";
import solarUser from "@/public/images/solar-user.png";
import analysisCard from "@/public/images/analysisCard.png";

function adminpanel() {
  return (
    <div className="mainAdminPanel">
      <div className="adminmainInnerDiv flex flex-col items-start gap-[16px] self-stretch">
        <h1 className="BRCobane28600">Admin Dashboard</h1>
        <div className="adminDashCardDiv flex flex-col items-start gap-[16px] self-stretch">
          <div className="adminDashCardRowOne flex items-center gap-[16px] self-stretch">
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
          </div>
          <div className="adminDashCardRowOne flex items-center gap-[16px] self-stretch">
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
            <div className="adminDashCard flex p-[24px] justify-between items-end flex-1">
              <div className="adminDashcardHeading flex flex-col items-start gap-[6px]">
                <span className="BRCobane16400">Users</span>
                <h4 className="BRCobane20600">1,280</h4>
              </div>
              <Image
                src={solarUser}
                alt=""
                className="md:w-[28.8px] md:h-[28.8px]"
              />
            </div>
          </div>
        </div>
      </div>
      <Image src={analysisCard} alt="" className="md:w-[1200px] md:h-[350px]" />
    </div>
  );
}

export default adminpanel;
