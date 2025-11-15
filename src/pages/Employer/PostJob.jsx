import { useState } from "react";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
// Assuming you create a useJobData hook for categories/choices
import useFetchCategories from "../../hooks/useFetchCategories"; 

const PostJob = () => {
  const { authTokens } = useAuthContext();
  const categories = useFetchCategories(); // Use the dedicated hook

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "", // Added from your Job model
    location: "",
    salary: "",
    category: "", // Will be a category ID
    employment_type: "full_time", // Default value from Job model
    experience_level: "entry_level", // Default value from Job model
    remote_option: "on_site", // Default value from Job model
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const EMPLOYMENT_CHOICES = { full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', internship: 'Internship', temporary: 'Temporary' };
  const EXPERIENCE_CHOICES = { entry_level: 'Entry Level', mid_level: 'Mid Level', senior_level: 'Senior Level', director: 'Director', executive: 'Executive' };
  const REMOTE_CHOICES = { on_site: 'On-site', remote: 'Remote', hybrid: 'Hybrid' };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Convert salary to a number before sending
    const dataToSend = { ...formData, salary: formData.salary ? parseFloat(formData.salary) : null, category: parseInt(formData.category) };

    try {
      const response = await apiClient.post("/jobs/", dataToSend, {
        headers: {
          Authorization: `JWT ${authTokens?.access}`,
        },
      });
      if (response.status === 201) {
        setSuccess("Job posted successfully! Redirecting to My Jobs...");
        // Clear form after successful post
        setFormData({ title: "", description: "", requirements: "", location: "", salary: "", category: "", employment_type: "full_time", experience_level: "entry_level", remote_option: "on_site" });
      }
    } catch (err) {
      console.error("Post Job Error:", err.response?.data || err);
      setError(
        err.response?.data?.detail || "Failed to post job. Check fields and try again."
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Post a New Job
      </h1>

      {success && <div className="alert alert-success mb-4">{success}</div>}
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered w-full" placeholder="Job Title" required />
        
        {/* Location & Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="input input-bordered w-full" placeholder="Location (e.g., Dhaka or Remote)" required />
          <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="input input-bordered w-full" placeholder="Salary (e.g., 40000)" required />
        </div>

        {/* Category */}
        <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Employment, Experience, Remote */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="select select-bordered w-full">
            {Object.entries(EMPLOYMENT_CHOICES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <select name="experience_level" value={formData.experience_level} onChange={handleChange} className="select select-bordered w-full">
            {Object.entries(EXPERIENCE_CHOICES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <select name="remote_option" value={formData.remote_option} onChange={handleChange} className="select select-bordered w-full">
            {Object.entries(REMOTE_CHOICES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {/* Description & Requirements */}
        <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="textarea textarea-bordered w-full" placeholder="Job Description" required />
        <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} className="textarea textarea-bordered w-full" placeholder="Job Requirements (Optional)" />

        <button type="submit" className="btn bg-green-600 hover:bg-green-700 w-full text-white font-semibold">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;