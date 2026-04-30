import { FiBriefcase, FiSend, FiStar, FiTrendingUp } from "react-icons/fi";
import { format } from "date-fns";
import { Link } from "react-router"; 

const EmployerDashboard = ({ data }) => {
  const { jobs_posted, total_applications, featured_jobs, top_jobs } = data;

  return (
    // Changed: Used w-full and max-w-screen-xl to ensure it never exceeds viewport
    <div className="w-full max-w-screen-xl mx-auto py-8 px-4 overflow-x-hidden">
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8">
        Employer Overview
      </h2>

      {/* Stats Cards Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <Link to="/dashboard/employer/my-jobs" className="transition transform hover:scale-[1.02] active:scale-95">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-start w-full h-full">
            <div className="p-3 bg-green-100 rounded-lg text-green-700 mb-4">
              <FiBriefcase size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jobs Posted</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{jobs_posted}</p>
          </div>
        </Link>
        
        <Link to="/dashboard/employer/applicants" className="transition transform hover:scale-[1.02] active:scale-95">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-start w-full h-full">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-700 mb-4">
              <FiSend size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Applications</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{total_applications}</p>
          </div>
        </Link>
        
        <Link to="/dashboard/employer/my-jobs" className="transition transform hover:scale-[1.02] active:scale-95">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-start w-full h-full">
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-700 mb-4">
              <FiStar size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Featured Jobs</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{featured_jobs}</p>
          </div>
        </Link>
      </div>

      {/* Top Performing Jobs Section - Now perfectly aligned with cards above */}
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <FiTrendingUp className="mr-2 text-green-700" /> Top Performing Jobs
          </h3>
          
          {top_jobs && top_jobs.length > 0 ? (
            <ul className="space-y-4">
              {top_jobs.map((job) => (
                <li key={job.id}>
                  <Link 
                    to={`/dashboard/employer/applicants?job=${job.id}`} 
                    className="block p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-all duration-200 border border-slate-100 hover:border-emerald-200"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-base md:text-lg font-bold text-slate-800 truncate">
                          {job.title}
                        </p>
                        <p className="text-sm text-slate-500 font-semibold mt-0.5">
                          Total Applications: <span className="text-emerald-600 font-black">{job.live_applications_count}</span>
                        </p>
                      </div>
                      <div className="w-full sm:w-auto shrink-0">
                        <span className="inline-flex items-center text-[11px] font-black uppercase tracking-tighter text-emerald-700 bg-white px-4 py-2 rounded-lg border border-emerald-100 shadow-sm w-full sm:w-auto justify-center">
                          View Results →
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">No active job performance data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;