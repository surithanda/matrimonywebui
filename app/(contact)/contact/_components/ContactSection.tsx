import React from "react";
import Image from "next/image";
import Link from "next/link";
import invitationcardtop from "@/public/images/invitationcardtop.png";
import phone from "@/public/icons/phone.png";
import email from "@/public/icons/email.png";
import invitationcardcurtain from "@/public/images/invitationcardcurtain.png";

const ContactSection = () => {
  return (
    <section className="flex flex-col px-[100px] w-full">
      <div className="flex items-center justify-center w-full relative">
        <div className="flex flex-col md:w-1/2 justify-center">
          <p className="BRCobane56600 w-full">
            Share your <br />
            details with us
          </p>
          <p className="BRCobane18400 mt-2.5 w-3/4">
            Fill in your details in this auspicious card, and let our
            matchmaking experts help write your beautiful love story.
          </p>
        </div>
        <div className="invitation-form-div relative z-10 w-[30%] flex flex-col justify-center items-center">
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
              <option value="" disabled selected hidden>
                <span className="BRCobane18400">I am looking for</span>
              </option>
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
            </select>
            <select name="city" id="city" className="name-field-contact w-4/5">
              <option value="" disabled selected hidden>
                <span className="BRCobane18400">Preffered City</span>
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
              <option value="" disabled selected hidden>
                <span className="BRCobane18400">
                  How did you hear about us?
                </span>
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
      <div className="bg-white py-[42px] my-28 relative flex items-center justify-between w-full rounded-[20px] overflow-hidden">
        <div className="flex flex-col items-center gap-3 md:w-1/2">
          <Image
            src={phone}
            alt="invitation card top"
            className="w-[84px] h-[84px] object-cover"
          />
          <span className="BRCobane18400">
            Let’s talk about your Perfect Match
          </span>
          <Link href="tel:+91 (425) 786-6010" className="BRCobane24600">
            +91 (425) 786-6010
          </Link>
        </div>
        <div className="flex flex-col items-center gap-3 md:w-1/2">
          <Image
            src={email}
            alt="invitation card top"
            className="w-[84px] h-[84px] object-cover"
          />
          <span className="BRCobane18400">Write to us about your Journey</span>
          <Link href="mailto:+91 (425) 786-6010" className="BRCobane24600">
            surithanda1971@gmail.com
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
