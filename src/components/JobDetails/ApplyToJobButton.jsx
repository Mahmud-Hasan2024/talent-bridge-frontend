import { useState, useEffect } from 'react';
import { FaCheck, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router';
import authApiClient from '../../services/auth-api-client';
import useAuthContext from '../../hooks/useAuthContext';

const ApplyToJobButton = ({ jobId, hasApplied, onApplySuccess }) => {
  const [applicationStatus, setApplicationStatus] = useState(hasApplied);
  const [isApplying, setIsApplying] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Sync internal state when the prop changes (e.g., after the initial fetch in JobDetail)
    setApplicationStatus(hasApplied);
  }, [hasApplied]);

  const handleApply = async () => {
    // 1. Pre-Application Checks
    if (!user) {
      alert('Please log in or register to apply for this job.');
      navigate('/login');
      return;
    }
    if (user.role !== 'seeker') {
      alert('Only Job Seekers can apply for jobs.');
      return;
    }
    if (!window.confirm('Are you sure you want to apply for this job?')) {
      return;
    }

    // 2. API Call to Apply
    setIsApplying(true);
    try {
      // Send a minimal, structured JSON body with nullable fields explicitly set to null.
      const payload = {
        portfolio_link: null, 
        cover_letter: null, 
      };

      await authApiClient.post(`/jobs/${jobId}/applications/`, payload);
      
      // 3. Update Status on Success
      setApplicationStatus(true);
      // Ensure the parent state is also updated
      if (onApplySuccess) onApplySuccess(true); 
      alert('Application submitted successfully!');

    } catch (error) {
      console.error('Application failed:', error);
      
      // Extract status for better error feedback
      const status = error.response?.status;
      
      if (status === 401) {
          alert('Application failed: Authentication error. Please log in again.');
      } else if (status === 400) {
          alert('Application failed: You may have already applied, or data is missing.');
      } else {
          alert('Application failed. There was a server error.');
      }

    } finally {
      setIsApplying(false);
    }
  };

  if (applicationStatus) {
    return (
      <button 
        className="btn w-full flex items-center gap-2 bg-emerald-100 text-emerald-700 border-emerald-300"
        disabled
      >
        <FaCheck className="h-4 w-4" />
        **Applied**
      </button>
    );
  }

  // Hide button if the user is the employer/admin
  // 1. If user is NOT logged in
  if (!user) {
    return (
      <div className="text-center p-3 border border-dashed border-emerald-300 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">Only Job Seekers can apply.</p>
        <button 
          onClick={() => navigate('/login')}
          className="btn btn-sm btn-emerald-600 text-white w-full"
        >
          Login to Apply
        </button>
      </div>
    );
  }

  // 2. If user is logged in but is an employer/admin
  if (user.role === 'employer' || user.role === 'admin') {
    return (
      <div className="text-gray-500 text-center text-sm italic">
        Employer/Admin view. Application not allowed.
      </div>
    );
  }
  
  return (
    <div className="mt-auto">
      <button
        className={`btn w-full flex items-center gap-2 text-white transition duration-150 ease-in-out 
                    ${isApplying 
                      ? 'bg-emerald-400 border-emerald-400 btn-disabled' 
                      : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600'
                    }`}
        onClick={handleApply}
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
            Apply Now
          </span>
        )}
      </button>
    </div>
  );
};

export default ApplyToJobButton;