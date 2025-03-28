//No use of this code yet
"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPasswordAsync } from "@/app/store/features/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/store";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    otp: "",
    new_password: "",
    confirm_new_password: "",
  });
  const dispatch = useDispatch();
    const { loginResponse, user, forgotPasswordhistory_id } = useAppSelector((state) => state.auth);
  const history_id = loginResponse?.history_id || 0;
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new_password !== passwords.confirm_new_password) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      await dispatch(resetPasswordAsync({
        history_id,
        ...passwords
      }) as any).unwrap();
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error || "Failed to reset password");
    }
  };

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
