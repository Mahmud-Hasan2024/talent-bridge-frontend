import StatCard from "../../components/Dashboard/StatCard";
import { FiSend, FiCalendar, FiCheckCircle, FiSearch } from "react-icons/fi";
import { format } from "date-fns";
import { Link } from "react-router";

const SeekerDashboard = ({ data }) => {
  const {
    applications_count,
    interviews,
    offers,
    recently_applied,
    recommended_jobs,
  } = data;

  return (
    <div className="max-w-7xl mx-auto py-4 px-2">
      <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-8">
        Job Seeker Dashboard
      </h2>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-10">
        <Link
          to="/dashboard/seeker/applications-status"
          className="transition transform hover:scale-[1.02]"
        >
          <StatCard
            icon={FiSend}
            title="Total Applications"
            value={applications_count}
          />
        </Link>
        <Link
          to="/dashboard/seeker/applications-status"
          className="transition transform hover:scale-[1.02]"
        >
          <StatCard icon={FiCalendar} title="Interviewed" value={interviews} />
        </Link>
        <Link
          to="/dashboard/seeker/applications-status"
          className="transition transform hover:scale-[1.02]"
        >
          <StatCard icon={FiCheckCircle} title="Job Offers" value={offers} />
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-300">
          <h3 className="text-xl font-bold text-base-content mb-4 flex items-center">
            <FiSend className="mr-2 text-emerald-600" /> Recently Applied
          </h3>
          {recently_applied && recently_applied.length > 0 ? (
            <ul className="space-y-3">
              {recently_applied.map((app) => (
                <li key={app.id}>
                  <Link
                    to={`/jobs/${app.job_id}`}
                    className="block p-3.5 bg-base-200/60 rounded-xl hover:bg-base-200 transition border border-transparent hover:border-emerald-500/40"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                          Application #{app.id}
                        </p>
                        <p className="text-sm text-base-content/70">
                          Job ID: {app.job_id}
                        </p>
                        <p className="text-xs text-base-content/50 mt-1">
                          Applied on:{" "}
                          {format(new Date(app.applied_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <span className="badge badge-success badge-outline capitalize font-semibold">
                        {app.status}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base-content/60">
              You haven't applied to any jobs recently.
            </p>
          )}
        </div>

        <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-300">
          <h3 className="text-xl font-bold text-base-content mb-4 flex items-center">
            <FiSearch className="mr-2 text-emerald-600" /> Recommended For You
          </h3>
          {recommended_jobs && recommended_jobs.length > 0 ? (
            <ul className="space-y-3">
              {recommended_jobs.map((job) => (
                <li
                  key={job.id}
                  className="p-3.5 bg-base-200/60 rounded-xl hover:bg-base-200 transition border border-transparent hover:border-emerald-500/40"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        {job.title}
                      </p>
                      <p className="text-sm text-base-content/70">
                        {job.company_name} • {job.location}
                      </p>
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                    >
                      View →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base-content/60">
              We couldn't find any recommendations right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
