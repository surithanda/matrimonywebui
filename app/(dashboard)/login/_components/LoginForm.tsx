"use client";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { loginUserAsync, setLoginResponse } from "@/app/store/features/authSlice";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Add this import
import { useProfileContext } from "@/app/utils/useProfileContext";

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
        console.log("Login response:", response);
        // Show success toast
        toast.success("Login successful! Redirecting to OTP screen...");
        dispatch(setLoginResponse(response.user)); // Save the login response to Redux
        
        // Navigate to OTP screen upon successful login
        setTimeout(() => {
          router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      })
      .catch((err:any) => {
        // Show error toast
        toast.error(err || "An error occurred during login.");
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="account-details-box w-full sm:w-1/2 md:w-3/4 lg:w-2/3 xl:w-1/4 text-left">
      <h3 className="BRCobane32600 md:mb-0 text-2xl md:text-3xl">Login to Chaturvarnam</h3>
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
        <div className="mb-2 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Password"
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
            href="/forgotpassword"
            className="BRCobane16500 opacity-50 hover:underline"
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
        <div className="flex justify-center items-center gap-2">
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
