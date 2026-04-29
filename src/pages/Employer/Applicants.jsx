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
                        // 💡 FIX 1: Added company name to the group so the header can find it
                        company: app.job?.company_name || "Employer",
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

            // 💡 FIX 2: Corrected state update to match your previous working logic
            // We replace the entire application object with the response from the server
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

    // Helper for your original badge colors
    const getStatusClass = (status) => {
        switch (status) {
            case "accepted": return "bg-success text-white";
            case "rejected": return "bg-error text-white";
            case "interviewed": return "bg-warning";
            default: return "bg-slate-100";
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-600">Loading Job Hierarchy...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

    const firstJob = Object.values(jobsData)[0];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-black text-slate-800">
                    {/* 💡 Now correctly displays "Company Name's Job Applicants" */}
                    {firstJob?.company}'s Job Applicants
                </h2>
                <p className="text-slate-500 font-medium">Manage your candidate pipeline.</p>
            </header>

            <div className="space-y-4">
                {Object.entries(jobsData).map(([jobId, data]) => (
                    <div key={jobId} className="border rounded-2xl bg-white shadow-sm overflow-hidden border-slate-200">
                        <button 
                            onClick={() => toggleJob(jobId)}
                            className={`w-full flex items-center justify-between p-5 text-left transition group ${
                                expandedJobs[jobId] ? "bg-green-50" : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-xl ${expandedJobs[jobId] ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                    <FiBriefcase size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800">{data.title}</h3>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 font-semibold">
                                        <FiCheckCircle className="text-green-500"/> {data.applicants.length} Candidates
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {expandedJobs[jobId] ? <FiChevronDown size={24} className="text-green-600"/> : <FiChevronRight size={24} className="text-slate-300"/>}
                            </div>
                        </button>

                        {expandedJobs[jobId] && (
                            <div className="border-t bg-white p-5">
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Application Queue</h4>
                                    <Link to={`/jobs/${jobId}`} className="text-xs text-green-600 font-bold hover:underline flex items-center gap-1">
                                        <FiExternalLink /> View Post
                                    </Link>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-slate-100">
                                    <table className="table w-full">
                                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                                            <tr>
                                                <th>Applicant</th>
                                                <th>Date</th>
                                                <th>Status Decision</th>
                                                <th className="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.applicants.map((app) => (
                                                <tr key={app.id} className="hover:bg-slate-50/50">
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                                                                {app.applicant?.first_name?.[0]}{app.applicant?.last_name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-700 text-sm">{app.applicant?.first_name} {app.applicant?.last_name}</p>
                                                                <p className="text-xs text-slate-400">{app.applicant?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-xs text-slate-500">
                                                        <FiCalendar className="inline mr-1" /> {new Date(app.applied_at).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                className={`select select-bordered select-xs w-32 font-bold capitalize text-[11px] ${getStatusClass(app.status)}`}
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
                                                            className="btn btn-sm btn-ghost text-green-600 font-black"
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
                ))}
            </div>
        </div>
    );
};

export default Applicants;