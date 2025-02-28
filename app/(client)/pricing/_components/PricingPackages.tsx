"use client"; // Required for using useState
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CalenderIcon from "@/public/images/calenderIcon.svg";
import BlackCheckIcon from "@/public/images/blackCheckIcon.svg";

function PricingPackages() {
  const router = useRouter();

  // Function to handle plan selection
  const handleSelectPlan = (plan) => {
    localStorage.setItem("selectedPlan", JSON.stringify(plan)); // Store selected plan in localStorage
    router.push("/checkoutpage"); // Navigate to checkout page
  };

  const plans = [
    {
      name: "Basic Plan",
      price: "$9.99",
      duration: "30 days from purchase",
      features: [
        "Access to standard features",
        "Email support",
        "1 device login",
      ],
    },
    {
      name: "Pro Plan",
      price: "$19.99",
      duration: "30 days from purchase",
      features: [
        "All Basic features",
        "Priority support",
        "3 device logins",
        "Ad-free experience",
      ],
    },
    {
      name: "Advanced Plan",
      price: "$29.99",
      duration: "30 days from purchase",
      features: [
        "All Pro features",
        "Exclusive content",
        "5 device login",
        "Personalized recommendations",
      ],
    },
  ];

  return (
    <section className="flex w-full p-[120px_100px] flex-col items-center">
      <div className="pricingPackageRow w-[1200px] flex items-start gap-[30px]">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="pricingCard flex w-[393.33px] h-[460px] p-[32px] flex-col items-start justify-between flex-1"
          >
            <div className="flex flex-col items-start gap-[20px] self-stretch">
              <h1 className="BRCobane20600">{plan.name}</h1>
              <div className="PricingCardInnerDiv flex flex-col items-start gap-[10px] self-stretch">
                <p className="BRCobane24600">
                  <span className="BRCobane40600">{plan.price}</span>/mo
                </p>
                <span className="flex items-center gap-[10px] self-stretch">
                  <Image
                    src={CalenderIcon}
                    alt="Calender Icon"
                    className="w-[24px] h-[24px] mb-0"
                  />
                  {plan.duration}
                </span>
              </div>
              <div className="lineDiv w-full h-[1px]"></div>
              <ul className="flex flex-col items-start gap-[10px] self-stretch">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-[10px] self-stretch BRCobane20600"
                  >
                    <Image
                      src={BlackCheckIcon}
                      alt="Check Icon"
                      className="w-[28px] h-[28px]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            {/* Update button to store selected plan and navigate to checkout */}

            <button
              className="large-white-btn"
              onClick={() => handleSelectPlan(plan)}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PricingPackages;
