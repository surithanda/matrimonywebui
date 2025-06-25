"use client";
import { useState } from "react";
import { forgotPasswordAsync, resetPasswordAsync } from "@/app/store/features/authSlice";
import { useAppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';

const ForgotPassword = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
    confirm_new_password: "",
    history_id: 0
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
  
    dispatch(forgotPasswordAsync(formData)).then((res: any) => {
      // Check if the action was fulfilled (successful)
      if (res.type === 'auth/forgotPassword/fulfilled') {
        // Extract history_id from the payload
          toast.success("OTP sent successfully!");
          setCurrent(1);
      } else {
        // Action was rejected
        toast.error(res.payload?.message || res.error?.message || "Failed to send OTP");
      }
    }).catch((err: any) => {
      toast.error("Error sending OTP");
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
 
    const resetPayload = {
      email: formData.email,
      history_id: formData.history_id,
      otp: formData.otp,
      newPassword: formData.new_password,
      confirmNewPassword: formData.confirm_new_password
    };

    dispatch(resetPasswordAsync(resetPayload)).then((res: any) => {
      // Check if the action was fulfilled (successful)
      if (res.type === 'auth/resetPassword/fulfilled') {
        toast.success("Password reset successful!");
        router.push('/login');
      } else {
        // Action was rejected
        toast.error(res.payload?.message || res.error?.message || "Failed to reset password");
      }
    }).catch((err: any) => {
      toast.error("Error resetting password");
    });
  };

  return (
    <div className="account-details-box w-1/2 text-left">
      <h3 className="BRCobane32600 md:mb-0 md:mt-16">Forgot password?</h3>
      <ToastContainer />
      
      { current === 0 && <form onSubmit={handleSubmit} className="w-full  md:mb-16">
        {/* Email Input */}
        <div className="mb-6 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Email"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mb-6">
          <button
            type="submit"
            className="w-full yellow-btn hover:bg-orange-600"
          >
            Continue
          </button>
        </div>

        {/* Register Link */}
        <div className="flex gap-2">
          <p className="BRCobane16500 opacity-50">Login to your account? </p>
          <a href="/login" className="BRCobane16600 hover:underline">
            Login Now
          </a>
        </div>
      </form> }

      { current === 1 && 
        <form onSubmit={handleSubmitReset} className="w-full md:mb-16">
          <div className="mb-6 flex flex-col items-start">
            <label className="block BRCobane18600 mb-2.5">OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter OTP"
              required
            />
          </div>

          <div className="mb-6 flex flex-col items-start">
            <label className="block BRCobane18600 mb-2.5">New Password</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="New Password"
              required
            />
          </div>

          <div className="mb-6 flex flex-col items-start">
            <label className="block BRCobane18600 mb-2.5">Confirm New Password</label>
            <input
              type="password"
              name="confirm_new_password"
              value={formData.confirm_new_password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Confirm New Password"
              required
            />
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full yellow-btn hover:bg-orange-600"
            >
              Reset Password
            </button>
          </div>
          <div className="flex gap-2">
            <p className="BRCobane16500 opacity-50">Back to login page? </p>
            <a href="/login" className="BRCobane16600 hover:underline">
              Login Now
            </a>
          </div>
        </form>
      }
    </div>
  );
};

export default ForgotPassword;
