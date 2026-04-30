import { useEffect, useState, useCallback } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { FiChevronDown, FiChevronRight, FiBriefcase, FiCalendar, FiCheckCircle } from "react-icons/fi";

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
                        employerFullName: app.job_employer_name || "Employer",
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
            setError("Failed to load applicant data.");
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
            const response = await authApiClient.patch(`/applications/${appId}/`, { status: newStatus });
            setJobsData(prev => {
                const updatedJobs = { ...prev };
                if (updatedJobs[jobId]) {
                    updatedJobs[jobId].applicants = updatedJobs[jobId].applicants.map(app => 
                        app.id === appId ? { ...app, status: response.data.status } : app
                    );
                }
                return updatedJobs;
            });
            alert(`Status updated to ${newStatus.toUpperCase()}`);
        } catch (err) {
            alert("Update failed.");
        } finally {
            setUpdatingAppId(null);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "accepted": return "bg-success text-white border-success";
            case "rejected": return "bg-error text-white border-error";
            case "interviewed": return "bg-warning border-warning";
            case "offered": return "bg-info text-white border-info";
            default: return "bg-slate-100 border-slate-200";
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-600">Loading Applications...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

    const firstJobKey = Object.keys(jobsData)[0];
    const displayEmployerName = jobsData[firstJobKey]?.employerFullName || "Employer";

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <header className="mb-8 border-b border-slate-100 pb-5">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight break-words">
                    {displayEmployerName}'s Applicants
                </h2>
                <p className="text-slate-500 font-medium text-sm md:text-base">
                    Reviewing <span className="text-green-600 font-bold">{Object.keys(jobsData).length}</span> active job posts.
                </p>
            </header>

            <div className="space-y-4">
                {Object.entries(jobsData).map(([jobId, data]) => (
                    <div key={jobId} className="border rounded-2xl bg-white shadow-sm overflow-hidden border-slate-200">
                        <button 
                            onClick={() => toggleJob(jobId)}
                            className={`w-full flex items-start justify-between p-4 md:p-5 text-left transition ${
                                expandedJobs[jobId] ? "bg-green-50" : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-start gap-4 min-w-0">
                                <div className={`p-2.5 rounded-xl hidden sm:block ${expandedJobs[jobId] ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                    <FiBriefcase size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-lg md:text-xl text-slate-800 truncate">{data.title}</h3>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
                                        <span className="text-green-600 flex items-center gap-1 font-bold">
                                            <FiCheckCircle/> {data.applicants.length} Candidates
                                        </span>
                                        <span className="hidden xs:inline text-slate-300">•</span>
                                        <span className="uppercase text-[9px] font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                                            {data.type} • {data.remote}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 ml-2">
                                {expandedJobs[jobId] ? <FiChevronDown size={24} className="text-green-600"/> : <FiChevronRight size={24} className="text-slate-300"/>}
                            </div>
                        </button>

                        {expandedJobs[jobId] && (
                            <div className="border-t bg-white p-2 md:p-5 overflow-hidden">
                                <div className="overflow-x-auto rounded-xl border border-slate-100">
                                    <table className="table w-full">
                                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                                            <tr>
                                                <th className="py-4">Candidate</th>
                                                <th className="hidden md:table-cell">Applied</th>
                                                <th>Decision</th>
                                                <th className="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.applicants.map((app) => {
                                                const u = app.applicant || {};
                                                const candidateName = u.first_name || u.last_name 
                                                    ? `${u.first_name || ''} ${u.last_name || ''}`.trim() 
                                                    : u.username || "Applicant";

                                                return (
                                                    <tr key={app.id} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0">
                                                        <td>
                                                            <div className="flex items-center gap-3 py-2">
                                                                <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold uppercase text-xs md:text-base">
                                                                    {candidateName[0]}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-bold text-slate-700 text-sm truncate">{candidateName}</p>
                                                                    <p className="text-[10px] md:text-xs text-slate-400 font-medium truncate">{u.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="hidden md:table-cell text-xs text-slate-500 font-semibold">
                                                            {new Date(app.applied_at).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <select
                                                                className={`select select-bordered select-xs w-28 md:w-36 font-bold capitalize text-[10px] md:text-[11px] ${getStatusClass(app.status)}`}
                                                                value={app.status}
                                                                onChange={(e) => handleStatusChange(app.id, jobId, e.target.value)}
                                                                disabled={updatingAppId === app.id || app.status === "withdrawn"}
                                                            >
                                                                {statusChoices.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="text-right">
                                                            <Link to={`/Dashboard/applications/${app.id}`} className="btn btn-xs md:btn-sm btn-ghost text-green-600 font-black">Review</Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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