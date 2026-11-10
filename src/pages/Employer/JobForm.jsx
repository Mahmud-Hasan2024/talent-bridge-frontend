import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import apiClient from "../../services/api-client";
import useAuthContext from "../../hooks/useAuthContext";
import useFetchCategories from "../../hooks/useFetchCategories";

const EMPLOYMENT_CHOICES = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  internship: "Internship",
  temporary: "Temporary",
};
const EXPERIENCE_CHOICES = {
  entry_level: "Entry Level",
  mid_level: "Mid Level",
  senior_level: "Senior Level",
  director: "Director",
  executive: "Executive",
};
const REMOTE_CHOICES = {
  on_site: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

const JobForm = ({ isEdit = false }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { authTokens, user } = useAuthContext();
  const categories = useFetchCategories();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    employer: user?.id || "",
  });

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
            title: jobData.title || "",
            company_name: jobData.company_name || "",
            location: jobData.location || "",
            description: jobData.description || "",
            requirements: jobData.requirements || "",
            salary: jobData.salary || "",
            category: jobData.category?.id || jobData.category || "",
            employment_type: jobData.employment_type || "full_time",
            experience_level: jobData.experience_level || "entry_level",
            remote_option: jobData.remote_option || "on_site",
            employer: jobData.employer || user?.id,
          });
        })
        .catch((err) => console.error("Error fetching job:", err))
        .finally(() => setLoading(false));
    }
  }, [isEdit, jobId, authTokens, user?.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const dataToSend = {
      employer: formData.employer || user.id,
      category_id: parseInt(formData.category, 10),
      salary: formData.salary ? parseFloat(formData.salary) : null,
      title: formData.title,
      company_name: formData.company_name,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      employment_type: formData.employment_type,
      experience_level: formData.experience_level,
      remote_option: formData.remote_option,
    };

    try {
      const method = isEdit ? apiClient.put : apiClient.post;
      const url = isEdit ? `/jobs/${jobId}/` : "/jobs/";

      await method(url, dataToSend, {
        headers: { Authorization: `JWT ${authTokens?.access}` },
      });

      if (user?.role === "admin") {
        navigate("/dashboard/admin/all-jobs");
      } else {
        navigate("/dashboard/employer/my-jobs");
      }
    } catch (err) {
      setError(err.response?.data || { detail: "An unknown error occurred." });
    }
  };

  if (!user || loading)
    return <div className="text-center py-8">Loading form...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-base-100 rounded-2xl shadow-sm border border-base-300">
      <h2 className="text-3xl font-extrabold mb-6 text-emerald-600 dark:text-emerald-400">
        {isEdit ? "Edit Job" : "Post a New Job"}
      </h2>

      {error && (
        <div className="alert alert-error mb-4">
          <h4 className="font-bold">Submission Failed:</h4>
          {typeof error === "object" ? (
            <ul>
              {Object.entries(error).map(([key, messages]) => (
                <li key={key}>
                  <strong>{key.replace("_", " ")}:</strong>{" "}
                  {Array.isArray(messages)
                    ? messages.join(", ")
                    : String(messages)}
                </li>
              ))}
            </ul>
          ) : (
            <p>{error.detail || String(error)}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          className="input input-bordered w-full bg-base-200/50"
          value={formData.company_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          className="input input-bordered w-full bg-base-200/50"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="location"
            placeholder="Location (e.g., Dhaka)"
            className="input input-bordered w-full bg-base-200/50"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary in BDT (e.g., 50000)"
            className="input input-bordered w-full bg-base-200/50"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>

        <select
          name="category"
          className="select select-bordered w-full bg-base-200/50"
          value={formData.category || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            className="select select-bordered w-full bg-base-200/50"
          >
            {Object.entries(EMPLOYMENT_CHOICES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            className="select select-bordered w-full bg-base-200/50"
          >
            {Object.entries(EXPERIENCE_CHOICES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <select
            name="remote_option"
            value={formData.remote_option}
            onChange={handleChange}
            className="select select-bordered w-full bg-base-200/50"
          >
            {Object.entries(REMOTE_CHOICES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="description"
          rows={5}
          placeholder="Job Description"
          className="textarea textarea-bordered w-full bg-base-200/50"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <textarea
          name="requirements"
          rows={4}
          placeholder="Job Requirements (Optional)"
          className="textarea textarea-bordered w-full bg-base-200/50"
          value={formData.requirements}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn bg-emerald-600 hover:bg-emerald-700 border-none w-full text-white font-bold rounded-xl"
        >
          {isEdit ? "Save Changes" : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
