import { FaStar, FaEdit, FaTrashAlt } from "react-icons/fa";
import EditReviewForm from "./EditReviewForm";

const ReviewCard = ({
  review,
  user,
  editReview,
  setEditReview,
  onEditClick,
  isEditing,
  onCancelEdit,
  onSaveEdit,
  onDeleteClick,
}) => {
  const userName =
    review.job_seeker?.first_name || review.job_seeker?.email || "Job Seeker";

  return (
    <div className="card bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-200 rounded-xl overflow-hidden">
      <div className="card-body p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <p className="font-semibold text-lg text-emerald-700">{userName}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Review actions: only show if the current user wrote the review */}
          {user && String(user.id) === String(review.job_seeker?.id) && (
            <div className="flex gap-2">
              <button
                onClick={onEditClick}
                className="btn btn-sm btn-outline border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                disabled={isEditing}
              >
                <FaEdit />
                Edit
              </button>
              <button
                onClick={onDeleteClick}
                className="btn btn-sm btn-outline btn-error border-red-500 text-red-500 hover:bg-red-50"
              >
                <FaTrashAlt />
                Delete
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <EditReviewForm
            editReview={editReview}
            setEditReview={setEditReview}
            onCancelEdit={onCancelEdit}
            onSave={() => onSaveEdit(review.id)}
          />
        ) : (
          <div className="mt-4">
            <p className="leading-relaxed whitespace-pre-line text-gray-700">
              {review.comment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
