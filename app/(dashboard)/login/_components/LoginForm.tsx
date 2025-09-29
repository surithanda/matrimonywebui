"use client";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  loginUserAsync,
  setLoginResponse,
} from "@/app/store/features/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Add this import
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import loaderAnimation from "@/public/lottie/Loading.json";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Add this state
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state: any) => state.auth); // Select loading and error state from Redux
  const { setSelectedProfileID } = useProfileContext();
  const [redirecting, setRedirecting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRedirecting(true)
    // Dispatch the login thunk
    dispatch(loginUserAsync(formData) as any)
      .unwrap()
      .then((response: any) => {
        console.log("Login response:", response);
        // Show success toast
        toast.success("Login successful! Redirecting to OTP screen...");
        dispatch(setLoginResponse(response.user)); // Save the login response to Redux
        setRedirecting(true);
        // Navigate to OTP screen upon successful login
        setTimeout(() => {
          router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      })
      .catch((err: any) => {
        console.log(err)
        // Show error toast
        setRedirecting(false)
        toast.error(err || "An error occurred during login.");
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="account-details-box w-full sm:w-1/2 md:w-3/4 lg:w-1/2 xl:w-1/3 text-left shadow-xl">
        {/* <h3 className="BRCobane32600 md:mb-0 text-2xl md:text-3xl">Login to Chaturvarnam</h3> */}
        <form onSubmit={handleSubmit} className="w-full">
          {/* Email Input */}
          <div className="mb-6 flex flex-col items-start">
            <Label className="mb-2">Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full focus:outline-none focus:border-b focus:border-[#f7ac03]"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-2 flex flex-col items-start">
            <Label className="mb-2">Password</Label>
            <div className="relative w-full">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full focus:outline-none focus:border-b focus:border-[#f7ac03]"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setRedirecting(true); // Show loader immediately
                router.push("/forgotpassword");
              }}
              className="BRCobane16500 opacity-50 hover:text-[#e69a00]"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <div className="mb-3">
            <button
              type="submit"
              className="w-full bg-[#f7ac03] hover:bg-[#e69a00] p-2 rounded-md text-xl font-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Error Message */}
          {/* {error && <div className="text-red-500 text-sm mb-4">{error}</div>} */}

          {/* Register Link */}
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap text-center">
            <p className="text-sm sm:text-base md:text-lg lg:text-base font-medium text-gray-700">
              Don't have an account yet?
            </p>
            <Button
            size={"md"}
              onClick={(e) => {
                e.preventDefault();
                setRedirecting(true); // Show loader immediately
                router.push("/register");
              }}
              className="text-white font-semibold hover:text-[#e69a00] transition-colors duration-200 text-sm sm:text-base md:text-lg lg:text-lg"
            >
              Register Now
            </Button>
          </div>
        </form>
      </div>
      {/* Full-screen loader when redirecting */}
      {redirecting && (
        <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
          <Lottie
            animationData={loaderAnimation}
            loop
            autoplay
            style={{ height: 150, width: 150 }}
          />
        </div>
      )}
    </>
  );
};

export default LoginForm;
