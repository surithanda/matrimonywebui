"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { loginUserAsync, setLoginResponse } from "@/app/store/features/authSlice";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter(); 
  const { loading, error } = useSelector((state: any) => state.auth); // Select loading and error state from Redux

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Dispatch the login thunk
    dispatch(loginUserAsync(formData) as any)
      .unwrap()
      .then((response:any) => {
        // Show success toast
        toast.success("Login successful! Redirecting to OTP screen...");
        dispatch(setLoginResponse(response.user)); // Save the login response to Redux

        // Navigate to OTP screen upon successful login
        setTimeout(() => {
          router.push('/otp');
        }, 2000); // Delay navigation to allow the user to see the toast
      })
      .catch((err:any) => {
        // Show error toast
        toast.error(err || "An error occurred during login.");
      });
  };

  return (
    <div className="account-details-box w-1/2 text-left">
      <h3 className="BRCobane32600 md:mb-0">Login to Chaturvarnam</h3>
      <form onSubmit={handleSubmit} className="w-full">
        {/* Email Input */}
        <div className="mb-6 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Email"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Password"
            required
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right mb-6">
          <a
            href="/forgot-password"
            className="BRCobane16500 opacity-50 hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <div className="mb-6">
          <button
            type="submit"
            className="w-full yellow-btn hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Register Link */}
        <div className="flex gap-2">
          <p className="BRCobane16500 opacity-50">
            Don't have an account yet?{" "}
          </p>
          <a href="/register" className="BRCobane16600 hover:underline">
            Register Now
          </a>
        </div>
      </form>

      {/* Toast Container */}
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

export default LoginForm;
