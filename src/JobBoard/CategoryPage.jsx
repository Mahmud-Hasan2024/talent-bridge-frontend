import { useEffect, useState } from "react";
import JobList from "./JobList";
import useFetchCategories from "../hooks/useFetchCategories";
import apiClient from "../services/api-client";

const CategoryPage = () => {
  const categories = useFetchCategories();
  const [categoriesWithJobs, setCategoriesWithJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobsForCategories = async () => {
      try {
        setLoading(true);

        const data = await Promise.all(
          categories.map(async (cat) => {
            const jobsRes = await apiClient.get(
              `/jobs/?category_id=${cat.id}&is_active=true`
            );
            return { ...cat, jobs: jobsRes.data.results };
          })
        );

        setCategoriesWithJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchJobsForCategories();
    }
  }, [categories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-emerald-700 text-center mb-12">
        Job Categories 🌱
      </h1>

      {categoriesWithJobs.map((category) => (
        <div key={category.id} className="mb-16">
          {/* Category Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-emerald-700">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-gray-600 mt-1">{category.description}</p>
            )}
          </div>

          {/* Jobs under this category */}
          {category.jobs.length > 0 ? (
            <JobList jobs={category.jobs} loading={false} />
          ) : (
            <p className="text-gray-500 font-medium">
              No jobs available in this category.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
