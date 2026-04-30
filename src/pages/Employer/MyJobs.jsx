import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { FiExternalLink } from "react-icons/fi";

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
            return;
        }

        const fetchJobs = async () => {
            setLoading(true);
            try {
                const url = `/jobs/?employer=${user.id}&no_pagination=true`;
                const res = await apiClient.get(url, {
                    headers: { Authorization: `JWT ${authTokens.access}` },
                });
                const data = res.data.results || res.data;
                setJobs(data);
            } catch (err) {
                setError("Failed to load your posted jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [authTokens, user]);

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to permanently delete this job?")) return;
        setIsDeleting(true);
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
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-green-700">
                    {user?.first_name || 'My'} Posted Jobs ({jobs.length})
                </h2>
                <Link to="/Dashboard/employer/post-job" className="btn btn-success text-white w-full sm:w-auto">
                    Post New Job
                </Link>
            </div>

            {deleteError && (
                <div className="alert alert-error mb-4">
                    <p>{deleteError}</p>
                </div>
            )}

            {jobs.length === 0 ? (
                <p className="text-gray-500">No jobs posted yet. <Link to="/Dashboard/employer/post-job" className="text-green-600 hover:underline">Post one now!</Link></p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white p-5 rounded-xl shadow-lg border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-shadow">
                            <div className="min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-bold text-lg md:text-xl text-slate-800 truncate">{job.title}</h3>
                                    <Link to={`/jobs/${job.id}`} className="text-blue-500 shrink-0 p-1" title="View public post">
                                        <FiExternalLink size={20} />
                                    </Link>
                                </div>
                                <p className="text-slate-500 mb-3 font-medium">{job.location}</p>
                            </div>

                            <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                                <Link to={`/dashboard/employer/jobs/${job.id}/edit`} className="btn btn-outline btn-sm font-bold">Edit</Link>
                                <Link to={`/dashboard/employer/applicants?job_id=${job.id}`} className="btn bg-green-600 hover:bg-green-700 border-green-600 btn-sm text-white font-bold">Applicants</Link>
                                <button onClick={() => handleDeleteJob(job.id)} className="btn btn-error btn-sm text-white font-bold col-span-2 sm:col-auto" disabled={isDeleting}>
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