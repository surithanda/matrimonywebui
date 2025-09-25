"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import Lottie from "lottie-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import successAnimation from "@/public/lottie/Success.json";
import failedAnimation from "@/public/lottie/Failed.json"

const MastercardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="36"
    height="24"
  >
    <circle cx="8" cy="12" r="7" fill="#EA001B"></circle>
    <circle cx="16" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8"></circle>
  </svg>
);

export default function PaymentStatusModal({
  open,
  onOpenChange,
  plan,
  type,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: { name: string; price: string; duration: string };
  type: "success" | "failed"|null;
}) {


  const isSuccess = type === "success";
  const animation = isSuccess ? successAnimation : failedAnimation;
  const heading = isSuccess ? "Thank you!" : "Oops!";
  const message = isSuccess
    ? `Your ${plan.name} plan has been purchased successfully`
    : `Your ${plan.name} plan purchase has failed. Please try again.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="text-center">
          <DialogTitle>
            <VisuallyHidden>
              {isSuccess ? "Purchase Successful" : "Purchase Failed"}
            </VisuallyHidden>
          </DialogTitle>

          <div className="flex flex-col items-center text-center">
            <Lottie
              animationData={animation}
              loop={!isSuccess}
              autoplay
              style={{ width: 120, height: 120 }}
            />

            <h1
              className={`text-2xl font-semibold mt-4 ${
                isSuccess ? "text-green-600" : "text-red-600"
              }`}
              style={{ fontFamily: "BR Cobane" }}
            >
              {heading}
            </h1>
            <p
              className="text-muted-foreground mt-1"
              style={{ fontFamily: "BR Cobane" }}
            >
              {message}
            </p>
          </div>
        </DialogHeader>

        {isSuccess && (
          <>
            <div className="border rounded-xl p-4 bg-white shadow-sm">
              <p className="text-gray-800 font-medium">{plan.name}</p>
              <p className="text-2xl font-bold">{plan.price}</p>
              <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>1 year (365 days from purchase)</span>
              </div>
            </div>

            {/* <div className="border rounded-xl p-4 bg-white shadow-sm">
              <div className="grid grid-cols-2 gap-4 text-left mb-4">
                <div className="flex items-center gap-2">
                  <MastercardIcon />
                  <div>
                    <p className="font-semibold" style={{ fontFamily: "BR Cobane" }}>
                      Badal Nayak
                    </p>
                    <p
                      className="text-muted-foreground font-mono text-sm tracking-wider"
                      style={{ fontFamily: "BR Cobane" }}
                    >
                      •••• 1234
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="text-xs text-muted-foreground uppercase"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    Amount
                  </p>
                  <p
                    className="font-semibold text-lg"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    {plan.price}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p
                    className="text-xs text-muted-foreground uppercase"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    Transaction ID
                  </p>
                  <p
                    className="font-mono font-medium"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    0120034399434
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs text-muted-foreground uppercase"
                    style={{ fontFamily: "BR Cobane" }}
                  >
                    Date & Time
                  </p>
                  <p className="font-medium" style={{ fontFamily: "BR Cobane" }}>
                    12-05-2025 - 10:15 am
                  </p>
                </div>
              </div>
            </div> */}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
