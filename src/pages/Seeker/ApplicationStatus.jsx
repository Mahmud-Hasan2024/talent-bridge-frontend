import { useEffect, useState } from "react";
import authApiClient from "../../services/api-client"; 
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { FaUndoAlt, FaSpinner, FaChevronDown } from "react-icons/fa";

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
        const response = await authApiClient.get(url, {
          headers: { Authorization: `JWT ${authTokens.access}` }, 
        });
        const data = response.data.results || response.data;
        setApplications(data);
      } catch (err) {
        console.error("Failed to load my applications:", err.response?.data || err);
        setError("Failed to load application data. Please check network.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationStatus();
  }, [user, authTokens]);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    setIsWithdrawing((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await authApiClient.post(`/applications/${applicationId}/withdraw/`, null, {
         headers: { Authorization: `JWT ${authTokens.access}` }, 
      });
      setApplications((prevApps) =>
        prevApps.map((app) => app.id === applicationId ? { ...app, status: 'withdrawn' } : app)
      );
    } catch (err) {
      alert("Withdrawal failed.");
    } finally {
      setIsWithdrawing((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  // --- Logic to Group Applications by Status ---
  const groupedApplications = applications.reduce((groups, app) => {
    const status = app.status || 'Pending';
    if (!groups[status]) groups[status] = [];
    groups[status].push(app);
    return groups;
  }, {});

  // Define the order you want statuses to appear
  const statusOrder = ['Interviewed', 'Reviewed', 'Accepted', 'Offered', 'Pending', 'Rejected', 'Withdrawn'];
  const sortedStatuses = Object.keys(groupedApplications).sort((a, b) => {
    return statusOrder.indexOf(a) - statusOrder.indexOf(b);
  });

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s === 'accepted' || s === 'offered') return 'bg-success text-success-content';
    if (s === 'rejected') return 'bg-error text-error-content';
    if (s === 'withdrawn') return 'bg-warning text-warning-content';
    if (s === 'interviewed' || s === 'reviewed') return 'bg-primary text-primary-content';
    return 'bg-info text-info-content';
  };

  if (loading) return <div className="text-center py-8">Loading your applied jobs...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">My Job Applications</h1>

      {applications.length === 0 ? (
        <div className="text-gray-500">You have not applied to any jobs yet.</div>
      ) : (
        <div className="space-y-8">
          {sortedStatuses.map((statusName) => (
            <div key={statusName} className="collapse collapse-arrow bg-white shadow-md border border-gray-100 rounded-xl">
              <input type="checkbox" defaultChecked /> {/* Keeps sections open by default */}
              
              <div className="collapse-title flex items-center gap-4 py-4 px-6">
                <span className={`badge border-none font-bold px-4 py-3 ${getStatusColor(statusName)}`}>
                  {statusName}
                </span>
                <span className="text-gray-400 font-medium">
                  {groupedApplications[statusName].length} {groupedApplications[statusName].length === 1 ? 'Application' : 'Applications'}
                </span>
              </div>

              <div className="collapse-content px-0">
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full mb-0">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="pl-6">Job Title</th>
                        <th>Company</th>
                        <th>Applied On</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedApplications[statusName].map((app) => {
                        const isActionable = !['accepted', 'rejected', 'withdrawn'].includes(app.status?.toLowerCase());
                        const withdrawing = isWithdrawing[app.id];

                        return (
                          <tr key={app.id}>
                            <td className="pl-6">
                              <Link to={`/jobs/${app.job?.id}`} className="text-blue-600 hover:underline font-semibold">
                                {app.job?.title || "Job Deleted"}
                              </Link>
                            </td>
                            <td>{app.job_employer_name || app.job?.company_name || "N/A"}</td>
                            <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                            <td className="text-center">
                              <div className="flex justify-center gap-2">
                                <Link to={`/jobs/${app.job?.id}`} className="btn btn-outline btn-xs btn-info">
                                  View Job
                                </Link>
                                {isActionable && (
                                  <button
                                    onClick={() => handleWithdraw(app.id)}
                                    className={`btn btn-outline btn-xs btn-warning ${withdrawing ? 'btn-disabled' : ''}`}
                                    disabled={withdrawing}
                                  >
                                    {withdrawing ? <FaSpinner className="animate-spin" /> : <><FaUndoAlt /> Withdraw</>}
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