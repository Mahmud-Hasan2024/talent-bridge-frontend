import StatCard from "../../components/Dashboard/StatCard";
import { FiSend, FiCalendar, FiCheckCircle, FiSearch } from "react-icons/fi";
import { format } from "date-fns";

const SeekerDashboard = ({ data }) => {
  // Destructure data based on SeekerDashboardSerializer fields
  const { applications_count, interviews, offers, recently_applied, recommended_jobs } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Title color updated to a darker green */}
      <h2 className="text-3xl font-bold text-green-700 mb-8">Job Seeker Dashboard</h2>
      
      {/* Stats Cards: Application Progress (StatCard handles its own light theme) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard icon={FiSend} title="Total Applications" value={applications_count} />
        <StatCard icon={FiCalendar} title="Interviews Scheduled" value={interviews} />
        <StatCard icon={FiCheckCircle} title="Job Offers" value={offers} />
        <StatCard 
          icon={FiSearch} 
          title="Recommended Jobs" 
          value={recommended_jobs?.length || 0} 
        />
      </div>

      {/* Activity and Recommendations Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* Recently Applied Jobs Card: White background, light border */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiSend className="mr-2 text-green-700" /> Recently Applied
          </h3>
          {recently_applied && recently_applied.length > 0 ? (
            <ul className="space-y-3">
              {recently_applied.map((app) => (
                <li 
                  key={app.id} 
                  // Light background for list item, subtle hover/border
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 border border-transparent hover:border-green-300"
                >
                  <p className="text-lg font-medium text-green-700">Application ID: {app.id}</p>
                  <p className="text-sm text-gray-600">Job ID: {app.job_id}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {/* Status colors remain visible on light background */}
                    Status: <span className={`font-semibold ${app.status === 'offered' ? 'text-yellow-600' : 'text-green-600'}`}>{app.status}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Applied on: {format(new Date(app.applied_at), 'MMM d, yyyy')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You haven't applied to any jobs recently.</p>
          )}
        </div>

        {/* Recommended Jobs Card: White background, light border */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiSearch className="mr-2 text-green-700" /> Recommended For You
          </h3>
          {recommended_jobs && recommended_jobs.length > 0 ? (
            <ul className="space-y-3">
              {recommended_jobs.map((job) => (
                <li 
                  key={job.id} 
                  // Light background for list item, subtle hover/border
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 cursor-pointer border border-transparent hover:border-green-300"
                >
                  <p className="text-lg font-medium text-green-700">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.company_name} - {job.location}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">We couldn't find any recommendations for you right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;