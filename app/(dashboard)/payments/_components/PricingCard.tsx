"use client";

import { ArrowRight, Calendar, CircleCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaCircleCheck } from "react-icons/fa6";
import { BorderBeam } from "@/components/ui/border-beam";
import { features } from "process";
import { useRouter } from "next/navigation";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: string;
  features: PricingFeature[];
}

interface Pricing2Props {
  plans?: PricingPlan[];
  onSelect?: (plan: PricingPlan) => void; // 👈 new
}

export const plans = [
  {
    id: "Basic",
    name: "Basic",
    monthlyPrice: "$9.99",
    features: [
      { text: "Access to standard features" },
      { text: "Email Support" },
      { text: "1 device login" },
    ],
    price: 9.99,
  },
  {
    id: "Silver",
    name: "Silver",
    monthlyPrice: "$19.99",
    features: [
      { text: "All Basic features" },
      { text: "Priority support" },
      { text: "3 device logins" },
      { text: "Ad-free experience" },
    ],
    price: 19.99,
  },
  {
    id: "Gold",
    name: "Gold",
    monthlyPrice: "$29.99",
    features: [
      { text: "All Silver features" },
      { text: "Exclusive content" },
      { text: "5 device logins" },
      { text: "Personalized recommendations" },
    ],

    price: 29.99,
  },
];

const PricingCard = () => {
  const router = useRouter();
  const handlePlan = (plan: string) => {
    router.push(`/payments/billings?plan=${plan}`);
  };
  return (
    <div className="flex flex-col items-stretch gap-6 md:flex-row">
      {plans.map((plan, index) => (
        <Card
          key={plan.id}
          className="relative flex w-80 flex-col justify-between text-left overflow-hidden shadow-xl"
        >
          {/* BorderBeam Effect */}
          <BorderBeam size={250} duration={6} delay={index * 4} />

          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                <p style={{ fontFamily: "BR Cobane" }}>{plan.name}</p>
              </CardTitle>
              <span className="text-4xl font-bold">
                {plan.monthlyPrice}
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
            {plan.id === "pro" && (
              <p className="mb-3 font-semibold">Everything in Plus, and:</p>
            )}
            <ul className="space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FaCircleCheck size={18} />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="mt-auto">
            <Button
              className="w-full transition-colors duration-300 ease-in-out hover:bg-orange-500 hover:text-white"
              variant="outline"
              onClick={() => handlePlan(plan.name)}
            >
              Purchase
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export { PricingCard };
