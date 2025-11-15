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
  // --- STATE AND HOOKS ---
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const { jobId } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // 1. Fetch Job Details and Check Application Status
  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      setError(null);

      const fetchJobDetails = async () => {
        try {
          // Fetch Public Job Details - Use standard apiClient
          const jobRes = await apiClient.get(`/jobs/${jobId}/`);
          setJob(jobRes.data);
          return true;
        } catch (err) {
          setError("Failed to fetch job details.");
          console.error(err);
          return false;
        }
      };

      const fetchApplicationStatus = async () => {
        // 2. Conditional Check for Protected Endpoint
        if (user && user.role === "seeker") {
          try {
            // 💡 NEW LOGIC: Use the dedicated /jobs/{id}/has-applied/ endpoint
            const hasAppliedRes = await authApiClient.get(
              `/jobs/${jobId}/has-applied/`
            );

            // The response data should be { has_applied: boolean }
            setHasApplied(hasAppliedRes.data.has_applied);
          } catch (appError) {
            // Handle common 403 or 401 errors gracefully
            if (
              appError.response &&
              (appError.response.status === 403 ||
                appError.response.status === 401)
            ) {
              console.warn(
                "Could not check application status (Authentication/Role issue)."
              );
            } else {
              console.error("Error fetching application status:", appError);
            }
            // Default to false if we can't securely check the status
            setHasApplied(false);
          }
        }
      };

      const jobSuccess = await fetchJobDetails();
      if (jobSuccess) {
        await fetchApplicationStatus();
      }

      setLoading(false);
    };

    fetchJobData();
  }, [jobId, user]);

  // --- LOADING AND ERROR STATES ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-emerald-600 loading-lg"></span>
      </div>
    );
  }
  if (error)
    return (
      <div className="text-center py-12 text-red-600 font-bold">{error}</div>
    );
  if (!job)
    return <div className="text-center py-12 font-bold">Job Not Found.</div>;

  // --- DERIVED VALUES ---
  // Check if user is the employer of this job OR an admin
  const canEdit =
    user &&
    (user.role === "admin" ||
      (user.role === "employer" && user.id === job.employer));

  // Determine the correct dashboard path based on role
  const dashboardPath =
    user?.role === "admin"
      ? "/Dashboard/Adminjobs"
      : `/Dashboard/employer/jobs/${job.id}/edit`;

  // --- RENDER ---
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center border-b pb-4 border-gray-200">
        <Link
          to="/jobs"
          className="flex items-center text-sm text-gray-500 hover:text-emerald-600 transition-colors font-semibold"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs List
        </Link>

        {/* Employer/Admin-only Dashboard Link/Edit Button */}
        {canEdit && (
          <button
            onClick={() => navigate(dashboardPath)}
            className="btn btn-sm btn-outline border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-700 flex items-center gap-2"
          >
            <FaEdit />
            {user.role === "admin" ? "Go to Admin Jobs" : "Edit This Job"}
          </button>
        )}
      </div>

      {/* Job main details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-6">
        {/* Left Column: Description & Requirements & Reviews */}
        <div className="md:col-span-2 flex flex-col">
          <div className="mb-4">
            {/* Job Header Details */}
            <h1 className="text-4xl font-extrabold tracking-tight text-emerald-600">
              {job.title}
            </h1>
            <h2 className="text-xl font-semibold mt-1 text-gray-700">
              <FaBuilding className="inline mr-2 text-emerald-400" />
              {job.company_name}
            </h2>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="badge badge-lg bg-emerald-100 text-emerald-700 border-emerald-300 font-bold">
                {job.category?.name || job.category}
              </div>
              {job.is_featured && (
                <div className="badge badge-lg bg-yellow-100 text-yellow-700 border-yellow-300 font-bold">
                  <FaStar className="mr-1 h-3 w-3" /> Featured
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none mt-6">
            <h3 className="text-2xl font-bold border-b pb-2 text-emerald-600 border-emerald-200">
              Description
            </h3>
            <p>{job.description}</p>
          </div>

          {job.requirements && (
            <div className="prose max-w-none mt-6">
              <h3 className="text-2xl font-bold border-b pb-2 text-emerald-600 border-emerald-200">
                Requirements
              </h3>
              <p>{job.requirements}</p>
            </div>
          )}

          {/* 💡 INTEGRATE REVIEW SECTION */}
          <div className="mt-12">
            <ReviewSection />
          </div>
        </div>

        {/* Right Column: Key Info & Apply Button/Form */}
        <div className="md:col-span-1 p-6 rounded-xl shadow-lg bg-white border border-emerald-100">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-emerald-600 border-emerald-200">
            Job Summary
          </h3>

          {/* Job Summary Details */}
          <div className="space-y-4 text-base">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-emerald-600 flex-shrink-0" />
              <div>
                <strong>Location:</strong>{" "}
                <span className="text-gray-600">{job.location || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaGlobe className="mt-1 text-emerald-600 flex-shrink-0" />
              <div>
                <strong>Remote Option:</strong>{" "}
                <span className="text-gray-600">
                  {job.remote_option || "None"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaBriefcase className="mt-1 text-emerald-600 flex-shrink-0" />
              <div>
                <strong>Employment:</strong>{" "}
                <span className="text-gray-600">
                  {job.employment_type || "Full-Time"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaBriefcase className="mt-1 text-emerald-600 flex-shrink-0" />
              <div>
                <strong>Experience:</strong>{" "}
                <span className="text-gray-600">
                  {job.experience_level || "Entry Level"}
                </span>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-start gap-3">
                <FaMoneyBillWave className="mt-1 text-emerald-600 flex-shrink-0" />
                <div>
                  <strong>Salary:</strong>{" "}
                  <span className="text-gray-600">
                    ৳{job.salary.toLocaleString() || "Negotiable"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <FaBriefcase className="mt-1 text-emerald-600 flex-shrink-0" />
              <div>
                <strong>Posted:</strong>{" "}
                <span className="text-gray-600">
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