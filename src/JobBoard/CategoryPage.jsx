import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import JobList from "./JobList";
import useFetchCategories from "../hooks/useFetchCategories";
import apiClient from "../services/api-client";

const CategoryPage = () => {
  const categories = useFetchCategories();
  const [categoriesWithJobs, setCategoriesWithJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchJobsForCategories = async () => {
      try {
        setLoading(true);
        const data = await Promise.all(
          categories.map(async (cat) => {
            const jobsRes = await apiClient.get(
              `/jobs/?category_id=${cat.id}&is_active=true`,
            );
            return { ...cat, jobs: jobsRes.data.results || jobsRes.data || [] };
          }),
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
    } else {
      setLoading(false);
    }
  }, [categories]);

  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [loading, location.hash, categoriesWithJobs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 text-center mb-12">
        Job Categories 🌱
      </h1>

      {categoriesWithJobs.map((category) => (
        <div
          key={category.id}
          id={`category-${category.id}`}
          className="mb-16 scroll-mt-24"
        >
          <div className="mb-6 border-b border-base-300 pb-3">
            <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-base-content/70 mt-1">
                {category.description}
              </p>
            )}
          </div>

          {category.jobs.length > 0 ? (
            <JobList jobs={category.jobs} loading={false} />
          ) : (
            <p className="text-base-content/50 font-medium italic">
              No jobs available in this category right now.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
