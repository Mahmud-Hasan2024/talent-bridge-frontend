import StatCard from "../../components/Dashboard/StatCard";
import { FiUsers, FiBriefcase, FiSend } from "react-icons/fi";
import { format } from "date-fns";

const AdminDashboard = ({ data }) => {
  // Destructure data for easy access
  const { total_users, total_jobs, total_applications, recent_jobs, recent_applications } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Title color updated to a darker green */}
      <h2 className="text-3xl font-bold text-green-700 mb-8">Admin Overview</h2>

      {/* Stats Cards (StatCard handles its own light theme) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <StatCard icon={FiUsers} title="Total Users" value={total_users} />
        <StatCard icon={FiBriefcase} title="Total Jobs" value={total_jobs} />
        <StatCard icon={FiSend} title="Total Applications" value={total_applications} />
      </div>

      {/* Recent Activity Sections */}
      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* Recent Jobs Card: White background, light border */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiBriefcase className="mr-2 text-green-700" /> Recent Jobs
          </h3>
          {recent_jobs && recent_jobs.length > 0 ? (
            <ul className="space-y-3">
              {recent_jobs.map((job) => (
                <li 
                  key={job.id} 
                  // Light background for list item, subtle hover/border
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 border border-transparent hover:border-green-300"
                >
                  <p className="text-lg font-medium text-green-700">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.company_name}</p>
                  <p className="text-xs text-gray-500">
                    Posted on: {format(new Date(job.created_at), 'MMM d, yyyy')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No recent jobs found.</p>
          )}
        </div>

        {/* Recent Applications Card: White background, light border */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiSend className="mr-2 text-green-700" /> Recent Applications
          </h3>
          {recent_applications && recent_applications.length > 0 ? (
            <ul className="space-y-3">
              {recent_applications.map((app) => (
                <li 
                  key={app.id} 
                  // Light background for list item, subtle hover/border
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 border border-transparent hover:border-green-300"
                >
                  <p className="text-lg font-medium text-green-700">App ID: {app.id}</p>
                  <p className="text-sm text-gray-600">Job ID: {app.job_id} | Applicant ID: {app.applicant_id}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {/* Status colors remain bright for visibility */}
                    Status: <span className={`font-semibold ${app.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>{app.status}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Applied on: {format(new Date(app.applied_at), 'MMM d, yyyy')}
                  </p>
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