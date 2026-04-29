import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { FiExternalLink, FiEdit, FiTrash2, FiChevronDown, FiChevronRight, FiBriefcase } from "react-icons/fi";

const AllJobs = () => {
    const { user, authTokens } = useAuthContext();
    const [groupedJobs, setGroupedJobs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    // 💡 Toggle State for Companies
    const [expandedCompanies, setExpandedCompanies] = useState({});

    const fetchAllJobs = async () => {
        if (!authTokens?.access || user?.role !== "admin") {
            setError("Unauthorized access.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const url = `/jobs/?all=true&no_pagination=true`;
            const res = await apiClient.get(url, {
                headers: { Authorization: `JWT ${authTokens.access}` },
            });

            const data = res.data.results || res.data;

            // 💡 LOGIC FIX: Group by employer_name (Full Name) and show company name
            const groups = data.reduce((acc, job) => {
                // We use employer_name for the full name from backend
                const key = job.employer_name || job.company_name || "Unknown Employer";
                if (!acc[key]) acc[key] = [];
                acc[key].push(job);
                return acc;
            }, {});

            setGroupedJobs(groups);
        } catch (err) {
            console.error("Admin fetch error:", err);
            setError("Failed to load jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllJobs();
    }, [authTokens, user]);

    // 💡 Toggle function
    const toggleCompany = (company) => {
        setExpandedCompanies(prev => ({ ...prev, [company]: !prev[company] }));
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("ADMIN ACTION: Permanently delete this job?")) return;
        setIsDeleting(true);
        try {
            await apiClient.delete(`/jobs/${jobId}/`, {
                headers: { Authorization: `JWT ${authTokens.access}` },
            });
            fetchAllJobs();
            alert("Job deleted successfully.");
        } catch (err) {
            alert("Delete failed.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading Admin Job Portal...</div>;
    if (error) return <div className="text-center py-10 text-red-600 font-bold">{error}</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-black mb-8 text-blue-900 border-b pb-4">
                Global Job Management
            </h2>

            {Object.keys(groupedJobs).length === 0 ? (
                <p className="text-gray-500">No jobs exist in the system.</p>
            ) : (
                Object.entries(groupedJobs).map(([employerName, jobs]) => (
                    <div key={employerName} className="mb-4 border rounded-xl overflow-hidden bg-white shadow-sm">
                        
                        {/* 🏢 TOGGLE HEADER: EMPLOYER FULL NAME */}
                        <button 
                            onClick={() => toggleCompany(employerName)}
                            className={`w-full flex items-center justify-between p-4 transition-colors ${
                                expandedCompanies[employerName] ? "bg-blue-600 text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {expandedCompanies[employerName] ? <FiChevronDown /> : <FiChevronRight />}
                                <span className="text-lg font-bold uppercase tracking-tight">
                                    {employerName} 
                                    <span className={`ml-3 text-xs font-normal ${expandedCompanies[employerName] ? "text-blue-100" : "text-gray-400"}`}>
                                        ({jobs[0]?.company_name})
                                    </span>
                                </span>
                            </div>
                            <span className={`badge ${expandedCompanies[employerName] ? "badge-outline text-white" : "badge-ghost"}`}>
                                {jobs.length} Jobs
                            </span>
                        </button>

                        {/* 📋 COLLAPSIBLE CONTENT: JOBS GRID */}
                        {expandedCompanies[employerName] && (
                            <div className="p-4 bg-gray-50 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 transition-all flex flex-col justify-between"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                                    <FiBriefcase className="text-blue-500" size={14}/> {job.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">{job.location}</p>
                                            </div>
                                            <Link 
                                                to={`/jobs/${job.id}`} 
                                                className="text-blue-400 hover:text-blue-600"
                                                title="View Post"
                                            >
                                                <FiExternalLink size={16} />
                                            </Link>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
                                            <Link
                                                to={`/dashboard/admin/jobs/${job.id}/edit`}
                                                className="btn btn-ghost btn-xs border border-gray-200 hover:bg-blue-50"
                                            >
                                                <FiEdit /> Edit
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
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default AllJobs;