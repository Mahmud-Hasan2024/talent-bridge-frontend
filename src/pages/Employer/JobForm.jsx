import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router"; 
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import useFetchCategories from "../../hooks/useFetchCategories";

// Define the choices needed for the select fields
const EMPLOYMENT_CHOICES = { full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', internship: 'Internship', temporary: 'Temporary' };
const EXPERIENCE_CHOICES = { entry_level: 'Entry Level', mid_level: 'Mid Level', senior_level: 'Senior Level', director: 'Director', executive: 'Executive' };
const REMOTE_CHOICES = { on_site: 'On-site', remote: 'Remote', hybrid: 'Hybrid' };

const JobForm = ({ isEdit = false }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { authTokens, user } = useAuthContext();
  const categories = useFetchCategories();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize all required fields including company_name, requirements
  const [formData, setFormData] = useState({
    title: "",
    company_name: user?.company_name || "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    category: "",
    employment_type: "full_time",
    experience_level: "entry_level",
    remote_option: "on_site",
  });

  // Fetch job for editing
  useEffect(() => {
    if (isEdit && jobId) {
      setLoading(true);
      apiClient
        .get(`/jobs/${jobId}/`, {
          headers: { Authorization: `JWT ${authTokens?.access}` },
        })
        .then((res) => {
          const jobData = res.data;
          setFormData({
            title: jobData.title,
            company_name: jobData.company_name, // <-- Load company name for edit
            location: jobData.location,
            description: jobData.description,
            requirements: jobData.requirements,
            salary: jobData.salary || "",
            category: jobData.category?.id || jobData.category || "", 
            employment_type: jobData.employment_type || "full_time",
            experience_level: jobData.experience_level || "entry_level",
            remote_option: jobData.remote_option || "on_site",
          });
        })
        .catch((err) => console.error("Error fetching job:", err))
        .finally(() => setLoading(false));
    }
  }, [isEdit, jobId, authTokens]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // --- FINAL DATA PREPARATION ---
    const dataToSend = {
      // 1. Send employer ID
      employer: user.id, 
      
      // 2. Rename category field
      category_id: parseInt(formData.category),
      
      // 3. Convert salary to number
      salary: formData.salary ? parseFloat(formData.salary) : null,
      
      // All other form fields
      title: formData.title,
      company_name: formData.company_name,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      employment_type: formData.employment_type,
      experience_level: formData.experience_level,
      remote_option: formData.remote_option,
    };
    // ----------------------------

    try {
      const method = isEdit ? apiClient.put : apiClient.post;
      const url = isEdit ? `/jobs/${jobId}/` : "/jobs/";

      await method(url, dataToSend, {
        headers: { Authorization: `JWT ${authTokens?.access}` },
      });

      navigate("/Dashboard/employer/my-jobs");
    } catch (err) {
      console.error("Error submitting job:", err.response?.data || err);
      // Display the structured error from the backend
      setError(err.response?.data || { detail: "An unknown error occurred." });
    }
  };

  if (!user || loading) return <div className="text-center py-8">Loading form...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-700">
        {isEdit ? "Edit Job" : "Post a New Job"}
      </h2>
      
      {/* Display structured error messages */}
      {error && (
        <div className="alert alert-error mb-4">
          <h4 className="font-bold">Submission Failed:</h4>
          {typeof error === 'object' ? (
            <ul>
              {Object.entries(error).map(([key, messages]) => (
                <li key={key}>
                  <strong>{key.replace('_', ' ')}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                </li>
              ))}
            </ul>
          ) : (
            <p>{error.detail || String(error)}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name Input */}
        <input 
          type="text" 
          name="company_name" 
          placeholder="Company Name" 
          className="input input-bordered w-full" 
          value={formData.company_name} 
          onChange={handleChange} 
          required 
        />
        
        {/* Title */}
        <input type="text" name="title" placeholder="Job Title" className="input input-bordered w-full" value={formData.title} onChange={handleChange} required />
        
        {/* Location & Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="location" placeholder="Location" className="input input-bordered w-full" value={formData.location} onChange={handleChange} required />
          <input type="number" name="salary" placeholder="Salary" className="input input-bordered w-full" value={formData.salary} onChange={handleChange} required />
        </div>

        {/* Category */}
        <select name="category" className="select select-bordered w-full" value={formData.category || ""} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
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
        <textarea name="description" placeholder="Job Description" className="textarea textarea-bordered w-full" value={formData.description} onChange={handleChange} required />
        <textarea name="requirements" placeholder="Job Requirements (Optional)" className="textarea textarea-bordered w-full" value={formData.requirements} onChange={handleChange} />

        <button type="submit" className="btn bg-green-600 hover:bg-green-700 w-full text-white font-semibold">
          {isEdit ? "Save Changes" : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;