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
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-300 rounded-2xl overflow-hidden">
      <div className="card-body p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
              {userName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < review.rating ? "text-amber-400" : "text-base-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-base-content/50">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {user && String(user.id) === String(review.job_seeker?.id) && (
            <div className="flex gap-2">
              <button
                onClick={onEditClick}
                className="btn btn-sm btn-outline btn-success"
                disabled={isEditing}
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={onDeleteClick}
                className="btn btn-sm btn-outline btn-error"
              >
                <FaTrashAlt /> Delete
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
            <p className="leading-relaxed whitespace-pre-line text-base-content/80">
              {review.comment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
