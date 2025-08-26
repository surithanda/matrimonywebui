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
      <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-12 relative">
        <div className="flex flex-col lg:w-1/2 justify-center ">
          <p className="BRCobane56600 text-4xl mt-5 lg:mt-0 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-2.5 leading-tight">
            Share your <br />
            details with us
          </p>
          <p className="BRCobane18400 mt-2.5 w-3/4">
            Fill in your details in this auspicious card, and let our
            matchmaking experts help write your beautiful love story.
          </p>
        </div>
        <div className="invitation-form-div relative z-10 w-full h-[100vh] md:h-[927px] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl flex flex-col justify-center items-center mx-4 sm:mx-6">
          <form
            action=""
            className="flex flex-col z-20 justify-center items-center gap-3 mt-0 w-full"
          >
            <input
              type="text"
              placeholder="Your Name"
              className="name-field-contact w-4/5"
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="name-field-contact w-4/5"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="name-field-contact w-4/5"
            />
            <select name="what" id="what" className="name-field-contact w-4/5">
              <option value="" disabled hidden className="BRCobane18400">
                I am looking for
              </option>
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
            </select>
            <select name="city" id="city" className="name-field-contact w-4/5">
              <option value="" disabled hidden className="BRCobane18400">
                Preffered City
              </option>
              <option value="Bride">Kolkata</option>
              <option value="Groom">Delhi</option>
            </select>

            <textarea
              name="Text1"
              placeholder="Message"
              className="name-field-contact w-4/5"
              rows={4}
            ></textarea>
            <select
              name="hearse"
              id="hearse"
              className="name-field-contact w-4/5"
            >
              <option value="" disabled hidden className="BRCobane18400">
                How did you hear about us?
              </option>
              <option value="Bride">Facebook</option>
              <option value="Groom">Instagram</option>
            </select>

            <div className=" mt-0 flex justify-center items-center w-full">
              <button className="YellowBtn">Register Now</button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="bg-white py-10 mt-16 mb-4 md:mb-5 relative flex flex-col md:flex-row items-center justify-between gap-10 w-full rounded-2xl overflow-hidden">
        <div className="flex flex-col items-center gap-3 w-full md:w-1/2 text-center">
          <Image
            src={phone}
            alt="phone icon"
            className="w-16 h-16 object-cover"
          />
          <span className="BRCobane18400">
            Let’s talk about your Perfect Match
          </span>
          <Link href="tel:+914257866010" className="BRCobane24600">
            +91 (425) 786-6010
          </Link>
        </div>
        <div className="flex flex-col items-center gap-3 w-full md:w-1/2 text-center">
          <Image
            src={email}
            alt="email icon"
            className="w-16 h-16 object-cover"
          />
          <span className="BRCobane18400">Write to us about your Journey</span>
          <Link
            href="mailto:surithanda1971@gmail.com"
            className="BRCobane24600"
          >
            surithanda1971@gmail.com
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
