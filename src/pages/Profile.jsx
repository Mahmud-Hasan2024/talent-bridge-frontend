import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuthContext from "../hooks/useAuthContext";
import ProfileForm from "../components/Dashboard/Profile/ProfileForm";
import PasswordChangeForm from "../components/Dashboard/Profile/PasswordChangeForm";
import ProfileButtons from "../components/Dashboard/Profile/ProfileButtons";
import ErroAlert from "../components/ErroAlert";
import { UserCog } from "lucide-react";

const Profile = () => {
  const { user, loadingAuth, errorMsg, updateUserProfile, changePassword } =
    useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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

  useEffect(() => {
    if (!isEditing) {
      clearErrors();
      setIsPasswordSectionOpen(false);
    }
  }, [isEditing, clearErrors]);

  const onSubmit = async (data) => {
    setSuccessMsg("");
    try {
      const res = await updateUserProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        address: data.address,
        phone_number: data.phone_number,
      });

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

      if (res?.success) {
        setSuccessMsg("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-emerald-500"></span>
      </div>
    );
  }

  return (
    <div className="py-6 flex items-center justify-center">
      <div className="card w-full max-w-3xl mx-auto bg-base-100 shadow-xl rounded-2xl border border-base-300">
        <div className="card-body p-6 md:p-8">
          {errorMsg && <ErroAlert error={errorMsg} />}
          {successMsg && (
            <div className="alert alert-success text-white font-semibold">
              {successMsg}
            </div>
          )}
          <h2 className="card-title text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-6 flex items-center justify-center gap-3">
            <UserCog size={32} /> Manage Your Profile
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ProfileForm
              register={register}
              errors={errors}
              isEditing={isEditing}
            />

            <PasswordChangeForm
              register={register}
              errors={errors}
              watch={watch}
              isEditing={isEditing}
              isPasswordSectionOpen={isPasswordSectionOpen}
              setIsPasswordSectionOpen={setIsPasswordSectionOpen}
            />

            <ProfileButtons
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isSubmitting={isSubmitting}
            />
          </form>

          <div className="mt-6 text-center">
            <span className="badge badge-outline badge-lg text-emerald-600 dark:text-emerald-400 capitalize font-semibold">
              Role: {user?.role || "Job Seeker"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
