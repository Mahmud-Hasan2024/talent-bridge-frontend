import { Link } from "react-router";
import { Briefcase, MapPin, Brain, Globe, Calendar } from "lucide-react";

const JobItem = ({ job }) => {
  return (
    <div className="bg-base-100 shadow-sm hover:shadow-xl border border-base-300 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between w-full h-full">
      <div>
        <div className="flex justify-between items-start gap-2 mb-3">
          <div>
            <h3 className="text-xl font-bold text-base-content line-clamp-1">
              {job.title}
            </h3>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
              {job.company_name}
            </p>
          </div>

          {job.is_featured && (
            <span className="bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
              ★ Featured
            </span>
          )}
        </div>

        <p className="text-base-content/70 text-sm mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="space-y-1.5 text-sm text-base-content/70 mb-4">
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-emerald-500 shrink-0" />
            <span className="truncate">{job.location || "N/A"}</span>
          </p>
          <p className="flex items-center gap-2 capitalize">
            <Briefcase size={16} className="text-emerald-500 shrink-0" />
            {(job.employment_type || "full_time").replace("_", " ")}
          </p>
          <p className="flex items-center gap-2 capitalize">
            <Brain size={16} className="text-emerald-500 shrink-0" />
            {(job.experience_level || "entry_level").replace("_", " ")}
          </p>
          <p className="flex items-center gap-2 capitalize">
            <Globe size={16} className="text-emerald-500 shrink-0" />
            {(job.remote_option || "on_site").replace("_", " ")}
          </p>
          <p className="flex items-center gap-2">
            <Calendar size={16} className="text-emerald-500 shrink-0" />
            Posted: {new Date(job.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-base-200 mt-auto">
        <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">
          ৳ {job.salary ? Number(job.salary).toLocaleString() : "Negotiable"}
        </p>
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobItem;
