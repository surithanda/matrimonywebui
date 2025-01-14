"use client";
import { useState } from "react";

const ForgotPassword = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP submission here
    console.log("OTP Submitted:", otp.join(""));
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
        {/* Email Input */}
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
          >
            Submit
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
    </div>
  );
};

export default ForgotPassword;
