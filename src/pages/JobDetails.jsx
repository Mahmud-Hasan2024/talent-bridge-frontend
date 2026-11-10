import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  FaArrowLeft,
  FaEdit,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaBuilding,
  FaGlobe,
  FaStar,
} from "react-icons/fa";
import apiClient from "../services/api-client";
import authApiClient from "../services/auth-api-client";
import useAuthContext from "../hooks/useAuthContext";
import ApplyToJobForm from "./ApplyToJobForm";
import ReviewSection from "../components/Reviews/ReviewSection";

const JobDetails = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const { jobId } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      setError(null);

      try {
        const jobRes = await apiClient.get(`/jobs/${jobId}/`);
        setJob(jobRes.data);

        if (user && user.role === "seeker") {
          try {
            const hasAppliedRes = await authApiClient.get(
              `/jobs/${jobId}/has-applied/`,
            );
            setHasApplied(hasAppliedRes.data.has_applied);
          } catch {
            setHasApplied(false);
          }
        }
      } catch (err) {
        setError("Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [jobId, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-emerald-600 loading-lg"></span>
      </div>
    );
  }
  if (error)
    return (
      <div className="text-center py-12 text-error font-bold">{error}</div>
    );
  if (!job)
    return <div className="text-center py-12 font-bold">Job Not Found.</div>;

  const canEdit =
    user &&
    (user.role === "admin" ||
      (user.role === "employer" && user.id === job.employer));

  const dashboardPath =
    user?.role === "admin"
      ? `/dashboard/admin/jobs/${job.id}/edit`
      : `/dashboard/employer/jobs/${job.id}/edit`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 flex justify-between items-center border-b border-base-300 pb-4">
        <Link
          to="/jobs"
          className="flex items-center text-sm text-base-content/70 hover:text-emerald-600 transition-colors font-semibold"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs List
        </Link>

        {canEdit && (
          <button
            onClick={() => navigate(dashboardPath)}
            className="btn btn-sm btn-outline btn-success flex items-center gap-2"
          >
            <FaEdit /> Edit This Job
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-6">
        <div className="md:col-span-2 flex flex-col">
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
              {job.title}
            </h1>
            <h2 className="text-xl font-semibold mt-2 text-base-content/80 flex items-center gap-2">
              <FaBuilding className="text-emerald-500" />
              {job.company_name}
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {job.category && (
                <div className="badge badge-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 font-bold">
                  {job.category?.name || job.category}
                </div>
              )}
              {job.is_featured && (
                <div className="badge badge-lg bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30 font-bold gap-1">
                  <FaStar className="h-3 w-3" /> Featured
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-bold border-b border-base-300 pb-2 text-emerald-600 dark:text-emerald-400 mb-3">
              Description
            </h3>
            <p className="whitespace-pre-line text-base-content/80 leading-relaxed">
              {job.description}
            </p>
          </div>

          {job.requirements && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold border-b border-base-300 pb-2 text-emerald-600 dark:text-emerald-400 mb-3">
                Requirements
              </h3>
              <p className="whitespace-pre-line text-base-content/80 leading-relaxed">
                {job.requirements}
              </p>
            </div>
          )}

          <div className="mt-12">
            <ReviewSection />
          </div>
        </div>

        <div className="md:col-span-1 p-6 rounded-2xl shadow-lg bg-base-100 border border-base-300 h-fit">
          <h3 className="text-xl font-bold mb-4 border-b border-base-300 pb-2 text-emerald-600 dark:text-emerald-400">
            Job Summary
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-emerald-500 shrink-0" />
              <div>
                <strong>Location:</strong>{" "}
                <span className="text-base-content/70">
                  {job.location || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaGlobe className="mt-1 text-emerald-500 shrink-0" />
              <div className="capitalize">
                <strong>Remote Option:</strong>{" "}
                <span className="text-base-content/70">
                  {(job.remote_option || "on_site").replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaBriefcase className="mt-1 text-emerald-500 shrink-0" />
              <div className="capitalize">
                <strong>Employment:</strong>{" "}
                <span className="text-base-content/70">
                  {(job.employment_type || "full_time").replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaBriefcase className="mt-1 text-emerald-500 shrink-0" />
              <div className="capitalize">
                <strong>Experience:</strong>{" "}
                <span className="text-base-content/70">
                  {(job.experience_level || "entry_level").replace("_", " ")}
                </span>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-start gap-3">
                <FaMoneyBillWave className="mt-1 text-emerald-500 shrink-0" />
                <div>
                  <strong>Salary:</strong>{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ৳{Number(job.salary).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <FaBriefcase className="mt-1 text-emerald-500 shrink-0" />
              <div>
                <strong>Posted:</strong>{" "}
                <span className="text-base-content/70">
                  {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <ApplyToJobForm
              jobId={job.id}
              hasApplied={hasApplied}
              onApplySuccess={setHasApplied}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
