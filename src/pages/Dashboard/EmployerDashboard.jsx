import { FiBriefcase, FiSend, FiStar } from "react-icons/fi";
import { Link } from "react-router"; // 💡 Import Link for navigation

const EmployerDashboard = ({ data }) => {
  // Destructure data based on EmployerDashboardSerializer fields
  const { jobs_posted, total_applications, featured_jobs, top_jobs } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-green-700 mb-8">Employer Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        {/* Jobs Posted -> Redirects to My Jobs */}
        <Link
          to="/dashboard/employer/my-jobs"
          className="flex flex-col items-start p-6 bg-white rounded-xl shadow-md border border-gray-100 transition transform hover:scale-105 hover:shadow-xl w-full"
        >
          <div className="p-3 bg-green-100 rounded-lg text-green-700 mb-4">
            <FiBriefcase size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Jobs Posted</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{jobs_posted}</p>
        </Link>

        {/* Total Applications -> Redirects to All Applicants */}
        <Link
          to="/dashboard/employer/applicants"
          className="flex flex-col items-start p-6 bg-white rounded-xl shadow-md border border-gray-100 transition transform hover:scale-105 hover:shadow-xl w-full"
        >
          <div className="p-3 bg-green-100 rounded-lg text-green-700 mb-4">
            <FiSend size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Applications</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{total_applications}</p>
        </Link>

        {/* Featured Jobs -> Redirects to My Jobs */}
        <Link
          to="/dashboard/employer/my-jobs"
          className="flex flex-col items-start p-6 bg-white rounded-xl shadow-md border border-gray-100 transition transform hover:scale-105 hover:shadow-xl w-full"
        >
          <div className="p-3 bg-yellow-100 rounded-lg text-yellow-700 mb-4">
            <FiStar size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Featured Jobs</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{featured_jobs}</p>
        </Link>
      </div>

      {/* Top Performing Jobs Section */}
      <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiBriefcase className="mr-2 text-green-700" /> Top Performing Jobs
        </h3>
        {top_jobs && top_jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full text-gray-800">
              <thead>
                <tr className="border-b border-gray-300 text-green-700">
                  <th className="font-bold">Job Title</th>
                  <th className="font-bold text-center">Applications</th>
                  <th className="font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {top_jobs.map((job, index) => (
                  <tr key={job.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition duration-150 border-b border-gray-100`}>
                    <td className="font-medium text-gray-800">
                      {/* Clicking Title redirects to that job's specific applicants */}
                      <Link 
                        to={`/dashboard/employer/applicants?job=${job.id}`} 
                        className="hover:text-green-700 hover:underline"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td className="text-center">
                      <span className="text-green-600 font-semibold">{job.live_applications_count}</span>
                    </td>
                    <td className="text-right">
                      <Link 
                        to={`/dashboard/employer/applicants?job=${job.id}`} 
                        className="btn btn-xs btn-outline btn-success"
                      >
                        View Apps
                      </Link>
                    </td>
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