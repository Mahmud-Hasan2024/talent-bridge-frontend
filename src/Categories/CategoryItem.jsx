import { FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router";

const CategoryItem = ({ category }) => {
  return (
    <div className="group bg-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 p-6 rounded-2xl shadow-sm hover:shadow-lg cursor-pointer border border-slate-100">
      {/* Top row */}
      <div className="flex justify-between items-start mb-4">
        <div
          className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold
                     bg-emerald-50 text-emerald-700 group-hover:bg-white/30 group-hover:text-white transition"
        >
          {category.name.charAt(0)}
        </div>

        <span
          className="text-xs px-3 py-1 rounded-full font-semibold
                     bg-lime-100 text-lime-800 group-hover:bg-white/20 group-hover:text-white transition"
        >
          {category.job_count} Jobs
        </span>
      </div>

      {/* Title + description */}
      <h3 className="text-xl font-bold mb-2 text-gray-700 group-hover:text-white transition">
        {category.name}
      </h3>
      <p className="text-sm text-gray-700 group-hover:text-white/90 mb-4 transition line-clamp-2">
        {category.description}
      </p>

      {/* Footer link - Updated to point to the Category Page with a Hash */}
      <Link
        to={`/job-categories#category-${category.id}`}
        className="inline-flex items-center gap-2 font-semibold
                   text-emerald-600 hover:text-emerald-800 group-hover:text-white transition"
      >
        Explore
        <FaAngleRight className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default CategoryItem;