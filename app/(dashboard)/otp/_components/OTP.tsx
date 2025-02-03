"use client";
import { useState, useEffect } from "react";
import { api } from '../../../lib/axios';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoginResponse, setUser } from "@/app/store/features/authSlice";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/store";

const ForgotPassword = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loginResponse, user } = useAppSelector((state) => state.auth);
  
  // Add debug logging
  console.log("Auth State:", { loginResponse, user });

  const dispatch = useDispatch();
  const router = useRouter();
  const history_id = loginResponse?.history_id;

  // Add check for required data
  useEffect(() => {
    if (!history_id) {
      router.push('/login'); // Redirect if no history_id
      toast.error("Please login first");
    }
  }, [history_id, router]);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!history_id) {
      toast.error("Session expired. Please login again.");
      router.push('/login');
      return;
    }
    setLoading(true);
    setError(null);

    const otpValue = otp.join("");
    const payload = {
      history_id: history_id,
      otp: otpValue,
    };

    try {
      const response = await api.post("/auth/verify-otp", payload);
      console.log("OTP Verified:", response.data);
      
      // Store the JWT token in localStorage
      if (response.data.token) {
        localStorage.setItem('matrimony token', response.data.token);
      }
      
      dispatch(setUser(response.data));
      toast.success("OTP Verified!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("OTP Verification failed:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "An error occurred while verifying the OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-details-box w-1/2 text-left">
      <h3 className="BRCobane32600 md:mb-0 md:mt-16">
        Enter the OTP sent to your email
      </h3>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-start md:mb-16"
      >
        {/* OTP Input */}
        <label className="block BRCobane18600 mb-2.5 text-left">OTP</label>
        <div className="flex justify-between gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="mb-6 w-full">
          <button
            type="submit"
            className="w-full yellow-btn hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? "Verifying OTP..." : "Submit"}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Login Link */}
        <div className="flex gap-2">
          <p className="BRCobane16500 opacity-50">Login to your account? </p>
          <a href="/login" className="BRCobane16600 hover:underline">
            Login Now
          </a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
