import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { FiChevronDown, FiChevronRight, FiBriefcase, FiMapPin, FiEye, FiExternalLink } from "react-icons/fi";

const AllApplicants = () => {
    const { authTokens, user } = useAuthContext();
    const [jobsData, setJobsData] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [expandedJobs, setExpandedJobs] = useState({});

    const fetchMasterData = async () => {
        if (user?.role !== "admin") return;
        setLoading(true);
        try {
            const url = "/applications/?no_pagination=true";
            const res = await apiClient.get(url, {
                headers: { Authorization: `JWT ${authTokens.access}` },
            });

            const allApps = res.data.results || res.data;

            const groupedByJob = allApps.reduce((acc, app) => {
                const jobId = app.job?.id;
                if (!acc[jobId]) {
                    acc[jobId] = {
                        id: jobId,
                        title: app.job?.title || "Untitled Position",
                        company: app.job_employer_name || app.job?.company_name || "N/A",
                        location: app.job?.location || "N/A",
                        // 💡 FIX 2: Pull correct employment data from Serializer
                        employmentType: app.job?.employment_type || "N/A",
                        remoteOption: app.job?.remote_option || "On-site",
                        applicants: []
                    };
                }
                acc[jobId].applicants.push(app);
                return acc;
            }, {});

            setJobsData(groupedByJob);
        } catch (err) {
            console.error("Master view fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMasterData(); }, [authTokens, user]);

    const toggleJob = (jobId) => {
        setExpandedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
    };

    if (loading) return <div className="p-10 text-center">Loading Job Hierarchy...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-black text-slate-800">Job Applicant Manager</h2>
                <p className="text-slate-500">Click on a job card to expand or collapse applicants.</p>
            </header>

            <div className="space-y-4">
                {Object.entries(jobsData).map(([jobId, data]) => (
                    <div key={jobId} className="border rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-200">
                        
                        {/* 🛠️ JOB TOGGLE HEADER */}
                        <button 
                            onClick={() => toggleJob(jobId)}
                            // 💡 FIX 1: Added 'cursor-pointer' and 'group' for better clickability feedback
                            className={`w-full flex items-center justify-between p-5 text-left transition cursor-pointer group ${
                                expandedJobs[jobId] ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon grows slightly on hover to signal interactivity */}
                                <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${expandedJobs[jobId] ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                                    <FiBriefcase size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                                        {data.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                                        <span className="font-semibold text-blue-600">{data.company}</span>
                                        <span className="flex items-center gap-1"><FiMapPin size={12}/> {data.location}</span>
                                        {/* 💡 FIX 2: Correcting the Remote/Type display */}
                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-gray-600">
                                            {data.employmentType} • {data.remoteOption}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block text-right mr-2">
                                    <span className="text-xs font-bold uppercase text-slate-400">Applicants</span>
                                    <p className="text-lg font-black text-slate-700">{data.applicants.length}</p>
                                </div>
                                {expandedJobs[jobId] ? <FiChevronDown size={24} className="text-blue-600"/> : <FiChevronRight size={24} className="text-gray-300 group-hover:text-blue-400 transition-colors"/>}
                            </div>
                        </button>

                        {/* 📋 APPLICANTS TABLE (HIDDEN BY DEFAULT) */}
                        {expandedJobs[jobId] && (
                            <div className="border-t bg-white p-4">
                                <div className="flex flex-wrap justify-between items-center mb-4 px-2 gap-3">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Candidate List</h4>
                                    
                                    <div className="flex items-center gap-4">
                                        {/* 💡 FIX 3: Link to view the Job Post */}
                                        <Link 
                                            to={`/jobs/${jobId}`} 
                                            className="flex items-center gap-1 text-xs text-green-600 font-bold hover:underline"
                                        >
                                            <FiExternalLink size={14}/> View Public Post
                                        </Link>

                                        <Link 
                                            to={`/dashboard/admin/jobs/${jobId}/edit`} 
                                            className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
                                        >
                                            <FiEye size={14}/> Edit Job Details
                                        </Link>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-gray-100">
                                    <table className="table table-zebra w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-slate-600">Name</th>
                                                <th className="text-slate-600">Email</th>
                                                <th className="text-slate-600">Status</th>
                                                <th className="text-slate-600">Date Applied</th>
                                                <th className="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.applicants.map((app) => (
                                                <tr key={app.id} className="hover:bg-blue-50/50">
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                                                {app.applicant?.first_name?.[0]}{app.applicant?.last_name?.[0]}
                                                            </div>
                                                            <span className="font-semibold text-slate-700">
                                                                {app.applicant?.first_name} {app.applicant?.last_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-sm text-slate-500">{app.applicant?.email}</td>
                                                    <td>
                                                        <span className="badge badge-sm badge-outline capitalize font-bold text-[10px]">
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-xs text-slate-400">
                                                        {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="text-right">
                                                        <Link 
                                                            to={`/Dashboard/applications/${app.id}`} 
                                                            className="btn btn-ghost btn-xs text-blue-600 font-bold"
                                                        >
                                                            View Profile
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllApplicants;