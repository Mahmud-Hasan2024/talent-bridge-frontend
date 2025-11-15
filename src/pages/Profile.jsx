import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import ProfileForm from "../components/dashboard/Profile/ProfileForm";
import PasswordChangeForm from "../components/dashboard/Profile/PasswordChangeForm";
import ProfileButtons from "../components/dashboard/Profile/ProfileButtons";
import ErroAlert from "../components/ErroAlert";
import { UserCog } from "lucide-react";

const Profile = () => {
  const { user, loadingAuth, errorMsg, updateUserProfile, changePassword } =
    useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      phone_number: "",
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    mode: "onSubmit",
  });

  // Populate form with user data
  useEffect(() => {
    if (!loadingAuth && user) {
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        address: user.address || "",
        phone_number: user.phone_number || "",
      });
      clearErrors();
    }
  }, [user, loadingAuth, reset, clearErrors]);

  // Clear errors when exiting edit mode
  useEffect(() => {
    if (!isEditing) {
      clearErrors();
      setIsPasswordSectionOpen(false);
    }
  }, [isEditing, clearErrors]);

  const onSubmit = async (data) => {
    try {
      // Update profile
      await updateUserProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        address: data.address,
        phone_number: data.phone_number,
      });

      // Change password if section open
      if (isPasswordSectionOpen && data.current_password && data.new_password) {
        if (data.new_password !== data.confirm_new_password) return;
        await changePassword({
          current_password: data.current_password,
          new_password: data.new_password,
        });
        setIsPasswordSectionOpen(false);
        setValue("current_password", "");
        setValue("new_password", "");
        setValue("confirm_new_password", "");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-green-500"></span>
        <p className="ml-2 text-gray-700">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 flex items-center justify-center">
      <div className="card w-full max-w-3xl mx-auto bg-base-100 shadow-2xl rounded-xl border border-green-300">
        <div className="card-body p-8">
          {errorMsg && <ErroAlert error={errorMsg} />}
          <h2 className="card-title text-4xl font-extrabold text-green-700 mb-6 flex items-center justify-center gap-3">
            <UserCog size={36} /> Manage Your Profile
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Fields */}
            <ProfileForm
              register={register}
              errors={errors}
              isEditing={isEditing}
            />

            {/* Password Change */}
            <PasswordChangeForm
              register={register}
              errors={errors}
              watch={watch}
              isEditing={isEditing}
              isPasswordSectionOpen={isPasswordSectionOpen}
              setIsPasswordSectionOpen={setIsPasswordSectionOpen}
            />

            {/* Buttons */}
            <ProfileButtons
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isSubmitting={isSubmitting}
            />
          </form>

          {/* User Role */}
          <div className="mt-6 text-center">
            <span className="badge badge-outline badge-lg text-green-700">
              Role: {user?.role || "Job Seeker"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
