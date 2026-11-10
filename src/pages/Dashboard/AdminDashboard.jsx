import StatCard from "../../components/Dashboard/StatCard";
import { FiUsers, FiBriefcase, FiSend } from "react-icons/fi";
import { format } from "date-fns";
import { Link } from "react-router";

const AdminDashboard = ({ data }) => {
  const {
    total_users,
    total_jobs,
    total_applications,
    recent_jobs,
    recent_applications,
  } = data;

  return (
    <div className="max-w-7xl mx-auto py-4 px-2">
      <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-8">
        Admin Overview
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <Link
          to="/dashboard/admin/users"
          className="transition transform hover:scale-[1.02]"
        >
          <StatCard icon={FiUsers} title="Total Users" value={total_users} />
        </Link>

        <Link
          to="/dashboard/admin/all-jobs"
          className="transition transform hover:scale-[1.02]"
        >
          <StatCard icon={FiBriefcase} title="Total Jobs" value={total_jobs} />
        </Link>

        <Link
          to="/dashboard/admin/applicants"
          className="transition transform hover:scale-[1.02]"
        >
          <StatCard
            icon={FiSend}
            title="Total Applications"
            value={total_applications}
          />
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-300">
          <h3 className="text-xl font-bold text-base-content mb-4 flex items-center">
            <FiBriefcase className="mr-2 text-emerald-600" /> Recent Jobs
          </h3>
          {recent_jobs && recent_jobs.length > 0 ? (
            <ul className="space-y-3">
              {recent_jobs.map((job) => (
                <li key={job.id}>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="block p-3.5 bg-base-200/60 rounded-xl hover:bg-base-200 transition border border-transparent hover:border-emerald-500/40"
                  >
                    <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {job.title}
                    </p>
                    <p className="text-sm text-base-content/70">
                      {job.company_name}
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                      Posted on:{" "}
                      {format(new Date(job.created_at), "MMM d, yyyy")}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base-content/60">No recent jobs found.</p>
          )}
        </div>

        <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-300">
          <h3 className="text-xl font-bold text-base-content mb-4 flex items-center">
            <FiSend className="mr-2 text-emerald-600" /> Recent Applications
          </h3>
          {recent_applications && recent_applications.length > 0 ? (
            <ul className="space-y-3">
              {recent_applications.map((app) => (
                <li key={app.id}>
                  <Link
                    to={`/dashboard/applications/${app.id}`}
                    className="block p-3.5 bg-base-200/60 rounded-xl hover:bg-base-200 transition border border-transparent hover:border-emerald-500/40"
                  >
                    <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      Application #{app.id}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Job ID: {app.job_id} | Applicant ID: {app.applicant_id}
                    </p>
                    <p className="text-xs text-base-content/60 capitalize mt-1">
                      Status:{" "}
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {app.status}
                      </span>{" "}
                      • {format(new Date(app.applied_at), "MMM d, yyyy")}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base-content/60">
              No recent applications found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
