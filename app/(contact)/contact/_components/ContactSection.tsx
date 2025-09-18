import React from "react";
import Image from "next/image";
import Link from "next/link";
import invitationcardtop from "@/public/images/invitationcardtop.png";
import phone from "@/public/icons/phone.png";
import email from "@/public/icons/email.png";
import invitationcardcurtain from "@/public/images/invitationcardcurtain.png";

const ContactSection = () => {
  return (
    <section className="flex flex-col px-4 sm:px-6 md:px-10 lg:px-20 w-full">
      <div className="flex flex-col lg:flex-row items-center justify-around w-full gap-10  px-4 sm:px-6 lg:px-12 py-20">
        {/* Left Section */}
        <div data-aos='fade-right' className="flex flex-col lg:w-1/1 text-center lg:text-left">
          <p className="BRCobane56600 text-5xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-800 mb-4">
            Share your <br /> details with us
          </p>
          <p className="BRCobane18400 text-gray-600 text-lg max-w-lg mx-auto lg:mx-0">
            Fill in your details in this auspicious card, and let our
            matchmaking experts help write your beautiful love story.
          </p>
        </div>

        {/* Right Section (Form) */}
        <div data-aos='fade-left' className="bg-white shadow-2xl shadow-gray-300/50 rounded-2xl w-full max-w-3xl p-6 sm:p-8 border">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <input
              type="text"
              placeholder="Your Name"
              className="name-field-contact w-full"
            />

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone Number"
              className="name-field-contact w-full"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              className="name-field-contact w-full sm:col-span-2"
            />

            {/* Looking For */}
            <select name="what" id="what" className="name-field-contact w-full">
              <option value="" disabled hidden>
                I am looking for
              </option>
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
            </select>

            {/* Preferred City */}
            <select name="city" id="city" className="name-field-contact w-full">
              <option value="" disabled hidden>
                Preferred City
              </option>
              <option value="Kolkata">Kolkata</option>
              <option value="Delhi">Delhi</option>
            </select>

            {/* Message */}
            <textarea
              name="Text1"
              placeholder="Message"
              className="name-field-contact w-full sm:col-span-2"
              rows={4}
            ></textarea>

            {/* Hear About */}
            <select
              name="hearse"
              id="hearse"
              className="name-field-contact w-full sm:col-span-2"
            >
              <option value="" disabled hidden>
                How did you hear about us?
              </option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
            </select>

            {/* Button */}
            <button className="YellowBtn bg-[#f7ac03] hover:bg-[#e69a00] mt-4 w-full sm:col-span-2">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Contact Info Section */}
      <div data-aos='fade-down' className="bg-white shadow-lg border py-10 mt-16 mb-4 md:mb-5 relative flex flex-col md:flex-row items-center justify-between gap-10 w-full rounded-2xl overflow-hidden">
        <div className="flex flex-col items-center gap-3 w-full md:w-1/2 text-center">
          <Image
            src={phone}
            alt="phone icon"
            className="w-16 h-16 object-cover"
          />
          <span className="BRCobane18400 text-[#222]">
            Let’s talk about your Perfect Match
          </span>
          <Link href="tel:+832-547-8554" className="BRCobane24600">
            +(832) 547-8554
          </Link>
        </div>
        <div className="flex flex-col items-center gap-3 w-full md:w-1/2 text-center">
          <Image
            src={email}
            alt="email icon"
            className="w-16 h-16 object-cover"
          />
          <span className="BRCobane18400 text-[#222]">Write to us about your Journey</span>
          <Link href="mailto:info@matimony.org" className="BRCobane24600">
            info@matimony.org
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
