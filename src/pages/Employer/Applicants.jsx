import { useEffect, useState, useCallback } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { 
    FiChevronDown, 
    FiChevronRight, 
    FiBriefcase, 
    FiCalendar, 
    FiExternalLink,
    FiCheckCircle,
    FiMapPin
} from "react-icons/fi";

const Applicants = () => {
    const { user, authTokens } = useAuthContext();
    const [jobsData, setJobsData] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusChoices, setStatusChoices] = useState([]);
    const [expandedJobs, setExpandedJobs] = useState({});
    const [updatingAppId, setUpdatingAppId] = useState(null);

    const fetchMasterData = useCallback(async () => {
        if (!user || !authTokens?.access || user.role !== "employer") {
            setError("Unauthorized access.");
            setLoading(false);
            return;
        }

        try {
            const [choicesRes, appsRes] = await Promise.all([
                authApiClient.get("/applications/status-choices/"),
                authApiClient.get(`/applications/?job__employer=${user.id}&no_pagination=true`)
            ]);

            setStatusChoices(choicesRes.data);
            const allApps = appsRes.data.results || appsRes.data;

            const grouped = allApps.reduce((acc, app) => {
                const jobId = app.job?.id;
                if (!jobId) return acc;

                if (!acc[jobId]) {
                    acc[jobId] = {
                        // 💡 FIX: Accessing 'company_name' to match your SimpleJobDetailSerializer
                        company: app.job?.company_name || "Employer", 
                        title: app.job?.title || "Untitled Position",
                        location: app.job?.location || "N/A",
                        type: app.job?.employment_type || "N/A",
                        remote: app.job?.remote_option || "On-site",
                        applicants: []
                    };
                }
                acc[jobId].applicants.push(app);
                return acc;
            }, {});

            setJobsData(grouped);
        } catch (err) {
            console.error("Failed to load employer data:", err);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    }, [user, authTokens]);

    useEffect(() => { fetchMasterData(); }, [fetchMasterData]);

    const toggleJob = (jobId) => {
        setExpandedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
    };

    const handleStatusChange = async (appId, jobId, newStatus) => {
        setUpdatingAppId(appId);
        try {
            const response = await authApiClient.patch(`/applications/${appId}/`, {
                status: newStatus,
            });

            setJobsData(prev => {
                const updatedJobs = { ...prev };
                updatedJobs[jobId].applicants = updatedJobs[jobId].applicants.map(app => 
                    app.id === appId ? response.data : app
                );
                return updatedJobs;
            });
            
            alert(`Updated to ${newStatus.toUpperCase()}`);
        } catch (err) {
            alert("Failed to update status.");
        } finally {
            setUpdatingAppId(null);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "accepted": return "bg-success text-white";
            case "rejected": return "bg-error text-white";
            case "interviewed": return "bg-warning";
            case "offered": return "bg-info text-white";
            default: return "bg-slate-100";
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-600">Loading Job Hierarchy...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

    // 💡 Pull the full company name from the first group for the header
    const companyDisplayName = Object.values(jobsData)[0]?.company || "Employer";

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <header className="mb-8 border-b pb-4">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                    {companyDisplayName}'s Job Applicants
                </h2>
                <p className="text-slate-500 font-medium">
                    Reviewing candidates for <span className="text-green-600 font-bold">{Object.keys(jobsData).length}</span> active positions.
                </p>
            </header>

            <div className="space-y-4">
                {Object.entries(jobsData).map(([jobId, data]) => (
                    <div key={jobId} className="border rounded-2xl bg-white shadow-sm overflow-hidden border-slate-200">
                        
                        {/* 🛠️ JOB TOGGLE SECTION */}
                        <button 
                            onClick={() => toggleJob(jobId)}
                            className={`w-full flex items-center justify-between p-5 text-left transition group ${
                                expandedJobs[jobId] ? "bg-green-50" : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-xl transition-all group-hover:scale-110 ${expandedJobs[jobId] ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                    <FiBriefcase size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800 group-hover:text-green-700">
                                        {data.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500 font-semibold">
                                        <span className="flex items-center gap-1">
                                            <FiCheckCircle className="text-green-500"/> {data.applicants.length} Candidates
                                        </span>
                                        <span className="text-slate-300">|</span>
                                        {/* 💡 Metadata labels (Remote/Type) */}
                                        <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px] uppercase text-slate-700">
                                            {data.type} • {data.remote}
                                        </span>
                                        <span className="flex items-center gap-1 text-[11px]"><FiMapPin size={12}/> {data.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {expandedJobs[jobId] ? <FiChevronDown size={24} className="text-green-600"/> : <FiChevronRight size={24} className="text-slate-300"/>}
                            </div>
                        </button>

                        {/* 📋 APPLICANTS TABLE */}
                        {expandedJobs[jobId] && (
                            <div className="border-t bg-white p-5 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Applicant Queue</h4>
                                    <Link to={`/jobs/${jobId}`} className="text-xs text-green-600 font-bold hover:underline flex items-center gap-1">
                                        <FiExternalLink /> Preview Post
                                    </Link>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-slate-100">
                                    <table className="table w-full">
                                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                                            <tr>
                                                <th className="py-4">Applicant</th>
                                                <th>Date Applied</th>
                                                <th>Decision</th>
                                                <th className="text-right">Profile</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.applicants.map((app) => (
                                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold uppercase">
                                                                {app.applicant?.first_name?.[0]}{app.applicant?.last_name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-700 text-sm">
                                                                    {app.applicant?.first_name} {app.applicant?.last_name}
                                                                </p>
                                                                <p className="text-xs text-slate-400 font-medium">{app.applicant?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-xs text-slate-500 font-semibold">
                                                        <FiCalendar className="inline mr-1" /> {new Date(app.applied_at).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                className={`select select-bordered select-xs w-36 font-bold capitalize text-[11px] ${getStatusClass(app.status)}`}
                                                                value={app.status}
                                                                onChange={(e) => handleStatusChange(app.id, jobId, e.target.value)}
                                                                disabled={updatingAppId === app.id || app.status === "withdrawn"}
                                                            >
                                                                {statusChoices.map(s => (
                                                                    <option key={s.value} value={s.value} disabled={s.value === "withdrawn"}>
                                                                        {s.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {updatingAppId === app.id && <span className="loading loading-spinner loading-xs text-green-500"></span>}
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <Link 
                                                            to={`/Dashboard/applications/${app.id}`} 
                                                            className="btn btn-sm btn-ghost text-green-600 font-black hover:bg-green-50"
                                                        >
                                                            Open CV
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

export default Applicants;