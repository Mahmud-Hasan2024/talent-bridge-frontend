import { useState, useEffect } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";

const CategoryManager = () => {
  const { authTokens } = useAuthContext();
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/job-categories/");
      setCategories(
        Array.isArray(res.data) ? res.data : res.data.results || [],
      );
      setError(null);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await apiClient.post(
        "/job-categories/",
        { name: newCat },
        { headers: { Authorization: `JWT ${authTokens.access}` } },
      );
      setNewCat("");
      fetchCategories();
    } catch (err) {
      setError("Failed to add category. Check permissions.");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await apiClient.delete(`/job-categories/${id}/`, {
        headers: { Authorization: `JWT ${authTokens.access}` },
      });
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  const updateCategory = async (id) => {
    if (!editingName.trim()) return;
    try {
      await apiClient.patch(
        `/job-categories/${id}/`,
        { name: editingName },
        { headers: { Authorization: `JWT ${authTokens.access}` } },
      );
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (err) {
      setError("Failed to update category.");
    }
  };

  if (loading) return <div className="p-6">Loading categories...</div>;
  if (error) return <div className="p-6 text-error font-bold">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-6">
        Manage Categories
      </h2>

      <form onSubmit={addCategory} className="flex gap-2 mb-6">
        <input
          type="text"
          className="input input-bordered flex-grow bg-base-100"
          placeholder="New Category Name"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          required
        />
        <button
          type="submit"
          className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none px-6"
        >
          Add Category
        </button>
      </form>

      <ul className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-base-content/60">No categories found.</p>
        ) : (
          categories.map((cat) => (
            <li
              key={cat.id}
              className="flex justify-between p-4 bg-base-100 border border-base-300 rounded-xl shadow-sm items-center gap-3"
            >
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="input input-bordered input-sm flex-1"
                  />
                  <button
                    onClick={() => updateCategory(cat.id)}
                    className="btn btn-xs btn-success text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                    className="btn btn-xs btn-ghost"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="font-bold text-base-content">
                    {cat.name}{" "}
                    <span className="text-xs font-normal text-base-content/50">
                      ({cat.job_count || 0} jobs)
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                      }}
                      className="btn btn-xs btn-outline btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="btn btn-xs btn-outline btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CategoryManager;
