import { useEffect, useState } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { FaUndoAlt, FaSpinner } from "react-icons/fa";

const ApplicationStatus = () => {
  const { user, authTokens } = useAuthContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState({});

  useEffect(() => {
    if (!user || !authTokens?.access || !user.id || user.role !== "seeker") {
      setLoading(false);
      setError("User is not a Job Seeker or not authenticated.");
      return;
    }

    const fetchApplicationStatus = async () => {
      setLoading(true);
      setError(null);
      const url = `/applications/?applicant=${user.id}&no_pagination=true`;

      try {
        const response = await authApiClient.get(url);
        const data = response.data.results || response.data || [];
        setApplications(data);
      } catch (err) {
        setError("Failed to load application data. Please check network.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationStatus();
  }, [user, authTokens]);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?"))
      return;
    setIsWithdrawing((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await authApiClient.post(`/applications/${applicationId}/withdraw/`);
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId ? { ...app, status: "withdrawn" } : app,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.detail || "Withdrawal failed.");
    } finally {
      setIsWithdrawing((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const groupedApplications = applications.reduce((groups, app) => {
    const status = (app.status || "pending").toLowerCase();
    if (!groups[status]) groups[status] = [];
    groups[status].push(app);
    return groups;
  }, {});

  const statusOrder = [
    "offered",
    "accepted",
    "interviewed",
    "reviewed",
    "pending",
    "rejected",
    "withdrawn",
  ];
  const sortedStatuses = Object.keys(groupedApplications).sort(
    (a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b),
  );

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s === "accepted" || s === "offered") return "badge-success text-white";
    if (s === "rejected") return "badge-error text-white";
    if (s === "withdrawn") return "badge-warning text-slate-900";
    if (s === "interviewed" || s === "reviewed")
      return "badge-primary text-white";
    return "badge-info text-white";
  };

  if (loading)
    return <div className="text-center py-8">Loading your applied jobs...</div>;
  if (error) return <div className="text-center py-8 text-error">{error}</div>;

  return (
    <div className="p-2 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-emerald-600 dark:text-emerald-400">
        My Job Applications ({applications.length})
      </h1>

      {applications.length === 0 ? (
        <div className="text-base-content/60">
          You have not applied to any jobs yet.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedStatuses.map((statusName) => (
            <div
              key={statusName}
              className="collapse collapse-arrow bg-base-100 shadow-sm border border-base-300 rounded-2xl"
            >
              <input type="checkbox" defaultChecked />

              <div className="collapse-title flex items-center gap-4 py-4 px-6">
                <span
                  className={`badge font-bold px-4 py-3 capitalize ${getStatusColor(
                    statusName,
                  )}`}
                >
                  {statusName}
                </span>
                <span className="text-base-content/60 font-medium text-sm">
                  {groupedApplications[statusName].length}{" "}
                  {groupedApplications[statusName].length === 1
                    ? "Application"
                    : "Applications"}
                </span>
              </div>

              <div className="collapse-content px-0">
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full mb-0">
                    <thead className="bg-base-200">
                      <tr>
                        <th className="pl-6">Job Title</th>
                        <th>Company</th>
                        <th>Applied On</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedApplications[statusName].map((app) => {
                        const isActionable = ![
                          "accepted",
                          "rejected",
                          "withdrawn",
                        ].includes(app.status?.toLowerCase());
                        const withdrawing = isWithdrawing[app.id];

                        return (
                          <tr key={app.id}>
                            <td className="pl-6">
                              <Link
                                to={`/jobs/${app.job?.id}`}
                                className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                              >
                                {app.job?.title || "Job Deleted"}
                              </Link>
                            </td>
                            <td>
                              {app.job?.company_name ||
                                app.job_employer_name ||
                                "N/A"}
                            </td>
                            <td>
                              {new Date(app.applied_at).toLocaleDateString()}
                            </td>
                            <td className="text-center">
                              <div className="flex justify-center gap-2">
                                <Link
                                  to={`/jobs/${app.job?.id}`}
                                  className="btn btn-outline btn-xs btn-success"
                                >
                                  View Job
                                </Link>
                                {isActionable && (
                                  <button
                                    onClick={() => handleWithdraw(app.id)}
                                    className="btn btn-outline btn-xs btn-warning"
                                    disabled={withdrawing}
                                  >
                                    {withdrawing ? (
                                      <FaSpinner className="animate-spin" />
                                    ) : (
                                      <>
                                        <FaUndoAlt /> Withdraw
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;
