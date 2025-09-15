"use client";
import React from "react";
import BillingForm from "../_components/BillingForm";
import { useSearchParams } from "next/navigation";
import { plans } from "../_components/PricingCard";

export default function page() {
  const searchParams = useSearchParams();
  console.log("params", searchParams);

  const requiredPlanName = searchParams.get("plan");
  const getPlan = plans.find((pla) => pla.name === requiredPlanName);
  console.log("get", getPlan)
  return (
    <>
      <div className="grid grid-col-3 gap-2">
        <div className="col-span-1"></div>
        <div className="col-span-2">
          <BillingForm />
        </div>
      </div>
    </>
  );
}
