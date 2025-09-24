"use client";
import React, { useEffect, useState } from "react";
import BillingForm from "../_components/BillingForm";
import { useSearchParams } from "next/navigation";
import { plans } from "../_components/PricingCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaCircleCheck } from "react-icons/fa6";
import { BorderBeam } from "@/components/ui/border-beam";
import { Calendar } from "lucide-react"; // You were using Calendar, make sure it's imported
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import SuccessModal from "../_components/SuccessModal";

export default function Page() {
  const searchParams = useSearchParams();
  const requiredPlanName = searchParams.get("plan");
  const selectedPlan = plans.find((pla) => pla.name === requiredPlanName);
  const [mondalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<any>(null);

  if (!selectedPlan) {
    return <div className="text-center mt-10">Plan not found.</div>;
  }

  useEffect(() => {
    let paymentStatus = searchParams.get("status");
    if (paymentStatus === "success") {
      setModalOpen(true);
      setModalType("success");
    }
    if (paymentStatus === "failed") {
      setModalOpen(true);
      setModalType("failed");
    }
  }, [searchParams]);

  return (
    <div className="dashboard-background md:px-[120px] md:pt-8 flex flex-col items-center md:gap-8 mt-20">
      <div className="flex justify-center items-center w-full">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: "BR Cobane" }}
            >
              Selected Plan Details
            </h2>
            <Card className="relative flex w-80 flex-col justify-between text-left overflow-hidden shadow-xl mb-4">
              <BorderBeam size={250} duration={6} delay={4} />

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <p style={{ fontFamily: "BR Cobane" }}>
                      {selectedPlan.name}
                    </p>
                  </CardTitle>
                  <span className="text-4xl font-bold">
                    {selectedPlan.monthlyPrice}
                    <span className="text-xl">/ mo</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={22} />
                  <p
                    className="text-muted-foreground"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    30 days from purchase
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <Separator className="mb-6" />
                {selectedPlan.id === "pro" && (
                  <p className="mb-3 font-semibold">Everything in Plus, and:</p>
                )}
                <ul className="space-y-4">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FaCircleCheck size={18} />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <div className="flex items-center gap-2 justify-center">
              <IoMdArrowBack />
              <Link
                href="/payments"
                className="text-base cursor-pointer"
                style={{ fontFamily: "BR Cobane" }}
              >
                Choose diffrent plan
              </Link>
            </div>
          </div>
          <div className="col-span-2">
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: "BR Cobane" }}
            >
              Billing Information
            </h2>
            <BillingForm
              planName={selectedPlan.name}
              planPrice={selectedPlan.price}
            />
            <SuccessModal
              open={mondalOpen}
              plan={{
                name: selectedPlan.name,
                price: selectedPlan.monthlyPrice,
                duration: "1 Month",
              }}
              onOpenChange={() => {
                setModalOpen(false);
              }}
              type={modalType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
