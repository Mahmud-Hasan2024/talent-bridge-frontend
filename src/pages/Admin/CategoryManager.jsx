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
      // Handle either paginated or non-paginated list
      setCategories(Array.isArray(res.data) ? res.data : res.data.results);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
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
    if (!newCat.trim()) return; // Prevent empty category
    try {
      await apiClient.post(
        "/job-categories/",
        { name: newCat },
        { headers: { Authorization: `JWT ${authTokens.access}` } }
      );
      setNewCat("");
      fetchCategories();
    } catch (err) {
      console.error("Failed to add category:", err);
      setError("Failed to add category. Check permissions.");
    }
  };

  // 💡 MODIFIED FUNCTION: Added delete confirmation
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }
    
    try {
      await apiClient.delete(`/job-categories/${id}/`, {
        headers: { Authorization: `JWT ${authTokens.access}` },
      });
      // Optionally update the state locally for faster UI update
      setCategories(categories.filter(cat => cat.id !== id));
      // fetchCategories(); // Re-fetching is safer, but local update is faster
    } catch (err) {
      console.error("Failed to delete category:", err);
      // Inform the user about the failure
      alert("Failed to delete category. It might be in use or you lack permissions.");
      setError("Failed to delete category.");
    }
  };

  const updateCategory = async (id) => {
    if (!editingName.trim()) return;
    try {
      await apiClient.patch(
        `/job-categories/${id}/`,
        { name: editingName },
        { headers: { Authorization: `JWT ${authTokens.access}` } }
      );
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (err) {
      console.error("Failed to update category:", err);
      setError("Failed to update category. Check permissions.");
    }
  };

  if (loading) return <div className="p-6">Loading categories...</div>;
  if (error) return <div className="p-6 text-red-600 font-bold">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      
      {/* Add Category Form */}
      <form onSubmit={addCategory} className="flex gap-2 mb-4">
        <input
          type="text"
          className="input input-bordered flex-grow"
          placeholder="New Category Name"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success text-white">Add</button>
      </form>

      {/* Category List */}
      <ul className="space-y-2">
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          categories.map((cat) => (
            <li
              key={cat.id}
              className="flex justify-between p-3 bg-white rounded-lg shadow items-center"
            >
              {editingId === cat.id ? (
                // Editing View
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="input input-bordered flex-1"
                  />
                  <button
                    onClick={() => updateCategory(cat.id)}
                    className="btn btn-xs btn-primary ml-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                    className="btn btn-xs btn-warning ml-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                // Display View
                <>
                  <span className="font-medium">{cat.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                      }}
                      className="btn btn-xs btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="btn btn-xs btn-error text-white"
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