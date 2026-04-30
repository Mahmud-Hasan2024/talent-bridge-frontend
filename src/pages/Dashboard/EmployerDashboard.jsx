import { FiBriefcase, FiSend, FiStar, FiTrendingUp } from "react-icons/fi";
import { format } from "date-fns";
import { Link } from "react-router"; 

const EmployerDashboard = ({ data }) => {
  const { jobs_posted, total_applications, featured_jobs, top_jobs } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-green-700 mb-8">Employer Overview</h2>

      {/* Stats Cards Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <Link to="/dashboard/employer/my-jobs" className="transition transform hover:scale-105">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-start w-full h-full">
            <div className="p-3 bg-green-100 rounded-lg text-green-700 mb-4">
              <FiBriefcase size={24} />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Jobs Posted</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{jobs_posted}</p>
          </div>
        </Link>
        
        <Link to="/dashboard/employer/applicants" className="transition transform hover:scale-105">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-start w-full h-full">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-700 mb-4">
              <FiSend size={24} />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Applications</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{total_applications}</p>
          </div>
        </Link>
        
        <Link to="/dashboard/employer/my-jobs" className="transition transform hover:scale-105">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-start w-full h-full">
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-700 mb-4">
              <FiStar size={24} />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Featured Jobs</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{featured_jobs}</p>
          </div>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        {/* Top Performing Jobs Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <FiTrendingUp className="mr-2 text-green-700" /> Top Performing Jobs
          </h3>
          
          {top_jobs && top_jobs.length > 0 ? (
            <ul className="space-y-4">
              {top_jobs.map((job) => (
                <li key={job.id}>
                  <Link 
                    to={`/dashboard/employer/applicants?job=${job.id}`} 
                    className="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition duration-200 border border-transparent hover:border-green-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-bold text-green-700 truncate">{job.title}</p>
                        <p className="text-sm text-slate-600 font-medium">
                          Total Applications: <span className="text-slate-900">{job.live_applications_count}</span>
                        </p>
                      </div>
                      <div className="w-full sm:w-auto">
                        <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 w-full sm:w-auto justify-center">
                          View Applications →
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No active job performance data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;