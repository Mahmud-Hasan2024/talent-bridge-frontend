import { useState } from "react";
import FilterSection from "./FilterSection";
import Pagination from "./Pagination";
import useFetchJobs from "../hooks/useFetchJobs";
import useFetchCategories from "../hooks/useFetchCategories";
import JobList from "./JobList";

const JobPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [salaryRange, setSalaryRange] = useState([0, 500000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const categories = useFetchCategories();
  const { jobs, loading, totalPages } = useFetchJobs(
    currentPage,
    salaryRange,
    selectedCategory,
    searchQuery,
    sortOrder,
  );

  const handleSalaryChange = (range) => {
    setSalaryRange(range);
    setCurrentPage(1);
  };

  return (
    <div className="bg-base-200 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
            Find Your Dream Job 🌱
          </h1>
          <p className="text-base-content/70 mt-2">
            Filter by salary, category, or keywords to land your next role.
          </p>
        </div>

        <FilterSection
          salaryRange={salaryRange}
          handleSalaryChange={handleSalaryChange}
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={(val) => {
            setSelectedCategory(val);
            setCurrentPage(1);
          }}
          searchQuery={searchQuery}
          handleSearchQuery={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          sortOrder={sortOrder}
          handleSorting={setSortOrder}
        />

        <JobList jobs={jobs} loading={loading} />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default JobPage;
