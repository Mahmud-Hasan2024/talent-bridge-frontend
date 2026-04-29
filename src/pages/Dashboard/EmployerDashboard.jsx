import StatCard from "../../components/Dashboard/StatCard";
import { FiBriefcase, FiSend, FiStar, FiEye } from "react-icons/fi";

const EmployerDashboard = ({ data }) => {
  // Destructure data based on EmployerDashboardSerializer fields
  const { jobs_posted, total_applications, featured_jobs, top_jobs } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-green-700 mb-8">Employer Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard icon={FiBriefcase} title="Jobs Posted" value={jobs_posted} />
        <StatCard icon={FiSend} title="Total Applications" value={total_applications} />
        <StatCard icon={FiStar} title="Featured Jobs" value={featured_jobs} />
        <StatCard 
          icon={FiEye} 
          title="Total Job Views" 
          // Safely calculate the total views from the top_jobs list for a summary stat
          value={top_jobs?.reduce((sum, job) => sum + (job.views_count || 0), 0) || 0} 
        />
      </div>

      {/* Top Jobs Section (Ranked by Views Count) */}
      <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiBriefcase className="mr-2 text-green-700" /> Top Performing Jobs
        </h3>
        {top_jobs && top_jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full text-gray-800">
              {/* head */}
              <thead>
                <tr className="border-b border-gray-300 text-green-700">
                  <th className="font-bold">Job Title</th>
                  <th className="font-bold text-center">Applications</th>
                  <th className="font-bold text-center">Views</th>
                </tr>
              </thead>
              <tbody>
                {top_jobs.map((job, index) => (
                  <tr key={job.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition duration-150 border-b border-gray-100`}>
                    <td className="font-medium text-gray-800">{job.title}</td>
                    <td className="text-center">
                      <span className="text-green-600 font-semibold">{job.live_applications_count}</span>
                    </td>
                    <td className="text-center text-gray-600">{job.views_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No jobs posted yet or data not available.</p>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;