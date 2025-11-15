import ReviewCard from "./ReviewCard";

const ReviewList = ({
  reviews,
  user,
  editReview,
  setEditReview,
  editingId,
  setEditingId,
  handleUpdateReview,
  handleDeleteReview,
}) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          isEditing={editingId === review.id}
          user={user} 
          editReview={editReview}
          setEditReview={setEditReview}
          onEditClick={() => {
            setEditingId(review.id);
            setEditReview({
              rating: review.rating,
              comment: review.comment,
            });
          }}
          onCancelEdit={() => setEditingId(null)}
          onSaveEdit={handleUpdateReview}
          onDeleteClick={() => handleDeleteReview(review.id)}
        />
      ))}
    </div>
  );
};

export default ReviewList;