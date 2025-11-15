import { User, Mail, Home, Phone } from "lucide-react";

const ProfileForm = ({ register, errors, isEditing }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {/* First Name */}
      <div className="form-control">
        <label className="label text-gray-700">First Name</label>
        <input
          type="text"
          className="input input-bordered bg-green-50 w-full focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          disabled={!isEditing}
          {...register("first_name", {
            required: isEditing ? "First name is required" : false,
          })}
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.first_name.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div className="form-control">
        <label className="label text-gray-700">Last Name</label>
        <input
          type="text"
          className="input input-bordered bg-green-50 w-full focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          disabled={!isEditing}
          {...register("last_name", {
            required: isEditing ? "Last name is required" : false,
          })}
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.last_name.message}
          </p>
        )}
      </div>

      {/* Email (read-only) */}
      <div className="form-control md:col-span-2">
        <label className="label text-gray-700">Email</label>
        <input
          type="email"
          className="input input-bordered bg-green-50 w-full"
          disabled
          {...register("email")}
        />
      </div>

      {/* Address */}
      <div className="form-control md:col-span-2">
        <label className="label text-gray-700">Address</label>
        <input
          type="text"
          className="input input-bordered bg-green-50 w-full focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          disabled={!isEditing}
          {...register("address", {
            required: isEditing ? "Address is required" : false,
          })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="form-control md:col-span-2">
        <label className="label text-gray-700">Phone Number</label>
        <input
          type="text"
          className="input input-bordered bg-green-50 w-full focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          disabled={!isEditing}
          {...register("phone_number", {
            maxLength: { value: 15, message: "Phone number too long" },
          })}
        />
        {errors.phone_number && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone_number.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
