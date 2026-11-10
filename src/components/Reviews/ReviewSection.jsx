import { useParams } from "react-router";
import ReviewForm from "./ReviewForm";
import apiClient from "../../services/api-client";
import authApiClient from "../../services/auth-api-client";
import { useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import useAuthContext from "../../hooks/useAuthContext";

const ReviewSection = () => {
  const { jobId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [userCanReview, setUserCanReview] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [editReview, setEditReview] = useState({ rating: 0, comment: "" });
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuthContext();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/jobs/${jobId}/reviews/`);
      setReviews(res.data.results || res.data || []);
    } catch (error) {
      console.log("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await authApiClient.post(`/jobs/${jobId}/reviews/`, data);
      fetchReviews();
      alert("Review submitted successfully!");
    } catch (error) {
      if (error.response?.data?.detail) {
        alert(`Review failed: ${error.response.data.detail}`);
      } else {
        alert("You have already submitted a review for this job.");
      }
    }
  };

  const checkUserPermission = async () => {
    if (!user || user.role !== "seeker") {
      setUserCanReview(false);
      return;
    }

    try {
      const res = await authApiClient.get(`/applications/can-review/${jobId}/`);
      setUserCanReview(res.data.can_review);
    } catch (error) {
      setUserCanReview(false);
    }
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      await authApiClient.put(
        `/jobs/${jobId}/reviews/${reviewId}/`,
        editReview,
      );
      setEditingId(null);
      fetchReviews();
      alert("Review updated successfully!");
    } catch (error) {
      alert("Failed to update review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await authApiClient.delete(`/jobs/${jobId}/reviews/${reviewId}/`);
      fetchReviews();
      alert("Review deleted successfully!");
    } catch (error) {
      alert("Failed to delete review.");
    }
  };

  useEffect(() => {
    if (user) {
      checkUserPermission();
    }
    fetchReviews();
  }, [jobId, user]);

  const userReview = reviews.find(
    (review) => user && String(review.job_seeker?.id) === String(user.id),
  );

  return (
    <div className="space-y-8 mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          Employer Reviews
        </h2>
        <div className="badge badge-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 font-semibold">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </div>
      </div>

      {userCanReview && !userReview && user?.role === "seeker" && (
        <div className="card bg-base-100 shadow-lg border border-base-300 rounded-2xl p-6">
          <h3 className="card-title text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 border-b border-base-300 pb-2">
            Write a Review
          </h3>
          <ReviewForm onSubmit={onSubmit} />
        </div>
      )}

      {userReview && !editingId && (
        <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 rounded-xl font-medium">
          You have already submitted a review for this job.
        </div>
      )}

      <div className="divider"></div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 bg-base-200/50 rounded-2xl border border-base-300">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-base-content/60">
            Be the first to review this employer after your job application is
            accepted!
          </p>
        </div>
      ) : (
        <ReviewList
          reviews={reviews}
          user={user}
          editReview={editReview}
          setEditReview={setEditReview}
          editingId={editingId}
          setEditingId={setEditingId}
          handleUpdateReview={handleUpdateReview}
          handleDeleteReview={handleDeleteReview}
        />
      )}
    </div>
  );
};

export default ReviewSection;
