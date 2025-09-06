import React from "react";
import HeroSection from "./_components/HeroSection";
import ContactSection from "./_components/ContactSection";
import Image from "next/image";
import Footer from "../../_components/Footer";
import contactsectionbackground from "@/public/images/flower.png";

const page = () => {
  return (
    <div className="contact-section">
      <HeroSection />
      <div className="relative">
        <Image
          src={contactsectionbackground}
          alt="contact section background"
          className="h-auto lg:h-screen w-full absolute top-0 lg:-top-40 left-0 -z-10 opacity-50"
        />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default page;
