import { Link } from "react-router";
import { Briefcase, MapPin, Brain, Globe, Calendar } from "lucide-react";

const JobItem = ({ job }) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-2xl p-6 transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
          <p className="text-emerald-600 font-medium">{job.company_name}</p>
        </div>

        {job.is_featured && (
          <span className="bg-lime-100 text-lime-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="space-y-1 text-sm text-gray-500 mb-4">
        <p className="flex items-center gap-2">
          <MapPin size={16} className="text-emerald-500" />
          {job.location}
        </p>
        <p className="flex items-center gap-2">
          <Briefcase size={16} className="text-emerald-500" />
          {job.employment_type.replace("_", " ")}
        </p>
        <p className="flex items-center gap-2">
          <Brain size={16} className="text-emerald-500" />
          {job.experience_level.charAt(0).toUpperCase() +
            job.experience_level.slice(1)}
        </p>
        <p className="flex items-center gap-2">
          <Globe size={16} className="text-emerald-500" />
          {job.remote_option.charAt(0).toUpperCase() +
            job.remote_option.slice(1)}
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-emerald-500" />
          Posted: {new Date(job.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="font-semibold text-emerald-700">
          ৳ {job.salary.toLocaleString()}
        </p>
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900 transition"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobItem;
