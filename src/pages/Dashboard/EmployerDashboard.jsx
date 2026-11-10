import { FiBriefcase, FiSend, FiStar, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router";
import StatCard from "../../components/Dashboard/StatCard";

const EmployerDashboard = ({ data }) => {
  const { jobs_posted, total_applications, featured_jobs, top_jobs } = data;

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-2">
      <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-8">
        Employer Overview
      </h2>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-10">
        <Link
          to="/dashboard/employer/my-jobs"
          className="transition transform hover:scale-[1.02]"
        >
          <StatCard
            icon={FiBriefcase}
            title="Jobs Posted"
            value={jobs_posted}
          />
        </Link>

        <Link
          to="/dashboard/employer/applicants"
          className="transition transform hover:scale-[1.02]"
        >
          <StatCard
            icon={FiSend}
            title="Total Applications"
            value={total_applications}
          />
        </Link>

        <Link
          to="/dashboard/employer/my-jobs"
          className="transition transform hover:scale-[1.02]"
        >
          <StatCard icon={FiStar} title="Featured Jobs" value={featured_jobs} />
        </Link>
      </div>

      <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-300">
        <h3 className="text-xl font-bold text-base-content mb-6 flex items-center">
          <FiTrendingUp className="mr-2 text-emerald-600" /> Top Performing Jobs
        </h3>

        {top_jobs && top_jobs.length > 0 ? (
          <ul className="space-y-4">
            {top_jobs.map((job) => (
              <li key={job.id}>
                <Link
                  to={`/dashboard/employer/applicants?job_id=${job.id}`}
                  className="block p-4 bg-base-200/60 rounded-xl hover:bg-base-200 transition border border-base-300 hover:border-emerald-500/40"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold text-base-content truncate">
                        {job.title}
                      </p>
                      <p className="text-sm text-base-content/70 font-medium mt-0.5">
                        Total Applications:{" "}
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {job.live_applications_count}
                        </span>
                      </p>
                    </div>
                    <span className="btn btn-xs sm:btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-lg">
                      View Applicants →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 bg-base-200/40 rounded-xl border border-dashed border-base-300">
            <p className="text-base-content/60 font-medium">
              No active job performance data available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
