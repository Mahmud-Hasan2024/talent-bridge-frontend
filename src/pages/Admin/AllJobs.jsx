import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import {
  FiExternalLink,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronRight,
  FiBriefcase,
} from "react-icons/fi";

const AllJobs = () => {
  const { user, authTokens } = useAuthContext();
  const [groupedJobs, setGroupedJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState({});

  const fetchAllJobs = async () => {
    if (!authTokens?.access || user?.role !== "admin") {
      setError("Unauthorized access.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const url = `/jobs/?all=true&no_pagination=true`;
      const res = await apiClient.get(url, {
        headers: { Authorization: `JWT ${authTokens.access}` },
      });

      const data = res.data.results || res.data || [];

      const groups = data.reduce((acc, job) => {
        const key = job.employer_name || job.company_name || "Unknown Employer";
        if (!acc[key]) acc[key] = [];
        acc[key].push(job);
        return acc;
      }, {});

      setGroupedJobs(groups);
    } catch (err) {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, [authTokens, user]);

  const toggleCompany = (company) => {
    setExpandedCompanies((prev) => ({ ...prev, [company]: !prev[company] }));
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("ADMIN ACTION: Permanently delete this job?")) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/jobs/${jobId}/`, {
        headers: { Authorization: `JWT ${authTokens.access}` },
      });
      fetchAllJobs();
    } catch (err) {
      alert("Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading Admin Job Portal...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-error font-bold">{error}</div>
    );

  return (
    <div className="p-2 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-emerald-600 dark:text-emerald-400 border-b border-base-300 pb-4">
        Global Job Management
      </h2>

      {Object.keys(groupedJobs).length === 0 ? (
        <p className="text-base-content/60">No jobs exist in the system.</p>
      ) : (
        Object.entries(groupedJobs).map(([employerName, jobs]) => (
          <div
            key={employerName}
            className="mb-4 border border-base-300 rounded-2xl overflow-hidden bg-base-100 shadow-sm"
          >
            <button
              onClick={() => toggleCompany(employerName)}
              className={`w-full flex items-center justify-between p-4 transition-colors gap-3 ${
                expandedCompanies[employerName]
                  ? "bg-emerald-600 text-white"
                  : "bg-base-100 hover:bg-base-200 text-base-content"
              }`}
            >
              <div className="flex items-center gap-3 text-left overflow-hidden">
                {expandedCompanies[employerName] ? (
                  <FiChevronDown size={20} />
                ) : (
                  <FiChevronRight size={20} />
                )}
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 overflow-hidden">
                  <span className="text-sm md:text-lg font-bold uppercase tracking-tight truncate">
                    {employerName}
                  </span>
                  <span
                    className={`text-xs font-semibold truncate ${
                      expandedCompanies[employerName]
                        ? "text-emerald-100"
                        : "text-base-content/60"
                    }`}
                  >
                    ({jobs[0]?.company_name || "N/A"})
                  </span>
                </div>
              </div>

              <span className="badge badge-sm md:badge-md shrink-0">
                {jobs.length} Jobs
              </span>
            </button>

            {expandedCompanies[employerName] && (
              <div className="p-4 bg-base-200/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300 flex flex-col justify-between h-full"
                  >
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-base-content flex items-center gap-2 text-sm md:text-base leading-tight">
                          <FiBriefcase
                            className="text-emerald-500 shrink-0"
                            size={14}
                          />
                          <span className="truncate">{job.title}</span>
                        </h4>
                        <p className="text-xs text-base-content/60 mt-1">
                          {job.location}
                        </p>
                      </div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-emerald-500 hover:text-emerald-600 shrink-0 p-1"
                        title="View Post"
                      >
                        <FiExternalLink size={18} />
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-base-200">
                      <Link
                        to={`/dashboard/admin/jobs/${job.id}/edit`}
                        className="btn btn-ghost btn-xs border border-base-300"
                      >
                        <FiEdit /> Edit
                      </Link>
                      <Link
                        to={`/dashboard/admin/applicants?job_id=${job.id}`}
                        className="btn btn-info btn-xs text-white"
                      >
                        Applicants
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="btn btn-error btn-xs text-white ml-auto"
                        disabled={isDeleting}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AllJobs;
