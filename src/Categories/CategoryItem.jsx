import { FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router";

const CategoryItem = ({ category }) => {
  return (
    <div className="group bg-base-100 hover:bg-gradient-to-br hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 p-6 rounded-2xl shadow-sm hover:shadow-xl cursor-pointer border border-base-300">
      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:bg-white/25 group-hover:text-white transition">
          {category.name?.charAt(0)}
        </div>

        <span className="text-xs px-3 py-1 rounded-full font-bold bg-lime-500/15 text-emerald-700 dark:text-lime-300 group-hover:bg-white/20 group-hover:text-white transition">
          {category.job_count || 0} Jobs
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2 text-base-content group-hover:text-white transition">
        {category.name}
      </h3>
      <p className="text-sm text-base-content/70 group-hover:text-white/90 mb-4 transition line-clamp-2">
        {category.description ||
          "Explore open roles and career opportunities in this sector."}
      </p>

      <Link
        to={`/job-categories#category-${category.id}`}
        className="inline-flex items-center gap-2 font-bold text-sm text-emerald-600 dark:text-emerald-400 group-hover:text-white transition"
      >
        Explore
        <FaAngleRight className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default CategoryItem;
