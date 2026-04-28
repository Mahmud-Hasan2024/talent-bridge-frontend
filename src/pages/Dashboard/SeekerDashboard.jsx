import StatCard from "../../components/Dashboard/StatCard";
import { FiSend, FiCalendar, FiCheckCircle, FiSearch } from "react-icons/fi";
import { format } from "date-fns";
import { Link } from "react-router"; // 💡 Import Link

const SeekerDashboard = ({ data }) => {
  const { applications_count, interviews, offers, recently_applied, recommended_jobs } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-green-700 mb-8">Job Seeker Dashboard</h2>
      
      {/* 🎯 Stats Cards wrapped in Links */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {/* Add 'flex' to the Link and 'flex-1' or 'w-full' to the wrapper */}
        <Link 
          to="/dashboard/seeker/my-applications" 
          className="flex transition transform hover:scale-105"
        >
          <div className="w-full">
            <StatCard icon={FiSend} title="Total Applications" value={applications_count} />
          </div>
        </Link>

        <Link 
          to="/dashboard/seeker/my-applications" 
          className="flex transition transform hover:scale-105"
        >
          <div className="w-full">
            <StatCard icon={FiCalendar} title="Interviews Scheduled" value={interviews} />
          </div>
        </Link>

        <Link 
          to="/dashboard/seeker/my-applications" 
          className="flex transition transform hover:scale-105"
        >
          <div className="w-full">
            <StatCard icon={FiCheckCircle} title="Job Offers" value={offers} />
          </div>
        </Link>

        <Link 
          to="/dashboard/jobs" 
          className="flex transition transform hover:scale-105"
        >
          <div className="w-full">
            <StatCard 
              icon={FiSearch} 
              title="Recommended Jobs" 
              value={recommended_jobs?.length || 0} 
            />
          </div>
        </Link>
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
                  {/* 🎯 Wrap content in Link to make the entire box clickable */}
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

        {/* 🎯 Recommended Jobs Card with View Details Link */}
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
                    {/* View Details Button */}
                    <Link
                      to={`/jobs/${job.id}`} // Adjusted to match your new dashboard route
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