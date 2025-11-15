import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";

const MyJobs = () => {
    // 💡 CRITICAL: Destructure 'user' as well for the reliable ID source
    const { user, authTokens } = useAuthContext();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        // 💡 CRITICAL FIX: Wait for both token and reliable user ID before fetching
        if (!authTokens?.access || !user?.id) {
            setLoading(false);
            setError(null);
            return;
        }

        const fetchJobs = async () => {
            setLoading(true);
            setError(null);

            // 💡 FIX: Use the reliable user.id and the filter field name 'employer_id'
            const employerFilter = `employer_id=${user.id}`;
            const paginationBypass = `no_pagination=true`;
            const url = `/jobs/?${employerFilter}&${paginationBypass}`;

            try {
                const res = await apiClient.get(url, {
                    headers: { Authorization: `JWT ${authTokens.access}` },
                });

                // Handle paginated vs. non-paginated response
                const data = res.data.results || res.data;
                setJobs(data);
            } catch (err) {
                console.error("Error fetching my jobs:", err.response?.data || err);
                const detail =
                    err.response?.data?.employer_id?.[0] ||
                    "Failed to load your posted jobs. Check your network or server logs.";
                setError(detail);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
        // CRITICAL: Dependency array includes 'user' to re-run when user data loads
    }, [authTokens, user]);


    const handleDeleteJob = async (jobId) => {
        // 1. Confirmation
        if (!window.confirm("Are you sure you want to permanently delete this job? This action cannot be undone.")) {
          return;
        }
    
        setIsDeleting(true);
        setDeleteError(null);
    
        try {
          // 2. API Call (DELETE)
          await apiClient.delete(`/jobs/${jobId}/`, {
            headers: { Authorization: `JWT ${authTokens.access}` },
          });
    
          // 3. State Update: Remove the job from the local state
          setJobs(jobs.filter(job => job.id !== jobId));
          
          alert(`Job ID ${jobId} successfully deleted.`);
    
        } catch (err) {
          console.error("Delete job failed:", err.response?.data || err);
          setDeleteError("Failed to delete the job. You might not have permission.");
        } finally {
          setIsDeleting(false);
        }
      };

    if (loading)
        return <div className="text-center py-8">Loading your jobs...</div>;
    if (error)
        return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-green-700">
                My Posted Jobs ({jobs.length})
            </h2>

            {deleteError && (
                <div className="alert alert-error mb-4">
                    <p>{deleteError}</p>
                </div>
            )}

            {jobs.length === 0 ? (
                <p className="text-gray-500">
                    No jobs posted yet.{" "}
                    <Link
                        to="/Dashboard/post-job"
                        className="text-green-600 hover:underline"
                    >
                        Post one now!
                    </Link>
                </p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl"
                        >
                            <h3 className="font-bold text-xl text-gray-800">{job.title}</h3>
                            <p className="text-gray-600 mb-3">{job.location}</p>
                            <div className="mt-4 flex gap-3">
                                <Link
                                    to={`/dashboard/employer/jobs/${job.id}/edit`}
                                    className="btn btn-outline btn-sm"
                                >
                                    Edit
                                </Link>
                                <Link
                                    to={`/dashboard/employer/applicants?job_id=${job.id}`}
                                    className="btn bg-green-600 hover:bg-green-700 btn-sm text-white"
                                >
                                    View Applicants
                                </Link>

                                {/* 💡 DELETE BUTTON */}
                                <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="btn btn-error btn-sm text-white"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyJobs;