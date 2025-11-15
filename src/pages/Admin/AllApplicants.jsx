import { useEffect, useState } from "react";
import { Link } from "react-router"; 
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";

const AllApplicants = () => {
  const { authTokens, user } = useAuthContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authTokens?.access || user?.role !== 'admin') {
      setError("Access denied. Only administrators can view all applications.");
      setLoading(false);
      return;
    }

    const url = "/applications/?no_pagination=true";

    setLoading(true);
    authApiClient
      .get(url) 
      .then((res) => {
        const data = res.data.results || res.data;
        setApplications(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch all applicants:", err);
        setError(
          "Failed to load applicants. Check network or permissions."
        );
        setApplications([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authTokens, user]);

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
      default:
        return "badge-ghost";
    }
  };


  // --- Render Logic ---
  if (loading) return <div className="p-6 text-center">Loading all applicants...</div>;
  if (error) return <div className="p-6 text-center text-red-600 font-bold">{error}</div>;
  
  // If not admin, explicitly show the error message from the useEffect check
  if (user?.role !== 'admin') {
    return <div className="p-6 text-center text-red-600 font-bold">Access denied. Only administrators can view all applications.</div>;
  }


  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">
        All Job Applicants ({applications.length})
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Applicant</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Employer</th>
                <th>Status</th>
                <th className="w-[150px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app.id}>
                  <td>{index + 1}</td>
                  <td>
                    {app.applicant?.first_name} {app.applicant?.last_name}
                  </td>
                  <td>{app.applicant?.email}</td>
                  <td>{app.job?.title || "N/A"}</td>
                  <td>{app.job_employer_name || app.job?.employer_name || "N/A"}</td>
                  <td>
                    <span className={`badge ${getStatusClassName(app.status)} capitalize`}>
                        {app.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/dashboard/applications/${app.id}`} 
                      className="btn btn-sm btn-primary text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllApplicants;