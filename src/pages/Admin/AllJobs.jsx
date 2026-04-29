import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { FiExternalLink, FiEdit, FiTrash2 } from "react-icons/fi";

const AllJobs = () => {
    const { user, authTokens } = useAuthContext();
    const [groupedJobs, setGroupedJobs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchAllJobs = async () => {
        if (!authTokens?.access || user?.role !== "admin") {
            setError("Unauthorized access.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Fetch all jobs without pagination
            const url = `/jobs/?all=true&no_pagination=true`;
            const res = await apiClient.get(url, {
                headers: { Authorization: `JWT ${authTokens.access}` },
            });

            const data = res.data.results || res.data;

            // 💡 LOGIC: Group jobs by Company Name or Employer Name
            const groups = data.reduce((acc, job) => {
                const key = job.company_name || job.employer_name || "Unknown Company";
                if (!acc[key]) acc[key] = [];
                acc[key].push(job);
                return acc;
            }, {});

            setGroupedJobs(groups);
        } catch (err) {
            console.error("Admin fetch error:", err);
            setError("Failed to load all jobs for administration.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllJobs();
    }, [authTokens, user]);

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("ADMIN ACTION: Permanently delete this job?")) return;

        setIsDeleting(true);
        try {
            await apiClient.delete(`/jobs/${jobId}/`, {
                headers: { Authorization: `JWT ${authTokens.access}` },
            });
            // Re-fetch to update the grouped state
            fetchAllJobs();
            alert("Job deleted successfully.");
        } catch (err) {
            alert("Delete failed. Check server permissions.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading Admin Job Portal...</div>;
    if (error) return <div className="text-center py-10 text-red-600 font-bold">{error}</div>;

    const companyNames = Object.keys(groupedJobs);

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 text-blue-800 border-b pb-4">
                Global Job Management (Admin)
            </h2>

            {companyNames.length === 0 ? (
                <p className="text-gray-500">No jobs exist in the system.</p>
            ) : (
                companyNames.map((company) => (
                    <div key={company} className="mb-10">
                        {/* 🏢 COMPANY HEADER */}
                        <div className="bg-gray-100 p-3 rounded-t-lg border-l-4 border-blue-600 mb-4">
                            <h3 className="text-xl font-black uppercase tracking-wide text-gray-700">
                                {company}
                            </h3>
                            <p className="text-xs text-gray-500">
                                Total Posted: {groupedJobs[company].length}
                            </p>
                        </div>

                        {/* 📋 JOBS FOR THIS COMPANY */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedJobs[company].map((job) => (
                                <div
                                    key={job.id}
                                    className="bg-white p-4 rounded-xl shadow border border-gray-200 hover:border-blue-300 transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-800">{job.title}</h4>
                                            <p className="text-sm text-gray-500">{job.location}</p>
                                        </div>
                                        <Link 
                                            to={`/jobs/${job.id}`} 
                                            className="text-blue-500 hover:scale-110 transition"
                                            title="View Public Post"
                                        >
                                            <FiExternalLink size={18} />
                                        </Link>
                                    </div>

                                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                                        <Link
                                            to={`/dashboard/admin/jobs/${job.id}/edit`}
                                            className="btn btn-ghost btn-xs border border-gray-300"
                                        >
                                            <FiEdit className="mr-1" /> Edit
                                        </Link>
                                        <Link
                                            to={`/dashboard/admin/applicants?job_id=${job.id}`}
                                            className="btn btn-info btn-xs text-white"
                                        >
                                            Applicants
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="btn btn-error btn-xs text-white"
                                            disabled={isDeleting}
                                        >
                                            <FiTrash2 className="mr-1" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AllJobs;