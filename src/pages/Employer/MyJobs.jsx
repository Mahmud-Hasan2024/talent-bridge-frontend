import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link, useSearchParams } from "react-router";
import { FiExternalLink, FiStar } from "react-icons/fi";

const MyJobs = () => {
  const { user, authTokens } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [payingJobId, setPayingJobId] = useState(null);

  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    if (!authTokens?.access || !user?.id) {
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const url = `/jobs/?employer=${user.id}&no_pagination=true`;
        const res = await apiClient.get(url, {
          headers: { Authorization: `JWT ${authTokens.access}` },
        });
        const data = res.data.results || res.data || [];
        setJobs(data);
      } catch (err) {
        setError("Failed to load your posted jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [authTokens, user]);

  const handleDeleteJob = async (jobId) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this job?")
    )
      return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/jobs/${jobId}/`, {
        headers: { Authorization: `JWT ${authTokens.access}` },
      });
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setDeleteError("Failed to delete the job.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFeatureJob = async (jobId) => {
    setPayingJobId(jobId);
    try {
      const res = await apiClient.post(
        `/payments/initiate/${jobId}/`,
        { job_id: jobId },
        { headers: { Authorization: `JWT ${authTokens.access}` } },
      );
      const gatewayUrl = res.data?.payment_url || res.data?.GatewayPageURL;
      if (gatewayUrl) {
        window.location.href = gatewayUrl;
      } else {
        alert("Payment gateway did not return a redirect URL.");
      }
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Failed to initiate SSLCommerz sandbox session.",
      );
    } finally {
      setPayingJobId(null);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading your jobs...</div>;
  if (error) return <div className="text-center py-8 text-error">{error}</div>;

  return (
    <div className="p-2 md:p-6 max-w-6xl mx-auto">
      {paymentStatus === "success" && (
        <div className="alert alert-success text-white mb-6 shadow-md flex justify-between">
          <span>🎉 Payment successful! Your job listing is now Featured.</span>
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => setSearchParams({})}
          >
            Dismiss
          </button>
        </div>
      )}
      {(paymentStatus === "failed" || paymentStatus === "cancelled") && (
        <div className="alert alert-warning mb-6 shadow-md flex justify-between">
          <span>
            Payment was {paymentStatus}. You can try featuring your job again
            anytime.
          </span>
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => setSearchParams({})}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
          {user?.first_name || "My"} Posted Jobs ({jobs.length})
        </h2>
        <Link
          to="/dashboard/employer/post-job"
          className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none w-full sm:w-auto rounded-xl"
        >
          + Post New Job
        </Link>
      </div>

      {deleteError && (
        <div className="alert alert-error mb-4">
          <p>{deleteError}</p>
        </div>
      )}

      {jobs.length === 0 ? (
        <p className="text-base-content/60">
          No jobs posted yet.{" "}
          <Link
            to="/dashboard/employer/post-job"
            className="text-emerald-600 hover:underline font-bold"
          >
            Post one now!
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className="font-bold text-lg md:text-xl text-base-content truncate">
                      {job.title}
                    </h3>
                    {job.is_featured && (
                      <span className="badge badge-warning badge-sm font-bold shrink-0">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-emerald-500 shrink-0 p-1 hover:scale-110 transition"
                    title="View public post"
                  >
                    <FiExternalLink size={20} />
                  </Link>
                </div>
                <p className="text-base-content/60 mt-1 font-medium">
                  {job.location} • ৳{Number(job.salary || 0).toLocaleString()}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-base-200">
                <Link
                  to={`/dashboard/employer/jobs/${job.id}/edit`}
                  className="btn btn-outline btn-sm font-bold"
                >
                  Edit
                </Link>
                <Link
                  to={`/dashboard/employer/applicants?job_id=${job.id}`}
                  className="btn bg-emerald-600 hover:bg-emerald-700 border-none btn-sm text-white font-bold"
                >
                  Applicants
                </Link>
                {!job.is_featured && (
                  <button
                    onClick={() => handleFeatureJob(job.id)}
                    disabled={payingJobId === job.id}
                    className="btn btn-warning btn-sm font-bold text-slate-900 gap-1"
                  >
                    <FiStar />
                    {payingJobId === job.id
                      ? "Redirecting..."
                      : "Feature (৳500)"}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="btn btn-error btn-outline btn-sm font-bold ml-auto"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
