import StatCard from "../../components/Dashboard/StatCard";
import { FiSend, FiCalendar, FiCheckCircle, FiActivity, FiSearch } from "react-icons/fi";
import { format } from "date-fns";
import { Link } from "react-router"; 

const SeekerDashboard = ({ data }) => {
  const { applications_count, interviews, offers, recently_applied, recommended_jobs } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-green-700 mb-8">Job Seeker Dashboard</h2>
      
      {/* 🎯 Updated Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {[
          { to: "/dashboard/seeker/my-applications", icon: FiSend, title: "Total Applications", value: applications_count, color: "bg-green-100 text-green-700" },
          { to: "/dashboard/seeker/my-applications", icon: FiCalendar, title: "Interviewed", value: interviews, color: "bg-blue-100 text-blue-700" },
          { to: "/dashboard/seeker/my-applications", icon: FiCheckCircle, title: "Job Offers", value: offers, color: "bg-yellow-100 text-yellow-700" },
          { to: "/dashboard/seeker/applications-status", icon: FiActivity, title: "Application Status", value: applications_count, color: "bg-purple-100 text-purple-700" },
        ].map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className="flex flex-col items-start p-6 bg-white rounded-xl shadow-md border border-gray-100 transition transform hover:scale-105 hover:shadow-xl w-full h-full"
          >
            <div className={`p-3 rounded-lg mb-4 ${item.color}`}>
              <item.icon size={24} />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {item.title}
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {item.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recently Applied Jobs Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiSend className="mr-2 text-green-700" /> Recently Applied
          </h3>
          {recently_applied && recently_applied.length > 0 ? (
            <ul className="space-y-3">
              {recently_applied.map((app) => (
                <li key={app.id}>
                  <Link 
                    to={`/jobs/${app.job_id}`} 
                    className="block p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 border border-transparent hover:border-green-300 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-medium text-green-700">
                          Application ID: {app.id}
                        </p>
                        <p className="text-sm text-gray-600">Job ID: {app.job_id}</p>
                        <p className="text-xs text-gray-500">
                          Applied on: {format(new Date(app.applied_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span 
                        className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                          app.status === 'offered' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You haven't applied to any jobs recently.</p>
          )}
        </div>

        {/* 🎯 Recommended Jobs Card remains here for discovery */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiSearch className="mr-2 text-green-700" /> Recommended For You
          </h3>
          {recommended_jobs && recommended_jobs.length > 0 ? (
            <ul className="space-y-3">
              {recommended_jobs.map((job) => (
                <li 
                  key={job.id} 
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 border border-transparent hover:border-green-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium text-green-700">{job.title}</p>
                      <p className="text-sm text-gray-600">{job.company_name} - {job.location}</p>
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-sm font-medium text-emerald-700 hover:text-emerald-900 transition flex items-center gap-1"
                    >
                      View Details →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">We couldn't find any recommendations right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;