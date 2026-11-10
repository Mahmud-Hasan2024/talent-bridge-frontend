import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import {
  FiChevronDown,
  FiChevronRight,
  FiBriefcase,
  FiMapPin,
  FiEye,
  FiExternalLink,
} from "react-icons/fi";

const AllApplicants = () => {
  const { authTokens, user } = useAuthContext();
  const [jobsData, setJobsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedJobs, setExpandedJobs] = useState({});

  const fetchMasterData = async () => {
    if (user?.role !== "admin") return;
    setLoading(true);
    try {
      const url = "/applications/?no_pagination=true";
      const res = await apiClient.get(url, {
        headers: { Authorization: `JWT ${authTokens.access}` },
      });

      const allApps = res.data.results || res.data || [];

      const groupedByJob = allApps.reduce((acc, app) => {
        const jobId = app.job?.id;
        if (!acc[jobId]) {
          acc[jobId] = {
            id: jobId,
            title: app.job?.title || "Untitled Position",
            company: app.job_employer_name || app.job?.company_name || "N/A",
            location: app.job?.location || "N/A",
            employmentType: app.job?.employment_type || "N/A",
            remoteOption: app.job?.remote_option || "On-site",
            applicants: [],
          };
        }
        acc[jobId].applicants.push(app);
        return acc;
      }, {});

      setJobsData(groupedByJob);
    } catch (err) {
      console.error("Master view fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, [authTokens, user]);

  const toggleJob = (jobId) => {
    setExpandedJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  if (loading)
    return <div className="p-10 text-center">Loading Job Hierarchy...</div>;

  return (
    <div className="p-2 md:p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
          Job Applicant Manager
        </h2>
        <p className="text-base-content/60">
          Click on a job card to expand or collapse applicants.
        </p>
      </header>

      <div className="space-y-4">
        {Object.entries(jobsData).map(([jobId, data]) => (
          <div
            key={jobId}
            className="border border-base-300 rounded-2xl bg-base-100 shadow-sm overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleJob(jobId)}
              className={`w-full flex items-center justify-between p-5 text-left transition cursor-pointer group ${
                expandedJobs[jobId]
                  ? "bg-emerald-500/10"
                  : "bg-base-100 hover:bg-base-200/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-xl transition-transform group-hover:scale-105 ${
                    expandedJobs[jobId]
                      ? "bg-emerald-600 text-white"
                      : "bg-base-200 text-base-content/60"
                  }`}
                >
                  <FiBriefcase size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-base-content leading-tight">
                    {data.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-base-content/60">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {data.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin size={12} /> {data.location}
                    </span>
                    <span className="bg-base-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                      {data.employmentType.replace("_", " ")} •{" "}
                      {data.remoteOption.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right mr-2">
                  <span className="text-xs font-bold uppercase text-base-content/50">
                    Applicants
                  </span>
                  <p className="text-lg font-black text-base-content">
                    {data.applicants.length}
                  </p>
                </div>
                {expandedJobs[jobId] ? (
                  <FiChevronDown size={24} className="text-emerald-600" />
                ) : (
                  <FiChevronRight size={24} className="text-base-content/40" />
                )}
              </div>
            </button>

            {expandedJobs[jobId] && (
              <div className="border-t border-base-300 bg-base-100 p-4">
                <div className="flex flex-wrap justify-between items-center mb-4 px-2 gap-3">
                  <h4 className="text-sm font-bold text-base-content/50 uppercase tracking-widest">
                    Candidate List
                  </h4>

                  <div className="flex items-center gap-4">
                    <Link
                      to={`/jobs/${jobId}`}
                      className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      <FiExternalLink size={14} /> View Public Post
                    </Link>

                    <Link
                      to={`/dashboard/admin/jobs/${jobId}/edit`}
                      className="flex items-center gap-1 text-xs text-info font-bold hover:underline"
                    >
                      <FiEye size={14} /> Edit Job Details
                    </Link>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-300">
                  <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Date Applied</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.applicants.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
                                {app.applicant?.first_name?.[0] || "U"}
                              </div>
                              <span className="font-semibold text-base-content">
                                {app.applicant?.first_name}{" "}
                                {app.applicant?.last_name}
                              </span>
                            </div>
                          </td>
                          <td className="text-sm text-base-content/70">
                            {app.applicant?.email}
                          </td>
                          <td>
                            <span className="badge badge-sm badge-outline capitalize font-bold text-[10px]">
                              {app.status}
                            </span>
                          </td>
                          <td className="text-xs text-base-content/60">
                            {new Date(app.applied_at).toLocaleDateString()}
                          </td>
                          <td className="text-right">
                            <Link
                              to={`/dashboard/applications/${app.id}`}
                              className="btn btn-ghost btn-xs text-emerald-600 dark:text-emerald-400 font-bold"
                            >
                              View Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApplicants;
