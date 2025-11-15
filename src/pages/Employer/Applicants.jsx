import { useEffect, useState, useCallback } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";

const Applicants = () => {
  const { user, authTokens } = useAuthContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChoices, setStatusChoices] = useState([]);
  const [updatingAppId, setUpdatingAppId] = useState(null);

  // --- 1. Fetch Applications Function (Memoized for useEffect) ---
  const fetchApplications = useCallback(async () => {
    if (!user || !authTokens?.access || !user.id || user.role !== "employer") {
      return false;
    }

    const url = `/applications/?job__employer=${user.id}&no_pagination=true`;

    try {
      const response = await authApiClient.get(url);
      const data = response.data.results || response.data;
      setApplications(data);
      return true;
    } catch (err) {
      console.error("Failed to load applicants:", err);
      return false;
    }
  }, [user, authTokens]);

  // --- 2. Initial Data Fetch Effect (Status Choices + Applicants) ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      // Check authentication conditions early
      if (
        !user ||
        !authTokens?.access ||
        !user.id ||
        user.role !== "employer"
      ) {
        setError("You must be a logged-in employer to view this page.");
        setLoading(false);
        return;
      }

      try {
        // Fetch Status Choices
        const choicesRes = await authApiClient.get(
          "/applications/status-choices/"
        );
        setStatusChoices(choicesRes.data);

        // Fetch Applicants
        await fetchApplications();
      } catch (err) {
        console.error(
          "Failed to load initial data:",
          err.response?.data || err
        );
        setError(
          "Failed to load applicant data or status options. Check server connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user, authTokens, fetchApplications]);

  // --- 3. Function to handle status change (PATCH request) ---
  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingAppId(appId);

    try {
      // Send PATCH request to update the status
      const response = await authApiClient.patch(`/applications/${appId}/`, {
        status: newStatus,
      });

      // Update the local state using the complete, fresh object
      setApplications((prevApps) =>
        prevApps.map((app) => (app.id === appId ? response.data : app))
      );

      alert(`Application status updated to ${newStatus.toUpperCase()}.`);
    } catch (err) {
      console.error("Status update failed:", err.response?.data || err);
      const errorDetail =
        err.response?.data?.status?.[0] ||
        err.response?.data?.detail ||
        "Server error";
      alert(`Failed to update status: ${errorDetail}`);
    } finally {
      setUpdatingAppId(null);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-lg font-semibold text-green-700">
        Loading applicants...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 text-red-600 font-bold">{error}</div>
    );

  const getStatusClassName = (statusValue) => {
    switch (statusValue) {
      case "accepted":
        return "badge-success";
      case "rejected":
        return "badge-error";
      case "interviewed":
        return "badge-warning";
      case "offered":
        return "badge-info";
      case "withdrawn":
        return "badge-info opacity-70";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Applicants for Your Jobs ({applications.length})
      </h1>

      {applications.length === 0 ? (
        <div className="text-gray-500">
          No applicants have applied yet to any of your jobs.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Applicant</th>
                <th>Applied Job</th>
                <th>Status</th>
                <th>Applied On</th>
                <th className="w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => {
                const isUpdating = updatingAppId === app.id;
                const statusClass = getStatusClassName(app.status);

                return (
                  <tr key={app.id}>
                    <td>{index + 1}</td>
                    <td>
                      {app.applicant?.first_name}{" "}
                      {app.applicant?.last_name || "N/A"}
                    </td>
                    <td>{app.job?.title || "Job Deleted"}</td>

                    {/* DYNAMIC STATUS DROPDOWN */}
                    <td className="w-[150px]">
                      <select
                        className={`select select-sm w-full font-semibold ${statusClass}`}
                        value={app.status || "pending"}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value)
                        }
                        disabled={isUpdating}
                      >
                        {/* Map over the fetched status choices */}
                        {statusChoices.map((status) => (
                          <option
                            key={status.value}
                            value={status.value}
                            // Prevent employer from manually setting 'withdrawn'
                            disabled={status.value === "withdrawn"}
                          >
                            {status.label}
                          </option>
                        ))}
                      </select>
                      {isUpdating && (
                        <span className="loading loading-spinner loading-xs text-green-600 ml-2"></span>
                      )}
                    </td>

                    <td>{new Date(app.applied_at).toLocaleDateString()}</td>

                    {/* Actions buttons */}
                    <td className="flex flex-col gap-1">
                      <Link
                        to={`/jobs/${app.job?.id}`}
                        className="btn btn-outline btn-xs w-full"
                      >
                        View Job
                      </Link>
                      <Link
                        to={`/Dashboard/applications/${app.id}`} 
                        className="btn btn-primary btn-xs text-white bg-green-600 hover:bg-green-700 w-full"
                      >
                        View Applicant
                      </Link>
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

export default Applicants;