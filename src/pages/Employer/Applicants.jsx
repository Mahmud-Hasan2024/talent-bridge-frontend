import { useEffect, useState, useCallback } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router";
import { 
    FiChevronDown, 
    FiChevronRight, 
    FiUser, 
    FiBriefcase, 
    FiCalendar, 
    FiExternalLink,
    FiCheckCircle
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
            // 1. Fetch Status Choices & Applicants in parallel
            const [choicesRes, appsRes] = await Promise.all([
                authApiClient.get("/applications/status-choices/"),
                authApiClient.get(`/applications/?job__employer=${user.id}&no_pagination=true`)
            ]);

            setStatusChoices(choicesRes.data);
            const allApps = appsRes.data.results || appsRes.data;

            // 💡 GROUPING LOGIC: Group by Job ID for the Toggle View
            const grouped = allApps.reduce((acc, app) => {
                const jobId = app.job?.id;
                if (!jobId) return acc;

                if (!acc[jobId]) {
                    acc[jobId] = {
                        title: app.job?.title || "Untitled Position",
                        location: app.job?.location || "Remote",
                        type: app.job?.employment_type || "N/A",
                        applicants: []
                    };
                }
                acc[jobId].applicants.push(app);
                return acc;
            }, {});

            setJobsData(grouped);
        } catch (err) {
            console.error("Failed to load employer data:", err);
            setError("Failed to load applicant data. Please try again.");
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

            // Update local state within the nested group
            setJobsData(prev => {
                const updatedJobs = { ...prev };
                updatedJobs[jobId].applicants = updatedJobs[jobId].applicants.map(app => 
                    app.id === appId ? { ...app, status: response.data.status } : app
                );
                return updatedJobs;
            });
        } catch (err) {
            alert("Failed to update status.");
        } finally {
            setUpdatingAppId(null);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-600">Loading Job Hierarchy...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-slate-800">
                  {Object.values(jobsData)[0]?.company || "Employer"}'s Job Applicants
              </h2>
              <p className="text-slate-500 font-medium">
                  Manage applicants across your active job postings.
              </p>
          </header>

            <div className="space-y-4">
                {Object.entries(jobsData).length === 0 ? (
                    <div className="bg-white p-10 text-center rounded-xl border-2 border-dashed">
                        <p className="text-slate-400">You haven't received any applications yet.</p>
                    </div>
                ) : (
                    Object.entries(jobsData).map(([jobId, data]) => (
                        <div key={jobId} className="border rounded-2xl bg-white shadow-sm overflow-hidden transition-all border-slate-200">
                            
                            {/* 🛠️ JOB TOGGLE HEADER */}
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
                                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-green-700 transition-colors">
                                            {data.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-semibold">
                                            <span className="flex items-center gap-1"><FiCheckCircle className="text-green-500"/> {data.applicants.length} Candidates</span>
                                            <span className="text-slate-300">|</span>
                                            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">{data.type}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    {expandedJobs[jobId] ? <FiChevronDown size={24} className="text-green-600"/> : <FiChevronRight size={24} className="text-slate-300 group-hover:text-green-400"/>}
                                </div>
                            </button>

                            {/* 📋 APPLICANTS TABLE */}
                            {expandedJobs[jobId] && (
                                <div className="border-t bg-white p-5 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex justify-between items-center mb-6 px-2">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Application Queue</h4>
                                        <Link to={`/jobs/${jobId}`} className="flex items-center gap-1 text-xs text-green-600 font-bold hover:underline">
                                            <FiExternalLink size={14}/> Preview Job Post
                                        </Link>
                                    </div>

                                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                                        <table className="table w-full">
                                            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                                                <tr>
                                                    <th>Applicant Details</th>
                                                    <th>Applied On</th>
                                                    <th>Decision</th>
                                                    <th className="text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.applicants.map((app) => (
                                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold shadow-sm">
                                                                    {app.applicant?.first_name?.[0]}{app.applicant?.last_name?.[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-700 text-sm">{app.applicant?.first_name} {app.applicant?.last_name}</p>
                                                                    <p className="text-xs text-slate-400">{app.applicant?.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-xs text-slate-500 font-medium">
                                                            <div className="flex items-center gap-1"><FiCalendar /> {new Date(app.applied_at).toLocaleDateString()}</div>
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    className="select select-bordered select-xs w-32 font-bold capitalize text-[11px]"
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
                                                                className="btn btn-sm btn-ghost text-green-600 font-black normal-case"
                                                            >
                                                                View CV
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
                    ))
                )}
            </div>
        </div>
    );
};

export default Applicants;