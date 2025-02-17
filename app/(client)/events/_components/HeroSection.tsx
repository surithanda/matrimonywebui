import React from "react";

const HeroSection = () => {
  return (
    <section className="event-hero md:h-[600px] px-[100px] flex flex-col items-start justify-center">
      <div className="aboutHeadingDiv md:w-[550px] md:space-y-[20px]">
        <h1 className="BRCobane64600 text-[#fafafa] mt-32 mb-3">
          Creating Meaningful Connections
        </h1>
        <p className="BRCobane18400Light md:w-[450px]">
          Join Our Thoughtfully Curated Events Where Matches Are Made in Person,
          Traditions Are Celebrated, and Families Come Together to Create
          Beautiful Beginnings. Experience the Joy of Finding 'The One' in an
          Atmosphere of Trust and Celebration.
        </p>
        <button className="WhiteBtn">Find an event near you</button>
      </div>
    </section>
  );
};

export default HeroSection;
