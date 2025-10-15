"use client";
import { setAuthToken } from "@/app/utils/authToken";
import { useState, useEffect } from "react";
import { api } from "../../../lib/axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "@/app/store/features/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/store/store";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { getProfilesByAccountIdAsync } from "@/app/store/features/profileSlice";
import { Input } from "@/components/ui/input";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/lottie/Loading.json";
import Loader from "../../_components/Loader";

const ForgotPassword = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_OTP_ATTEMPTS = 3; // max allowed wrong attempts

  const [wrongOtpCount, setWrongOtpCount] = useState(0);

  const { selectedProfileID, setSelectedProfileID } = useProfileContext();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // @ts-ignore
  const { loginResponse, user, forgotPasswordhistory_id } = useAppSelector(
    (state) => state.auth
  );
  console.log("Auth State:", { loginResponse, user });

  const dispatch = useDispatch();
  const router = useRouter();
  const history_id = loginResponse?.history_id || 0;
  const isForgotPassword: number = forgotPasswordhistory_id || 0;

  // useEffect(() => {
  //   if (history_id <=0 || (isForgotPassword <= 0)) {
  //     debugger
  //     router.push('/login');
  //     toast.error("Please login first");
  //   }
  // }, [history_id, router]);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next field if input is filled
    if (value && index < otp.length - 1) {
      (
        document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      )?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      (
        document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      )?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRedirecting(true);
    setError(null);

    const otpValue = otp.join("");
    const payload = { email, otp: otpValue };

    try {
      const response = await api.post("/auth/verify-otp", payload);
      console.log("OTP Verified:", response.data);

      if (
        !response.data.token ||
        !response.data.user ||
        !response?.data?.user?.account_id
      ) {
        throw new Error("Wrong Otp Entered");
      }
      if (
        response.data.token &&
        response.data.user &&
        response?.data?.user?.account_id
      ) {
        setAuthToken(response.data.token);
      }

      if (
        response.data.token &&
        response.data.user &&
        response?.data?.user?.account_id
      ) {
        dispatch(setUser(response.data));
      }

      if (
        response.data.token &&
        response.data.user &&
        response?.data?.user?.account_id
      ) {
        const result: any = await (dispatch as any)(
          getProfilesByAccountIdAsync(response?.data?.user?.account_id)
        ).unwrap();
        setSelectedProfileID(result?.data?.[0]?.profile_id || 0);
      }

      toast.success("OTP Verified!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      if (isForgotPassword > 0 && history_id < 0) {
        router.push("/changepassword");
      } else {
        router.push("/dashboard");
      }

      // Reset wrong OTP count on success
      setWrongOtpCount(0);
    } catch (error: any) {
      let message = "An error occurred while verifying the OTP.";

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        message = err.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      console.error("OTP Verification failed:", message);

      if (message.toLowerCase().includes("otp")) {
        const attempts = wrongOtpCount + 1;
        setWrongOtpCount(attempts);

        if (attempts >= MAX_OTP_ATTEMPTS) {
          toast.error("Too many wrong OTP attempts. Redirecting to login.", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
          router.back();
        } else {
          toast.error(
            `Wrong OTP entered. Attempts left: ${MAX_OTP_ATTEMPTS - attempts}`,
            {
              position: "top-right",
              autoClose: 3000,
              theme: "colored",
            }
          );
        }
      } else {
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }

      setError(message);
    } finally {
      setLoading(false);
      setRedirecting(false);
    }
  };

  return (
    <>
      <div className="account-details-box w-full sm:w-1/2 md:w-3/4 lg:w-2/3 xl:w-1/4 text-left shadow-xl">
        <h3 className="BRCobane32600 text-2xl md:mb-0 mt-4">
          Enter the OTP sent to your email
        </h3>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-start md:mb-16"
        >
          {/* OTP Input */}
          {/* <label className="block BRCobane18600 mb-2.5 text-left">OTP</label> */}
          <div className="flex justify-between gap-4 mb-6">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="account-input-field w-full text-center focus:outline-none focus:border-b focus:border-[#f7ac03]"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="mb-6 w-full">
            <button
              type="submit"
              className="w-full bg-[#f7ac03] hover:bg-[#e69a00] p-2 rounded-md text-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Verifying OTP..." : "Submit"}
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* Login Link */}
          {/* <div className="flex gap-2">
          <p className="text-sm sm:text-base md:text-lg lg:text-base font-medium text-gray-700">Login to your account? </p>
          <a href="/login" className="text-[#f7ac03] font-semibold hover:underline hover:text-[#e69a00] transition-colors duration-200 text-sm sm:text-base md:text-lg lg:text-lg">
            Login Now
          </a>
        </div> */}
        </form>
      </div>
      {/* Full-screen loader when redirecting */}
      {redirecting && (
        // <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
        //   <Lottie
        //     animationData={loaderAnimation}
        //     loop
        //     autoplay
        //     style={{ height: 150, width: 150 }}
        //   />
        // </div>
        <Loader />
      )}
    </>
  );
};

export default ForgotPassword;
