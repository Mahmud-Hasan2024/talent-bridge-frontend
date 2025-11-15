import { useState, useEffect } from "react";
import { Link } from "react-router"; 
import { FiEdit, FiTrash2 } from "react-icons/fi";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";

const ManageJobs = () => {
  const { authTokens, user } = useAuthContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    // Ensure we have authentication data before fetching
    if (!authTokens?.access) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let url = "/jobs/";
      
      // Determine base URL based on role
      if (user?.role === "admin") {
        // Admin fetches all jobs, possibly filtered by 'all=true'
        url = "/jobs/?all=true"; 
      } else if (user?.role === "employer") {
        // Employer fetches only their jobs
        url = `/jobs/?employer_id=${user.id}`;
      } else {
        // Fallback or unhandled role
        setJobs([]);
        setLoading(false);
        return;
      }

      // 💡 CHANGE: Append the no_pagination parameter to bypass DRF pagination
      // We use a safe check to append with '&' or '?'
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}no_pagination=true`;

      const res = await apiClient.get(url, {
        headers: { Authorization: `JWT ${authTokens.access}` },
      });
      
      // 💡 CRITICAL CHANGE: When pagination is disabled, the list is returned directly in res.data
      // We remove the check for res.data.results
      setJobs(res.data);

    } catch (err) {
      setError("Failed to load jobs.");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Depend on user.id and authTokens.access for stable fetching
    if (user?.id) {
        fetchJobs();
    }
  }, [user?.id, authTokens?.access]); 

  const handleDelete = async (id) => {
    // 🗑️ Confirmation Alert is already included here!
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    
    try {
      await apiClient.delete(`/jobs/${id}/`, {
        headers: { Authorization: `JWT ${authTokens.access}` },
      });
      setJobs(jobs.filter((job) => job.id !== id));
      alert(`Job ID ${id} deleted successfully.`);
    } catch (err) {
      alert("Failed to delete job. Check your permissions.");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading jobs...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Jobs ({jobs.length})</h2>
        {/* Post New Job Link for Employer */}
        {user?.role === "employer" && (
          <Link
            to="/dashboard/employer/post-job"
            className="btn btn-success text-white"
          >
            Post New Job
          </Link>
        )}
      </div>

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead>
              <tr>
                <th>Title</th>
                {/* Show Employer column only for Admin view */}
                {user?.role === "admin" && <th>Employer</th>}
                <th>Category</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  {user?.role === "admin" && (
                     <td>{job.company_name || job.employer_name || `ID: ${job.employer}`}</td>
                  )}
                  <td>{job.category_name || job.category?.name}</td>
                  <td>{job.location}</td>
                  <td className="flex gap-2">
                    {/* Edit button logic */}
                    {user?.role === "admin" || user?.id === job.employer ? (
                      <Link
                        to={`/dashboard/${user.role}/jobs/${job.id}/edit`}
                        className="btn btn-sm btn-primary flex items-center gap-1"
                      >
                        <FiEdit /> Edit
                      </Link>
                    ) : null}

                    {/* Delete button logic */}
                    {(user?.role === "admin" || user?.id === job.employer) && (
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="btn btn-sm btn-error flex items-center gap-1"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    )}
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

export default ManageJobs;