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

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: string;
  features: PricingFeature[];
  button: {
    text: string;
    url: string;
  };
}

interface Pricing2Props {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
}

const Pricing2 = ({
  plans = [
    {
      id: "Basic",
      name: "Basic",
      monthlyPrice: "$9.99",
      features: [
        { text: "Access to standard features" },
        { text: "Email Support" },
        { text: "1 device login" },
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
    {
      id: "Silver",
      name: "Silver",
      monthlyPrice: "$49",
      features: [
        { text: "All Basic features" },
        { text: "Priority support" },
        { text: "3 device logins" },
        { text: "Ad-free experience" },
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
    {
      id: "Gold",
      name: "Gold",
      monthlyPrice: "$99",
      features: [
        { text: "All Silver features" },
        { text: "Exclusive content" },
        { text: "5 device logins" },
        { text: "Personalized recommendations" },
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
  ],
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(false);
  return (
    <section className="">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="flex w-80 flex-col justify-between text-left"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      <p style={{ fontFamily: "BR Cobane" }}>{plan.name}</p>
                    </CardTitle>
                    <span className="text-4xl font-bold">
                      {plan.monthlyPrice}<span className="text-xl">/ mo</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={22} />
                    <p
                      className="text-muted-foreground"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      30 dyas from purchase
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  {plan.id === "pro" && (
                    <p className="mb-3 font-semibold">
                      Everything in Plus, and:
                    </p>
                  )}
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FaCircleCheck size={24} />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full">
                    <a href={plan.button.url} target="_blank">
                      {plan.button.text}
                      <ArrowRight className="ml-2 size-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
