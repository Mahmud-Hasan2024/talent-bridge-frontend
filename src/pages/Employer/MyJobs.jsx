import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { FiExternalLink } from "react-icons/fi"; // Added an icon for better UX

const MyJobs = () => {
    const { user, authTokens } = useAuthContext();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!authTokens?.access || !user?.id) {
            setLoading(false);
            setError(null);
            return;
        }

        const fetchJobs = async () => {
            setLoading(true);
            setError(null);

            const employerFilter = `employer=${user.id}`;
            const paginationBypass = `no_pagination=true`;
            const url = `/jobs/?${employerFilter}&${paginationBypass}`;

            try {
                const res = await apiClient.get(url, {
                    headers: { Authorization: `JWT ${authTokens.access}` },
                });
                const data = res.data.results || res.data;
                setJobs(data);
            } catch (err) {
                console.error("Error fetching my jobs:", err.response?.data || err);
                setError("Failed to load your posted jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [authTokens, user]);


    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to permanently delete this job?")) {
          return;
        }
    
        setIsDeleting(true);
        setDeleteError(null);
    
        try {
          await apiClient.delete(`/jobs/${jobId}/`, {
            headers: { Authorization: `JWT ${authTokens.access}` },
          });
          setJobs(jobs.filter(job => job.id !== jobId));
          alert(`Job successfully deleted.`);
        } catch (err) {
          setDeleteError("Failed to delete the job.");
        } finally {
          setIsDeleting(false);
        }
      };

    if (loading) return <div className="text-center py-8">Loading your jobs...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-green-700">
                    {user?.first_name || 'My'} Posted Jobs ({jobs.length})
                </h2>
                <Link to="/Dashboard/employer/post-job" className="btn btn-success text-white">
                    Post New Job
                </Link>
            </div>

            {deleteError && (
                <div className="alert alert-error mb-4">
                    <p>{deleteError}</p>
                </div>
            )}

            {jobs.length === 0 ? (
                <p className="text-gray-500">
                    No jobs posted yet.{" "}
                    <Link to="/Dashboard/employer/post-job" className="text-green-600 hover:underline">
                        Post one now!
                    </Link>
                </p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-xl text-gray-800">{job.title}</h3>
                                    {/* 💡 VIEW POST BUTTON (Public Link) */}
                                    <Link 
                                        to={`/jobs/${job.id}`} 
                                        className="text-blue-500 hover:text-blue-700 p-1"
                                        title="View public post"
                                    >
                                        <FiExternalLink size={20} />
                                    </Link>
                                </div>
                                <p className="text-gray-600 mb-3">{job.location}</p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
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