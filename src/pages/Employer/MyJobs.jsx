import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";

const MyJobs = () => {
    const { user, authTokens } = useAuthContext();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authTokens?.access || !user?.id) return;

        const fetchJobs = async () => {
            setLoading(true);
            try {
                // PARAMETER FIXED: 'employer' to match backend
                const url = `/jobs/?employer=${user.id}&no_pagination=true`;
                const res = await apiClient.get(url, {
                    headers: { Authorization: `JWT ${authTokens.access}` },
                });
                setJobs(res.data);
            } catch (err) {
                setError("Failed to load jobs.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [authTokens, user]);

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Delete this job permanently?")) return;
        try {
            await apiClient.delete(`/jobs/${jobId}/`, {
                headers: { Authorization: `JWT ${authTokens.access}` },
            });
            setJobs(jobs.filter(job => job.id !== jobId));
            alert("Deleted successfully.");
        } catch (err) {
            alert("Delete failed. You may not have permission.");
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-green-700">My Posted Jobs ({jobs.length})</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white p-5 rounded-xl shadow border">
                        <h3 className="font-bold text-xl">{job.title}</h3>
                        <p className="text-gray-600">{job.location}</p>
                        <div className="mt-4 flex gap-3">
                            <Link to={`/dashboard/employer/jobs/${job.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                            <button onClick={() => handleDeleteJob(job.id)} className="btn btn-error btn-sm text-white">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyJobs;