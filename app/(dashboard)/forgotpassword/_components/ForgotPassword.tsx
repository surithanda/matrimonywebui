"use client";
import { useState } from "react";
import { forgotPasswordAsync } from "@/app/store/features/authSlice";
import { useAppDispatch } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify'; 
const ForgotPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
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
    console.info('Form Data:', formData);
  
    dispatch(forgotPasswordAsync(formData)).then((res: any) => {
      console.info('Response:', res);
  
      if (res.payload && res.payload.success) {
         toast.success("OTP sent successfully! Redirecting to OTP screen...");
        setTimeout(() => {
          router.push('/otp');
        }, 2000);
      } else {
        console.error('Error: OTP not sent', res);
        // Optionally show error message to user
      }
    }).catch((err: any) => {
      console.error('Dispatch error:', err);
    });
  };

  return (
    <div className="account-details-box w-1/2 text-left">
      <h3 className="BRCobane32600 md:mb-0 md:mt-16">Forgot password?</h3>
      <form onSubmit={handleSubmit} className="w-full  md:mb-16">
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
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ForgotPassword;
