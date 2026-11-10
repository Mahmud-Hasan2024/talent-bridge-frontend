import { useForm } from "react-hook-form";
import StarRating from "./StarRating";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

const ReviewForm = ({ onSubmit }) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const ratingValue = watch("rating", 0);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="label font-medium">
          <span className="label-text">Rating</span>
        </label>
        <StarRating
          onChange={(value) => setValue("rating", value)}
          rating={ratingValue}
        />
        {errors.rating && (
          <p className="text-error text-sm mt-1">Rating is required</p>
        )}
        <input
          type="hidden"
          {...register("rating", { required: true, min: 1 })}
        />
      </div>

      <div className="form-control">
        <label className="label font-medium">
          <span className="label-text">Your Review</span>
        </label>
        <textarea
          {...register("comment", { required: true })}
          className="textarea textarea-bordered min-h-[120px] w-full bg-base-200/40 focus:border-emerald-500"
          placeholder="Share your experience working with this employer..."
        />
        {errors.comment && (
          <p className="text-error text-sm mt-1">Comment is required</p>
        )}
      </div>

      <button
        type="submit"
        className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <span className="flex items-center">
            <FaPaperPlane className="mr-2 h-4 w-4" />
            Submit Review
          </span>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
