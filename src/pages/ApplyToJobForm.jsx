import { useState, useEffect } from "react";
import { FaCheck, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { useNavigate, Navigate } from "react-router";
import authApiClient from "../services/auth-api-client";
import useAuthContext from "../hooks/useAuthContext";

const ApplyToJobForm = ({ jobId, hasApplied, onApplySuccess }) => {
  const [applicationStatus, setApplicationStatus] = useState(hasApplied);
  const [isApplying, setIsApplying] = useState(false);
  
  // 💡 CHANGE 1: Switched from File to String/Text for resume and cover letter
  const [coverLetterText, setCoverLetterText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Sync internal state when the prop changes
    setApplicationStatus(hasApplied);
  }, [hasApplied]);

  // Hide form if the user is the employer/admin
  // 1. If user is NOT logged in
  if (!user) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-center mt-8">
        <p className="text-amber-800 font-medium">
          Only Job Seekers can apply for jobs.
        </p>
        <p className="text-amber-700 text-sm mt-1">
          Please <Link to="/login" className="underline font-bold">Login</Link> or 
          <Link to="/register" className="underline font-bold ml-1">Register</Link> an account.
        </p>
      </div>
    );
  }

  // 2. If user is logged in but is an employer/admin
  if (user.role === "employer" || user.role === "admin") {
    return (
      <div className="text-gray-500 text-center mt-8 border p-4 rounded-lg">
        Employer/Admin view. Application not allowed.
      </div>
    );
  }

  // Display success message if already applied
  if (applicationStatus) {
    return (
      <button
        className="btn w-full flex items-center gap-2 bg-emerald-100 text-emerald-700 border-emerald-300"
        disabled
      >
        <FaCheck className="h-4 w-4" />
        Applied Successfully
      </button>
    );
  }

  // Handle application submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Pre-Application Checks
    if (!user) {
      alert("Please log in or register to apply for this job.");
      navigate("/login");
      return;
    }
    if (user.role !== "seeker") {
      alert("Only Job Seekers can apply for jobs.");
      return;
    }
    
    // 💡 CHANGE 2: Mandatory check now uses resumeText instead of resumeFile
    if (!resumeText.trim()) {
      alert("Please provide the text content for your Resume/CV to apply.");
      return;
    }

    setIsApplying(true);

    // 2. Prepare Data for JSON submission
    // NOTE: Sending JSON instead of FormData
    const applicationData = {
      // 💡 CHANGE 3: Send text strings for resume and cover_letter
      resume: resumeText,
      cover_letter: coverLetterText || null, // Send null if empty
      portfolio_link: portfolioLink.trim() || null, // Send null if empty
    };

    // 3. API Call to Apply (using JSON body)
    try {
      // 💡 CHANGE 4: authApiClient automatically serializes the object to JSON
      await authApiClient.post(`/jobs/${jobId}/applications/`, applicationData);

      // 4. Update Status on Success
      setApplicationStatus(true);
      if (onApplySuccess) onApplySuccess(true);
      alert("Application submitted successfully! 🚀");
    } catch (error) {
      console.error("Application failed:", error.response?.data || error);

      // Improved error parsing
      const errorDetail =
        error.response?.data?.detail ||
        error.response?.data?.resume?.[0] || // Error on resume field
        error.response?.data?.cover_letter?.[0] || // Error on cover_letter field
        error.response?.data?.non_field_errors?.[0] ||
        "There was a server error.";

      alert(`Application failed: ${errorDetail}`);
    } finally {
      setIsApplying(false);
    }
  };

  // --- RENDER FORM ---
  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <h3 className="text-xl font-bold mb-4 text-emerald-600">
        Submit Application
      </h3>

      {/* 1. Resume/CV Textarea (Required) */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Resume/CV (Paste Text) *
          </span>
        </label>
        {/* 💡 CHANGE 5: Input is now a textarea for text content */}
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume content here..."
          className="textarea textarea-bordered h-48 w-full"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {resumeText.length} characters entered.
        </p>
      </div>

      {/* 2. Cover Letter Textarea (Optional) */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Cover Letter (Paste Text - Optional)
          </span>
        </label>
        {/* 💡 CHANGE 6: Input is now a textarea for text content */}
        <textarea
          value={coverLetterText}
          onChange={(e) => setCoverLetterText(e.target.value)}
          placeholder="Paste your cover letter content here..."
          className="textarea textarea-bordered h-32 w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          {coverLetterText.length} characters entered.
        </p>
      </div>

      {/* 3. Portfolio Link (Optional) */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Portfolio / Website Link (Optional)
          </span>
        </label>
        <input
          type="url"
          value={portfolioLink}
          onChange={(e) => setPortfolioLink(e.target.value)}
          placeholder="https://yourportfolio.com"
          className="input input-bordered w-full input-sm"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className={`btn w-full flex items-center gap-2 text-white transition duration-150 ease-in-out 
      ${
        isApplying
          ? "bg-emerald-400 border-emerald-400 btn-disabled"
          : "bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
      }`}
          disabled={isApplying}
        >
          {isApplying ? (
            <span className="flex items-center">
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            <span className="flex items-center">
              <FaPaperPlane className="mr-2 h-4 w-4" />
              Submit Application
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ApplyToJobForm;