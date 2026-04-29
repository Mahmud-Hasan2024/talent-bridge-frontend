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
            console.error("Failed to load data:", err);
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
            // PATCH to update status
            const response = await authApiClient.patch(`/applications/${appId}/`, {
                status: newStatus,
            });

            // 💡 REBUILT UPDATE LOGIC
            // Instead of trusting the whole response.data (which might lack nested applicant info),
            // we manually update ONLY the status field in our existing state.
            setJobsData(prev => {
                const newJobsData = { ...prev };
                newJobsData[jobId].applicants = newJobsData[jobId].applicants.map(app => 
                    app.id === appId 
                        ? { ...app, status: response.data.status } // Keep old user data, update status
                        : app
                );
                return newJobsData;
            });
            
        } catch (err) {
            alert("Failed to update status.");
            console.error(err);
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

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <header className="mb-8 border-b border-slate-100 pb-5">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                    Applicant Management
                </h2>
                <p className="text-slate-500 font-medium">
                    Reviewing candidates for <span className="text-green-600 font-bold">{Object.keys(jobsData).length}</span> positions.
                </p>
            </header>

            <div className="space-y-4">
                {Object.entries(jobsData).map(([jobId, data]) => (
                    <div key={jobId} className="border rounded-2xl bg-white shadow-sm overflow-hidden border-slate-200">
                        
                        <button 
                            onClick={() => toggleJob(jobId)}
                            className={`w-full flex items-center justify-between p-5 text-left transition ${
                                expandedJobs[jobId] ? "bg-green-50" : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-xl ${expandedJobs[jobId] ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                    <FiBriefcase size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800">{data.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                        <span className="font-bold text-green-600">{data.applicants.length} Candidates</span>
                                        <span>•</span>
                                        <span>{data.location}</span>
                                    </div>
                                </div>
                            </div>
                            {expandedJobs[jobId] ? <FiChevronDown size={24}/> : <FiChevronRight size={24}/>}
                        </button>

                        {expandedJobs[jobId] && (
                            <div className="p-5 bg-white border-t border-slate-100">
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr className="text-slate-400 text-[10px] uppercase tracking-widest">
                                                <th className="bg-transparent">Candidate</th>
                                                <th className="bg-transparent">Applied On</th>
                                                <th className="bg-transparent">Status</th>
                                                <th className="bg-transparent text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.applicants.map((app) => {
                                                // 💡 Use full_name from Serializer, fall back to username logic
                                                const u = app.applicant || {};
                                                const fullName = u.full_name || 
                                                    (u.first_name || u.last_name 
                                                        ? `${u.first_name || ''} ${u.last_name || ''}`.trim() 
                                                        : u.username || "Applicant");

                                                return (
                                                    <tr key={app.id} className="border-b border-slate-50 last:border-0">
                                                        <td>
                                                            <div className="flex items-center gap-3 py-2">
                                                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold uppercase">
                                                                    {fullName[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-700 text-sm">{fullName}</p>
                                                                    <p className="text-xs text-slate-400">{u.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-xs font-semibold text-slate-500">
                                                            {new Date(app.applied_at).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    className={`select select-bordered select-xs w-36 font-bold capitalize ${getStatusClass(app.status)}`}
                                                                    value={app.status}
                                                                    onChange={(e) => handleStatusChange(app.id, jobId, e.target.value)}
                                                                    disabled={updatingAppId === app.id || app.status === "withdrawn"}
                                                                >
                                                                    {statusChoices.map(s => (
                                                                        <option key={s.value} value={s.value}>
                                                                            {s.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {updatingAppId === app.id && <span className="loading loading-spinner loading-xs text-green-500"></span>}
                                                            </div>
                                                        </td>
                                                        <td className="text-right">
                                                            <Link to={`/Dashboard/applications/${app.id}`} className="btn btn-sm btn-ghost text-green-600 font-bold">
                                                                View
                                                            </Link>
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