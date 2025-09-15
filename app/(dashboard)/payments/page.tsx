"use client";
import React, { useState } from "react";
import { PricingCard } from "./_components/PricingCard";
import BillingForm from "./_components/BillingForm";
import { Button } from "@/components/ui/button";
import SuccessModal from "./_components/SuccessModal";

const Page = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard-background md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-20">
      <div className="flex justify-center items-center w-full">
        <h2
          className="text-pretty text-4xl font-bold lg:text-6xl"
          style={{ fontFamily: "BR Cobane" }}
        >
          Payments Plans
        </h2>
      </div>
          {/* <BillingForm /> */}
          <PricingCard />

      {/* test button to trigger modal */}
      {/* <div className="mt-6">
        <Button onClick={() => setOpen(true)}>Test Success Modal</Button>
      </div> */}

      {/* payment success modal */}
      {/* <SuccessModal
        open={open}
        onOpenChange={setOpen}
        plan={{
          name: "Pro Plan",
          price: "$99.99/mo",
          duration: "30 days",
        }}
      /> */}
    </div>
  );
};

export default Page;
