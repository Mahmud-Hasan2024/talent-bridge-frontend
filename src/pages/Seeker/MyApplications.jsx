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
  const [isWithdrawing, setIsWithdrawing] = useState({}); // State to track withdrawal status per application

  // --- Data Fetching Logic ---
  useEffect(() => {
    if (!user || !authTokens?.access || !user.id || user.role !== "seeker") {
      setLoading(false);
      setError("User is not a Job Seeker or not authenticated.");
      return;
    }

    const fetchMyApplications = async () => {
      setLoading(true);
      setError(null);

      // Using the base endpoint since we are passing the token in the headers
      const url = `/applications/?applicant=${user.id}&no_pagination=true`;

      try {
        const response = await authApiClient.get(url, {
          headers: { Authorization: `JWT ${authTokens.access}` }, 
        });

        const data = response.data.results || response.data;
        setApplications(data);
      } catch (err) {
        console.error(
          "Failed to load my applications:",
          err.response?.data || err
        );
        setError("Failed to load application data. Please check network.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, [user, authTokens]);

  // --- Withdrawal Logic ---
  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
      return;
    }

    setIsWithdrawing((prev) => ({ ...prev, [applicationId]: true }));
    setError(null);

    try {
      // POST /applications/{id}/withdraw/
      await authApiClient.post(`/applications/${applicationId}/withdraw/`, null, {
         // Using headers again for explicit authorization, though interceptor should cover it
         headers: { Authorization: `JWT ${authTokens.access}` }, 
      });

      // Update local state: change status to 'withdrawn'
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId ? { ...app, status: 'withdrawn' } : app
        )
      );
      alert("Application successfully withdrawn!");

    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail || "Server error occurred.";
      console.error("Withdrawal failed:", err);
      
      if (status === 400) {
        alert(`Withdrawal failed: ${detail}. Status may prevent withdrawal.`);
      } else if (status === 403) {
        alert("Withdrawal failed: Permission denied. Only the applicant can withdraw.");
      } else {
        alert("Withdrawal failed due to a network or server error.");
      }
      
    } finally {
      setIsWithdrawing((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  // --- Helper for Status Styling ---
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    let colorClass = 'badge-info'; 
    let text = status || 'Pending';

    if (statusLower === 'accepted' || statusLower === 'offered') {
        colorClass = 'badge-success';
    } else if (statusLower === 'rejected') {
        colorClass = 'badge-error';
    } else if (statusLower === 'withdrawn') {
        colorClass = 'badge-warning'; // Use warning color for withdrawn status
    } else if (statusLower === 'reviewed' || statusLower === 'interviewed') {
        colorClass = 'badge-primary';
    }

    return (
        <span className={`badge ${colorClass} text-white`}>
            {text}
        </span>
    );
  };

  // --- Rendering ---
  if (loading)
    return <div className="text-center py-8">Loading your applied jobs...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        My Job Applications ({applications.length})
      </h1>

      {applications.length === 0 ? (
        <div className="text-gray-500">
          You have not applied to any jobs yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Job Title</th>
                <th>Company</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Actions</th>
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
                    <td>
                      {app.job_employer_name || app.job?.company_name || "N/A"}
                    </td>
                    <td>
                      {getStatusBadge(app.status)}
                    </td>
                    <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td className="flex gap-2 items-center">
                      <Link
                        to={`/jobs/${app.job?.id}`}
                        className="btn btn-outline btn-xs btn-info"
                      >
                        View Job
                      </Link>
                      
                      {/* 💡 WITHDRAW BUTTON LOGIC */}
                      {isActionable && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className={`btn btn-outline btn-xs ${withdrawing ? 'btn-disabled text-gray-400' : 'btn-warning'}`}
                          disabled={withdrawing}
                        >
                          {withdrawing ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span className="ml-1">Withdrawing...</span>
                            </>
                          ) : (
                            <>
                              <FaUndoAlt /> 
                              Withdraw
                            </>
                          )}
                        </button>
                      )}
                      
                      {!isActionable && app.status !== 'withdrawn' && (
                        <span className="text-gray-500 text-xs">Action Finalized</span>
                      )}

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