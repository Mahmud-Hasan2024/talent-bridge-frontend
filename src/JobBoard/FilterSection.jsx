import { useState } from "react";

const FilterSection = ({
  handleSalaryChange,
  categories,
  selectedCategory,
  handleCategoryChange,
  searchQuery,
  handleSearchQuery,
  sortOrder,
  handleSorting,
}) => {
  const MAX_SALARY = 500000;
  const [minSalary, setMinSalary] = useState(0);

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMinSalary(value);
    handleSalaryChange([value, MAX_SALARY]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3">
          💰 Minimum Salary
        </h3>
        <input
          type="range"
          min="0"
          max="200000"
          step="5000"
          value={minSalary}
          onChange={handleChange}
          className="range range-success w-full"
        />
        <div className="text-sm mt-2 text-base-content/80 font-semibold">
          ৳{minSalary.toLocaleString()}+
        </div>
      </div>

      <div className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3">
          📂 Category
        </h3>
        <select
          className="select select-bordered w-full bg-base-200/50"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.job_count || 0})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3">
          🔍 Search
        </h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchQuery(e.target.value)}
          placeholder="Search by title or company..."
          className="input input-bordered w-full bg-base-200/50"
        />
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 rounded-2xl text-white shadow-md flex flex-col">
        <h3 className="font-bold mb-3">⚙️ Sort By</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleSorting("")}
            className={`btn btn-xs sm:btn-sm border-none ${
              sortOrder === ""
                ? "bg-lime-400 text-slate-900 font-bold"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            Default (Featured First)
          </button>
          <button
            onClick={() => handleSorting("salary")}
            className={`btn btn-xs sm:btn-sm border-none ${
              sortOrder === "salary"
                ? "bg-lime-400 text-slate-900 font-bold"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            Salary: Low → High
          </button>
          <button
            onClick={() => handleSorting("-salary")}
            className={`btn btn-xs sm:btn-sm border-none ${
              sortOrder === "-salary"
                ? "bg-lime-400 text-slate-900 font-bold"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            Salary: High → Low
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
