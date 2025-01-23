"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePasswordAsync } from "@/app/store/features/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const PasswordChange = () => {
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const dispatch = useDispatch();
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
    
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("New passwords don't match!");
      return;
    }

    const { confirm_password, ...changePasswordData } = passwords;

    try {
      await dispatch(changePasswordAsync(changePasswordData) as any).unwrap();
      toast.success("Password changed successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error || "Failed to change password");
    }
  };

  return (
    <div className="account-details-box w-1/2 text-left">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6 flex flex-col items-start">
          <label className="block BRCobane18600 mb-2.5">Old Password</label>
          <input
            type="password"
            name="old_password"
            value={passwords.old_password}
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
            name="confirm_password"
            value={passwords.confirm_password}
            onChange={handleChange}
            className="account-input-field w-full"
            required
          />
        </div>

        <button type="submit" className="yellow-btn hover:bg-orange-600">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default PasswordChange;
