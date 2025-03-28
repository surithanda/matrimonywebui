"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePasswordAsync } from "@/app/store/features/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const PasswordChange = () => {
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const router = useRouter();

  const validatePassword = (password: string) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };
    return rules;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: Record<string, string> = {};
    
    // Validate new password
    const validationRules = validatePassword(passwords.new_password);
    if (!validationRules.length) newErrors.new_password = "Password must be at least 8 characters long";
    if (!validationRules.uppercase || !validationRules.lowercase) 
      newErrors.new_password = "Password must contain both uppercase and lowercase letters";
    if (!validationRules.number) newErrors.new_password = "Password must contain at least one number";
    if (!validationRules.special) newErrors.new_password = "Password must contain at least one special character";
    
    // Check if passwords match
    if (passwords.new_password !== passwords.confirm_new_password) {
      newErrors.confirm_new_password = "Passwords don't match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(changePasswordAsync(passwords) as any).unwrap();
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
          <label className="block BRCobane18600 mb-2.5">Current Password</label>
          <input
            type="password"
            name="current_password"
            value={passwords.current_password}
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
          {errors.new_password && (
            <span className="text-red-500 text-sm mt-1">{errors.new_password}</span>
          )}
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
          {errors.confirm_new_password && (
            <span className="text-red-500 text-sm mt-1">{errors.confirm_new_password}</span>
          )}
        </div>

        <button type="submit" className="yellow-btn hover:bg-orange-600">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default PasswordChange;
