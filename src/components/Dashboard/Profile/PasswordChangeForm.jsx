import { useState } from "react";
import { ChevronDown, Eye, EyeOff, Lock } from "lucide-react";

const PasswordChangeForm = ({
  register,
  errors,
  watch,
  isEditing,
  isPasswordSectionOpen,
  setIsPasswordSectionOpen,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordRules = (fieldName) => {
    if (!isPasswordSectionOpen || !isEditing) return {};

    switch (fieldName) {
      case "current_password":
        return { required: "Current password is required" };
      case "new_password":
        return {
          required: "New password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
        };
      case "confirm_new_password":
        return {
          required: "Confirm new password is required",
          validate: (value) =>
            value === watch("new_password") || "Passwords do not match",
        };
      default:
        return {};
    }
  };

  return (
    <div className="mt-6 border-t border-green-300 pt-6">
      <button
        type="button"
        className="btn btn-ghost p-0 justify-start text-green-700 font-semibold h-auto min-h-0 text-lg flex items-center gap-2 hover:bg-transparent"
        onClick={() => setIsPasswordSectionOpen(!isPasswordSectionOpen)}
        disabled={!isEditing}
      >
        <Lock size={20} className="text-green-700" />
        Change Password
        <ChevronDown
          size={18}
          className={`ml-2 transform transition-transform duration-300 ${
            isPasswordSectionOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isPasswordSectionOpen && isEditing && (
        <div className="mt-4 space-y-4 pl-4 border-l-2 border-green-500 bg-green-50 p-4 rounded-lg shadow-inner">
          {/* Current Password */}
          <div className="form-control">
            <label className="label text-green-700">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered bg-green-100 w-full pr-10 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                {...register("current_password", passwordRules("current_password"))}
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-green-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.current_password && (
              <p className="text-red-500 text-sm mt-1">{errors.current_password.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="form-control">
            <label className="label text-green-700">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered bg-green-100 w-full pr-10 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                {...register("new_password", passwordRules("new_password"))}
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-green-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.new_password && (
              <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="form-control">
            <label className="label text-green-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered bg-green-100 w-full pr-10 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                {...register("confirm_new_password", passwordRules("confirm_new_password"))}
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-green-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.confirm_new_password && (
              <p className="text-red-500 text-sm mt-1">{errors.confirm_new_password.message}</p>
            )}
          </div>

          {/* Show Password Toggle */}
          <div className="form-control mt-4">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="label-text text-green-700">Show Passwords</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordChangeForm;
