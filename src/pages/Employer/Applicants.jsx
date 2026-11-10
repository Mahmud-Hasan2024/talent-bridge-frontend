import { useEffect, useState, useCallback } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import {
  FiChevronDown,
  FiChevronRight,
  FiBriefcase,
  FiCheckCircle,
} from "react-icons/fi";

const Applicants = () => {
  const { user, authTokens } = useAuthContext();
  const [jobsData, setJobsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChoices, setStatusChoices] = useState([]);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [updatingAppId, setUpdatingAppId] = useState(null);

  const fetchMasterData = useCallback(async () => {
    if (!user || !authTokens?.access || user.role !== "employer") {
      setError("Unauthorized access.");
      setLoading(false);
      return;
    }

    try {
      const [choicesRes, appsRes] = await Promise.all([
        authApiClient.get("/applications/status-choices/"),
        authApiClient.get(
          `/applications/?job__employer=${user.id}&no_pagination=true`,
        ),
      ]);
      setStatusChoices(choicesRes.data);
      const allApps = appsRes.data.results || appsRes.data || [];

      const grouped = allApps.reduce((acc, app) => {
        const jobId = app.job?.id;
        if (!jobId) return acc;
        if (!acc[jobId]) {
          acc[jobId] = {
            employerFullName: app.job_employer_name || "Employer",
            title: app.job?.title || "Untitled Position",
            location: app.job?.location || "N/A",
            type: app.job?.employment_type || "N/A",
            remote: app.job?.remote_option || "On-site",
            applicants: [],
          };
        }
        acc[jobId].applicants.push(app);
        return acc;
      }, {});
      setJobsData(grouped);
    } catch (err) {
      setError("Failed to load applicant data.");
    } finally {
      setLoading(false);
    }
  }, [user, authTokens]);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  const toggleJob = (jobId) => {
    setExpandedJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const handleStatusChange = async (appId, jobId, newStatus) => {
    setUpdatingAppId(appId);
    try {
      const response = await authApiClient.patch(`/applications/${appId}/`, {
        status: newStatus,
      });
      setJobsData((prev) => {
        const updatedJobs = { ...prev };
        if (updatedJobs[jobId]) {
          updatedJobs[jobId].applicants = updatedJobs[jobId].applicants.map(
            (app) =>
              app.id === appId ? { ...app, status: response.data.status } : app,
          );
        }
        return updatedJobs;
      });
    } catch (err) {
      alert("Update failed.");
    } finally {
      setUpdatingAppId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "accepted":
        return "bg-success text-white border-success";
      case "rejected":
        return "bg-error text-white border-error";
      case "interviewed":
        return "bg-warning text-slate-900 border-warning";
      case "offered":
        return "bg-info text-white border-info";
      default:
        return "bg-base-200 border-base-300";
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-emerald-600">
        Loading Applications...
      </div>
    );
  if (error)
    return <div className="p-10 text-center text-error font-bold">{error}</div>;

  const firstJobKey = Object.keys(jobsData)[0];
  const displayEmployerName =
    jobsData[firstJobKey]?.employerFullName || user?.first_name || "Employer";

  return (
    <div className="p-2 md:p-6 max-w-6xl mx-auto">
      <header className="mb-8 border-b border-base-300 pb-5">
        <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-tight">
          {displayEmployerName}'s Applicants
        </h2>
        <p className="text-base-content/60 font-medium text-sm md:text-base">
          Reviewing{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {Object.keys(jobsData).length}
          </span>{" "}
          active job posts with applications.
        </p>
      </header>

      <div className="space-y-4">
        {Object.entries(jobsData).map(([jobId, data]) => (
          <div
            key={jobId}
            className="border rounded-2xl bg-base-100 shadow-sm overflow-hidden border-base-300"
          >
            <button
              onClick={() => toggleJob(jobId)}
              className={`w-full flex items-start justify-between p-4 md:p-5 text-left transition ${
                expandedJobs[jobId]
                  ? "bg-emerald-500/10"
                  : "bg-base-100 hover:bg-base-200/50"
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <div
                  className={`p-2.5 rounded-xl hidden sm:block ${
                    expandedJobs[jobId]
                      ? "bg-emerald-600 text-white"
                      : "bg-base-200 text-base-content/60"
                  }`}
                >
                  <FiBriefcase size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg md:text-xl text-base-content truncate">
                    {data.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-base-content/60 font-medium">
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <FiCheckCircle /> {data.applicants.length} Candidates
                    </span>
                    <span>•</span>
                    <span className="uppercase text-[10px] font-bold bg-base-200 px-2 py-0.5 rounded">
                      {data.type.replace("_", " ")} •{" "}
                      {data.remote.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 ml-2">
                {expandedJobs[jobId] ? (
                  <FiChevronDown size={24} className="text-emerald-600" />
                ) : (
                  <FiChevronRight size={24} className="text-base-content/40" />
                )}
              </div>
            </button>

            {expandedJobs[jobId] && (
              <div className="border-t border-base-300 bg-base-100 p-2 md:p-5 overflow-hidden">
                <div className="overflow-x-auto rounded-xl border border-base-300">
                  <table className="table w-full">
                    <thead className="bg-base-200 text-base-content/70 uppercase text-[10px]">
                      <tr>
                        <th className="py-4">Candidate</th>
                        <th className="hidden md:table-cell">Applied</th>
                        <th>Decision</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.applicants.map((app) => {
                        const u = app.applicant || {};
                        const candidateName =
                          u.first_name || u.last_name
                            ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
                            : u.email || "Applicant";

                        return (
                          <tr
                            key={app.id}
                            className="hover:bg-base-200/40 border-b border-base-200 last:border-0"
                          >
                            <td>
                              <div className="flex items-center gap-3 py-2">
                                <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold uppercase text-sm">
                                  {candidateName[0]}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-base-content text-sm truncate">
                                    {candidateName}
                                  </p>
                                  <p className="text-xs text-base-content/60 truncate">
                                    {u.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="hidden md:table-cell text-xs text-base-content/60 font-semibold">
                              {new Date(app.applied_at).toLocaleDateString()}
                            </td>
                            <td>
                              <select
                                className={`select select-bordered select-xs w-28 md:w-36 font-bold capitalize text-[11px] ${getStatusClass(
                                  app.status,
                                )}`}
                                value={app.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    app.id,
                                    jobId,
                                    e.target.value,
                                  )
                                }
                                disabled={
                                  updatingAppId === app.id ||
                                  app.status === "withdrawn"
                                }
                              >
                                {statusChoices.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="text-right">
                              <Link
                                to={`/dashboard/applications/${app.id}`}
                                className="btn btn-xs md:btn-sm btn-ghost text-emerald-600 dark:text-emerald-400 font-black"
                              >
                                Review
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
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

export default Applicants;
