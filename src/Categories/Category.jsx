import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import CategoryItem from "./CategoryItem";
import { Link } from "react-router";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/job-categories/")
      .then((res) =>
        setCategories(
          Array.isArray(res.data) ? res.data : res.data.results || [],
        ),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-base-100 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-base-content mb-4 md:mb-0">
            Browse Job Categories
          </h2>
          <Link
            to="/job-categories"
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-full px-6"
          >
            View All
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-xl text-emerald-600"></span>
          </div>
        )}

        {error && <p className="text-center text-error mt-6">Error: {error}</p>}

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
