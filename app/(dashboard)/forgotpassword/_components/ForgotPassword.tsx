"use client";
import { useState } from "react";
import {
  forgotPasswordAsync,
  resetPasswordAsync,
} from "@/app/store/features/authSlice";
import { useAppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/lottie/Loading.json";
import Link from "next/link";
import Loader from "../../_components/Loader";

const ForgotPassword = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
    confirm_new_password: "",
    history_id: 0,
  });

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRedirecting(true); // show loader immediately

    dispatch(forgotPasswordAsync(formData))
      .then((res: any) => {
        if (res.payload && res.payload.success) {
          setFormData((prev) => ({
            ...prev,
            history_id: res.payload.history_id,
          }));
          toast.success("OTP sent successfully!");
          setCurrent(1);
        } else {
          toast.error(res.payload?.message || "Failed to send OTP");
        }
      })
      .catch((err: any) => {
        toast.error("Error sending OTP");
      })
      .finally(() => {
        setRedirecting(false); // hide loader after success or error
      });
  };

  const handleSubmitReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_new_password) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    setRedirecting(true);

    console.log("Resetting password with payload:", formData);
    // return
    const resetPayload = {
      history_id: formData.history_id,
      email: formData.email,
      otp: formData.otp,
      new_password: formData.new_password,
      confirm_new_password: formData.confirm_new_password,
    };

    dispatch(resetPasswordAsync(resetPayload))
      .then((res: any) => {
        if (res.payload && res.payload.success) {
          toast.success("Password reset successful!");
          router.push("/login");
        } else {
          toast.error(res.payload?.message || "Failed to reset password");
        }
      })
      .catch((err: any) => {
        toast.error("Error resetting password");
      })
      .finally(() => {
        setRedirecting(false); // hide loader after success or error
      });
  };

  return (
    <>
      <div className="account-details-box w-full sm:w-1/2 md:w-3/4 lg:w-2/5 2xl:w-1/4 text-left shadow-xl mt-24">
        <h3 className="BRCobane32600 text-3xl md:mb-0 mt-2">
          Forgot password?
        </h3>

        {current === 0 && (
          <form onSubmit={handleSubmit} className="w-full  md:mb-16">
            {/* Email Input */}
            <div className="mb-6 flex flex-col items-start">
              <Label className="mb-2">Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-b focus:border-[#f7ac03]"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="mb-6">
              <Button
                type="submit"
                className="w-full bg-[#f7ac03] hover:bg-[#e69a00] p-2 rounded-md text-lg font-semibold"
              >
                Continue
              </Button>
            </div>

            {/* Register Link */}
            <div className="flex justify-center items-center gap-2">
              <p className="text-sm sm:text-base md:text-lg lg:text-base font-medium text-gray-700">
                Login to your account?{" "}
              </p>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setRedirecting(true); // Show loader immediately
                  router.push("/login");
                }}
                className="text-white font-semibold hover:text-[#e69a00] transition-colors duration-200 text-sm sm:text-base md:text-lg lg:text-l"
              >
                Login Now
              </Button>
            </div>
          </form>
        )}

        {current === 1 && (
          <form onSubmit={handleSubmitReset} className="w-full">
            <div className="mb-6 flex flex-col items-start">
              <Label className="block BRCobane18600 mb-2.5">OTP</Label>
              <Input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-b focus:border-[#f7ac03]"
                required
              />
            </div>

            <div className="mb-6 flex flex-col items-start">
              <Label className="block BRCobane18600 mb-2.5">New Password</Label>
              <Input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-b focus:border-[#f7ac03]"
                required
              />
            </div>

            <div className="mb-6 flex flex-col items-start">
              <Label className="block BRCobane18600 mb-2.5">
                Confirm New Password
              </Label>
              <Input
                type="password"
                name="confirm_new_password"
                value={formData.confirm_new_password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-b focus:border-[#f7ac03]"
                required
              />
            </div>

            <div className="mb-6">
              <Button
                type="submit"
                className="w-full bg-[#f7ac03] hover:bg-[#e69a00] p-2 rounded-md text-xl font-semibold"
              >
                Reset Password
              </Button>
            </div>
            <div className="flex justify-center items-center gap-2">
              <p className="text-sm sm:text-base md:text-lg lg:text-base font-medium text-gray-700">
                Back to login page?{" "}
              </p>
              <Button>
                <Link
                  href="/login"
                  className="text-white font-semibold hover:text-[#e69a00] transition-colors duration-200 text-sm sm:text-base md:text-lg lg:text-l"
                >
                  Login Now
                </Link>
              </Button>
            </div>
          </form>
        )}
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
      <ToastContainer />
    </>
  );
};

export default ForgotPassword;
