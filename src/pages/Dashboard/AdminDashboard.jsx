import StatCard from "../../components/Dashboard/StatCard";
import { FiUsers, FiBriefcase, FiSend } from "react-icons/fi";
import { format } from "date-fns";
import { Link } from "react-router"; // 💡 Import Link

const AdminDashboard = ({ data }) => {
  const { total_users, total_jobs, total_applications, recent_jobs, recent_applications } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-green-700 mb-8">Admin Overview</h2>

      {/* Stats Cards Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <Link to="/dashboard/admin/users" className="transition transform hover:scale-105">
          <StatCard icon={FiUsers} title="Total Users" value={total_users} />
        </Link>
        
        <Link to="/dashboard/admin/jobs" className="transition transform hover:scale-105">
          <StatCard icon={FiBriefcase} title="Total Jobs" value={total_jobs} />
        </Link>
        
        <Link to="/dashboard/admin/applicants" className="transition transform hover:scale-105">
          <StatCard icon={FiSend} title="Total Applications" value={total_applications} />
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* Recent Jobs Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiBriefcase className="mr-2 text-green-700" /> Recent Jobs
          </h3>
          {recent_jobs && recent_jobs.length > 0 ? (
            <ul className="space-y-3">
              {recent_jobs.map((job) => (
                <li key={job.id}>
                  <Link 
                    to={`/jobs/${job.id}`} 
                    className="block p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 border border-transparent hover:border-green-300"
                  >
                    <p className="text-lg font-medium text-green-700">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.company_name}</p>
                    <p className="text-xs text-gray-500">
                      Posted on: {format(new Date(job.created_at), 'MMM d, yyyy')}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No recent jobs found.</p>
          )}
        </div>

        {/* Recent Applications Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiSend className="mr-2 text-green-700" /> Recent Applications
          </h3>
          {recent_applications && recent_applications.length > 0 ? (
            <ul className="space-y-3">
              {recent_applications.map((app) => (
                <li key={app.id}>
                  <Link 
                    to={`/dashboard/applications/${app.id}`} 
                    className="block p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 border border-transparent hover:border-green-300"
                  >
                    <p className="text-lg font-medium text-green-700">App ID: {app.id}</p>
                    <p className="text-sm text-gray-600">Job ID: {app.job_id} | Applicant ID: {app.applicant_id}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      Status: <span className={`font-semibold ${app.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>{app.status}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Applied on: {format(new Date(app.applied_at), 'MMM d, yyyy')}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No recent applications found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;