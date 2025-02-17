import React from "react";
import HeroSection from "./_components/HeroSection";
import ContactSection from "./_components/ContactSection";
import Image from "next/image";
import Footer from "./_components/Footer";
import contactsectionbackground from "@/public/images/contactsectionbackground.png";

const page = () => {
  return (
    <div className="contact-section">
      <HeroSection />
      <div className="relative">
        <Image
          src={contactsectionbackground}
          alt="contact section background"
          className="h-full w-full absolute bottom-0 left-0 -z-10"
        />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default page;
