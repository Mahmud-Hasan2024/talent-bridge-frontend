import StarRating from "./StarRating";

const EditReviewForm = ({
  editReview,
  setEditReview,
  onCancelEdit,
  onSave,
}) => {
  return (
    <div className="mt-4 space-y-4 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
      <div>
        <label className="label-text font-medium mb-1 block text-gray-700">Rating</label>
        <StarRating
          rating={editReview.rating}
          onChange={(value) => setEditReview({ ...editReview, rating: value })}
        />
      </div>
      <div>
        <label className="label-text font-medium mb-1 block text-gray-700">Comment</label>
        <textarea
          value={editReview.comment}
          onChange={(e) =>
            setEditReview({ ...editReview, comment: e.target.value })
          }
          className="textarea textarea-bordered w-full min-h-[100px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600">
          Save Changes
        </button>
        <button onClick={onCancelEdit} className="btn btn-sm btn-ghost text-gray-600 hover:bg-gray-200">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditReviewForm;