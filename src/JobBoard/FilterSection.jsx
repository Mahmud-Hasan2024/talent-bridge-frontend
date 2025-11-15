import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";

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
    const value = parseInt(e.target.value);
    setMinSalary(value);
    handleSalaryChange([value, MAX_SALARY]); // update salary range in parent
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {/* Minimum Salary Filter */}
      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold text-emerald-700 mb-3">Minimum Salary</h3>
        <input
          type="range"
          min="0"
          max="200000"
          step="5000"
          value={minSalary}
          onChange={handleChange}
          className="range range-emerald-500 w-full"
        />
        <div className="text-sm mt-2 text-emerald-700 font-medium">
          ${minSalary.toLocaleString()}+
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-emerald-700 mb-4">📂 Category</h3>
        <select
          className="select select-bordered w-full text-gray-700"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.job_count})
            </option>
          ))}
        </select>
      </div>

      {/* Search Filter */}
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-emerald-700 mb-4">🔍 Search</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchQuery(e.target.value)}
          placeholder="Search by title or company..."
          className="input input-bordered w-full"
        />
      </div>

      {/* Sorting */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 rounded-2xl text-white shadow-lg flex flex-col">
        <h3 className="text-lg font-bold mb-4">⚙️ Sort By</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleSorting("")}
            className={`btn btn-sm ${
              sortOrder === ""
                ? "btn-accent text-emerald-900"
                : "btn-outline text-white"
            }`}
          >
            Default
          </button>
          <button
            onClick={() => handleSorting("salary")}
            className={`btn btn-sm ${
              sortOrder === "salary"
                ? "btn-accent text-emerald-900"
                : "btn-outline text-white"
            }`}
          >
            Salary: Low → High
          </button>
          <button
            onClick={() => handleSorting("-salary")}
            className={`btn btn-sm ${
              sortOrder === "-salary"
                ? "btn-accent text-emerald-900"
                : "btn-outline text-white"
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
