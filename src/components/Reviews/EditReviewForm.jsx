import StarRating from "./StarRating";

const EditReviewForm = ({
  editReview,
  setEditReview,
  onCancelEdit,
  onSave,
}) => {
  return (
    <div className="mt-4 space-y-4 bg-base-200 p-4 rounded-xl border border-base-300">
      <div>
        <label className="label-text font-medium mb-1 block">Rating</label>
        <StarRating
          rating={editReview.rating}
          onChange={(value) => setEditReview({ ...editReview, rating: value })}
        />
      </div>
      <div>
        <label className="label-text font-medium mb-1 block">Comment</label>
        <textarea
          value={editReview.comment}
          onChange={(e) =>
            setEditReview({ ...editReview, comment: e.target.value })
          }
          className="textarea textarea-bordered w-full min-h-[100px] bg-base-100"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none"
        >
          Save Changes
        </button>
        <button onClick={onCancelEdit} className="btn btn-sm btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditReviewForm;
