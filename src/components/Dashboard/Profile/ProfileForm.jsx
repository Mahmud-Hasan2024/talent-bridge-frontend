const ProfileForm = ({ register, errors, isEditing }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">First Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered bg-base-200/60 w-full focus:border-emerald-500 transition-all"
          disabled={!isEditing}
          {...register("first_name", {
            required: isEditing ? "First name is required" : false,
          })}
        />
        {errors.first_name && (
          <p className="text-error text-sm mt-1">{errors.first_name.message}</p>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Last Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered bg-base-200/60 w-full focus:border-emerald-500 transition-all"
          disabled={!isEditing}
          {...register("last_name", {
            required: isEditing ? "Last name is required" : false,
          })}
        />
        {errors.last_name && (
          <p className="text-error text-sm mt-1">{errors.last_name.message}</p>
        )}
      </div>

      <div className="form-control md:col-span-2">
        <label className="label">
          <span className="label-text font-semibold">Email (Read-Only)</span>
        </label>
        <input
          type="email"
          className="input input-bordered bg-base-200 w-full opacity-70"
          disabled
          {...register("email")}
        />
      </div>

      <div className="form-control md:col-span-2">
        <label className="label">
          <span className="label-text font-semibold">Address</span>
        </label>
        <input
          type="text"
          className="input input-bordered bg-base-200/60 w-full focus:border-emerald-500 transition-all"
          disabled={!isEditing}
          {...register("address", {
            required: isEditing ? "Address is required" : false,
          })}
        />
        {errors.address && (
          <p className="text-error text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="form-control md:col-span-2">
        <label className="label">
          <span className="label-text font-semibold">Phone Number</span>
        </label>
        <input
          type="text"
          className="input input-bordered bg-base-200/60 w-full focus:border-emerald-500 transition-all"
          disabled={!isEditing}
          {...register("phone_number", {
            maxLength: { value: 15, message: "Phone number too long" },
          })}
        />
        {errors.phone_number && (
          <p className="text-error text-sm mt-1">
            {errors.phone_number.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
