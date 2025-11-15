import { useState } from "react";
import FilterSection from "./FilterSection";
import Pagination from "./Pagination";
import useFetchJobs from "../hooks/useFetchJobs";
import useFetchCategories from "../hooks/useFetchCategories";
import JobList from "./JobList";

const JobPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const categories = useFetchCategories();
  const { jobs, loading, totalPages } = useFetchJobs(
    currentPage,
    salaryRange,
    selectedCategory,
    searchQuery,
    sortOrder
  );

  // salary change function
  const handleSalaryChange = (range) => {
    setSalaryRange(range);
    setCurrentPage(1);
  };

  return (
    <div className="bg-base-200 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-emerald-700">
          Find Your Dream Job 🌱
        </h1>

        <FilterSection
          salaryRange={salaryRange}
          handleSalaryChange={handleSalaryChange}
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          handleSearchQuery={setSearchQuery}
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
