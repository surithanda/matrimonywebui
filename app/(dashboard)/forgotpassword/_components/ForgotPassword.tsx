"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPasswordAsync } from "@/app/store/features/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [resetData, setResetData] = useState({
    history_id: "",
    otp: "",
    new_password: "",
    confirm_new_password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetData.new_password !== resetData.confirm_new_password) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      await dispatch(resetPasswordAsync({
        ...resetData,
        history_id: parseInt(resetData.history_id)
      }) as any).unwrap();
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error || "Failed to reset password");
    }
  };

  return (
    <div className="account-details-box w-1/2 text-left">
      <h3 className="BRCobane32600 mb-6">Reset Password</h3>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">History ID</label>
          <input
            type="text"
            name="history_id"
            value={resetData.history_id}
            onChange={handleChange}
            className="account-input-field w-full"
            required
          />
        </div>

        <div className="mb-6 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">OTP</label>
          <input
            type="text"
            name="otp"
            value={resetData.otp}
            onChange={handleChange}
            className="account-input-field w-full"
            required
          />
        </div>

        <div className="mb-6 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">New Password</label>
          <input
            type="password"
            name="new_password"
            value={resetData.new_password}
            onChange={handleChange}
            className="account-input-field w-full"
            required
          />
        </div>

        <div className="mb-6 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">Confirm New Password</label>
          <input
            type="password"
            name="confirm_new_password"
            value={resetData.confirm_new_password}
            onChange={handleChange}
            className="account-input-field w-full"
            required
          />
        </div>

        <button type="submit" className="yellow-btn hover:bg-orange-600">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
