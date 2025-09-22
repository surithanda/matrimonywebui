"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePasswordAsync } from "@/app/store/features/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };
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

    const validationRules = validatePassword(passwords.new_password);
    if (!validationRules.length)
      newErrors.new_password = "Password must be at least 8 characters long";
    if (!validationRules.uppercase || !validationRules.lowercase)
      newErrors.new_password =
        "Password must contain both uppercase and lowercase letters";
    if (!validationRules.number)
      newErrors.new_password = "Password must contain at least one number";
    if (!validationRules.special)
      newErrors.new_password =
        "Password must contain at least one special character";

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
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error || "Failed to change password");
    }
  };

  return (
    <div className="account-details-box w-full sm:w-1/2 md:w-3/4 lg:w-2/3 xl:w-1/3 mx-auto px-4 sm:px-6 lg:px-8 py-6 shadow-lg">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Current Password */}
        <div className="mb-6 flex flex-col">
          <Label className="block BRCobane18600 mb-2.5 text-base sm:text-lg">
            Current Password
          </Label>
          <Input
            type="password"
            name="current_password"
            value={passwords.current_password}
            onChange={handleChange}
            className=" w-full text-sm sm:text-base"
            required
          />
        </div>

        {/* New Password */}
        <div className="mb-6 flex flex-col">
          <Label className="block BRCobane18600 mb-2.5 text-base sm:text-lg">
            New Password
          </Label>
          <Input
            type="password"
            name="new_password"
            value={passwords.new_password}
            onChange={handleChange}
            className=" w-full text-sm sm:text-base"
            required
          />
          {errors.new_password && (
            <span className="text-red-500 text-sm mt-1">
              {errors.new_password}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6 flex flex-col">
          <Label className="block BRCobane18600 mb-2.5 text-base sm:text-lg">
            Confirm New Password
          </Label>
          <Input
            type="password"
            name="confirm_new_password"
            value={passwords.confirm_new_password}
            onChange={handleChange}
            className=" w-full text-sm sm:text-base"
            required
          />
          {errors.confirm_new_password && (
            <span className="text-red-500 text-sm mt-1">
              {errors.confirm_new_password}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#f7ac03] hover:bg-[#e69a00] p-2 rounded-md text-xl font-semibold"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default PasswordChange;
