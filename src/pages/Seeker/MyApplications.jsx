import { useEffect, useState } from "react";
import authApiClient from "../../services/api-client"; 
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { FaUndoAlt, FaSpinner } from "react-icons/fa";

const MyApplications = () => {
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

    const fetchMyApplications = async () => {
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

    fetchMyApplications();
  }, [user, authTokens]);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
      return;
    }

    setIsWithdrawing((prev) => ({ ...prev, [applicationId]: true }));
    setError(null);

    try {
      await authApiClient.post(`/applications/${applicationId}/withdraw/`, null, {
         headers: { Authorization: `JWT ${authTokens.access}` }, 
      });

      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId ? { ...app, status: 'withdrawn' } : app
        )
      );
      alert("Application successfully withdrawn!");
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail || "Server error occurred.";
      if (status === 400) alert(`Withdrawal failed: ${detail}`);
      else if (status === 403) alert("Withdrawal failed: Permission denied.");
      else alert("Withdrawal failed due to a network or server error.");
    } finally {
      setIsWithdrawing((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    let colorClass = 'badge-info'; 
    let text = status || 'Pending';

    if (statusLower === 'accepted' || statusLower === 'offered') {
        colorClass = 'badge-success';
    } else if (statusLower === 'rejected') {
        colorClass = 'badge-error';
    } else if (statusLower === 'withdrawn') {
        colorClass = 'badge-warning';
    } else if (statusLower === 'reviewed' || statusLower === 'interviewed') {
        colorClass = 'badge-primary';
    }

    return (
        <span className={`badge ${colorClass} text-white w-28 h-7 flex items-center justify-center text-center font-medium`}>
            {text}
        </span>
    );
  };

  if (loading) return <div className="text-center py-8">Loading your applied jobs...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        My Job Applications ({applications.length})
      </h1>

      {applications.length === 0 ? (
        <div className="text-gray-500">You have not applied to any jobs yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Job Title</th>
                <th>Company</th>
                <th className="text-center">Status</th> 
                <th>Applied On</th>
                <th className="text-center">Actions</th> {/* Centered Header */}
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => {
                const isActionable = 
                  app.status !== 'accepted' && 
                  app.status !== 'rejected' && 
                  app.status !== 'withdrawn';
                
                const withdrawing = isWithdrawing[app.id];

                return (
                  <tr key={app.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link 
                        to={`/jobs/${app.job?.id}`} 
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {app.job?.title || "Job Deleted"}
                      </Link>
                    </td>
                    <td>{app.job_employer_name || app.job?.company_name || "N/A"}</td>
                    
                    <td className="text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(app.status)}
                      </div>
                    </td>

                    <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                    
                    {/* Centered Actions Column */}
                    <td className="text-center">
                      <div className="flex justify-center gap-2 items-center">
                        <Link
                          to={`/jobs/${app.job?.id}`}
                          className="btn btn-outline btn-xs btn-info"
                        >
                          View Job
                        </Link>
                        
                        {isActionable && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            className={`btn btn-outline btn-xs ${withdrawing ? 'btn-disabled text-gray-400' : 'btn-warning'}`}
                            disabled={withdrawing}
                          >
                            {withdrawing ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <><FaUndoAlt /> Withdraw</>
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
      )}
    </div>
  );
};

export default MyApplications;