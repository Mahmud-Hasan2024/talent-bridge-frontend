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

            const groups = data.reduce((acc, job) => {
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
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black mb-8 text-blue-900 border-b pb-4">
                Global Job Management
            </h2>

            {Object.keys(groupedJobs).length === 0 ? (
                <p className="text-slate-500">No jobs exist in the system.</p>
            ) : (
                Object.entries(groupedJobs).map(([employerName, jobs]) => (
                    <div key={employerName} className="mb-4 border rounded-xl overflow-hidden bg-white shadow-sm">
                        
                        {/* 🏢 FIXED TOGGLE HEADER: MOBILE RESPONSIVE */}
                        <button 
                            onClick={() => toggleCompany(employerName)}
                            className={`w-full flex items-center justify-between p-4 transition-colors gap-3 ${
                                expandedCompanies[employerName] ? "bg-blue-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                            }`}
                        >
                            <div className="flex items-start md:items-center gap-3 text-left overflow-hidden">
                                {/* Fixed Icon alignment */}
                                <div className="mt-1 md:mt-0">
                                    {expandedCompanies[employerName] ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 overflow-hidden">
                                    <span className="text-sm md:text-lg font-bold uppercase tracking-tight truncate">
                                        {employerName}
                                    </span>
                                    <span className={`text-[10px] md:text-xs font-semibold truncate ${expandedCompanies[employerName] ? "text-blue-100" : "text-slate-500"}`}>
                                        ({jobs[0]?.company_name || "N/A"})
                                    </span>
                                </div>
                            </div>

                            {/* Badge stays right-aligned and doesn't shrink */}
                            <span className={`badge badge-sm md:badge-md shrink-0 ${expandedCompanies[employerName] ? "badge-outline text-white" : "badge-ghost"}`}>
                                {jobs.length} <span className="hidden xs:inline ml-1">Jobs</span>
                            </span>
                        </button>

                        {/* 📋 COLLAPSIBLE CONTENT */}
                        {expandedCompanies[employerName] && (
                            <div className="p-4 bg-slate-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between h-full"
                                    >
                                        <div className="flex justify-between items-start mb-4 gap-2">
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base leading-tight">
                                                    <FiBriefcase className="text-blue-500 shrink-0" size={14}/> 
                                                    <span className="truncate">{job.title}</span>
                                                </h4>
                                                <p className="text-[11px] md:text-xs text-slate-500 mt-1 font-medium italic">
                                                    {job.location}
                                                </p>
                                            </div>
                                            <Link 
                                                to={`/jobs/${job.id}`} 
                                                className="text-blue-400 hover:text-blue-600 shrink-0 p-1"
                                                title="View Post"
                                            >
                                                <FiExternalLink size={18} />
                                            </Link>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-slate-100">
                                            <Link
                                                to={`/dashboard/admin/jobs/${job.id}/edit`}
                                                className="btn btn-ghost btn-xs border border-slate-200 hover:bg-blue-50"
                                            >
                                                <FiEdit /> <span className="hidden sm:inline">Edit</span>
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