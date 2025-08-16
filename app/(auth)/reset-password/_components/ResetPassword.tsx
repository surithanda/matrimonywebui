//No use of this code yet
"use client";
import { useState, useCallback } from "react";
import { resetPasswordAsync } from "@/app/store/features/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    otp: "",
    new_password: "",
    confirm_new_password: "",
  });
  const dispatch: AppDispatch = useAppDispatch();
  const { forgotPasswordhistory_id, email } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new_password !== passwords.confirm_new_password) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      await dispatch(resetPasswordAsync({
        history_id: forgotPasswordhistory_id,
        email,
        ...passwords
      })).unwrap();
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    }
  }, [dispatch, passwords, forgotPasswordhistory_id, email, router]);

  return (
    <div className="account-details-box w-1/2 text-left">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">OTP</label>
          <input
            type="text"
            name="otp"
            value={passwords.otp}
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
            value={passwords.new_password}
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
            value={passwords.confirm_new_password}
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

export default ResetPassword;
