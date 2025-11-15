import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import CategoryItem from "./CategoryItem";
import { Link } from "react-router";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(""); // optional error handling

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/job-categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-emerald-50 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 md:mb-0">
            Browse Job Categories
          </h2>
          {/* Optional CTA */}
          <Link
            to="/job-categories"
            className="inline-block px-5 py-2 rounded-full font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            View All
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-xl text-emerald-600"></span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-600 mt-6">Error: {error}</p>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
