import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"; 
import authApiClient from "../../services/auth-api-client";
import {
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaLink,
  FaArrowLeft,
  FaFileContract,
} from "react-icons/fa";

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        // Fetch the detailed application object using the Application ID
        const res = await authApiClient.get(`/applications/${applicationId}/`);
        setApplication(res.data);
      } catch (err) {
        console.error("Failed to fetch application details:", err.response?.data || err);
        setError(
          "Failed to load application details. Check permissions or application ID."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [applicationId]);

  if (loading)
    return (
      <div className="text-center py-10">Loading Applicant Details...</div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-red-600 font-bold">{error}</div>
    );
  if (!application)
    return <div className="text-center py-10">Application not found.</div>;

  const applicant = application.applicant;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mt-10">
      <Link to="/Dashboard/applicants" className="btn btn-ghost mb-6">
        <FaArrowLeft /> Back to Applicants
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-green-700">
        Application & Profile Details
      </h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-4">
        for: {application.job?.title} (Status:{" "}
        <span className="text-blue-600 capitalize">{application.status}</span>)
      </h2>

      {/* Applicant Profile Section */}
      <div className="border p-6 rounded-lg mb-8 bg-gray-50">
        <h3 className="text-2xl font-bold mb-4 flex items-center text-green-600">
          <FaUser className="mr-3" /> Applicant Profile
        </h3>
        <p className="text-lg font-medium">
          Name:{" "}
          <span className="text-gray-700">
            {applicant.first_name} {applicant.last_name}
          </span>
        </p>
        <p className="text-lg font-medium flex items-center mt-2">
          <FaEnvelope className="mr-2 text-gray-500" /> Email:
          <span className="text-blue-600 ml-1"> {applicant.email}</span>
        </p>
      </div>

      {/* Application Documents/Text Section */}
      <div className="border p-6 rounded-lg space-y-8">
        <h3 className="text-2xl font-bold mb-4 text-green-600">
          Application Content
        </h3>

        {/* 1. Resume Text */}
        <div className="border-b pb-4">
          <h4 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
            <FaFileAlt className="mr-2 text-green-600" /> Resume / CV Text
          </h4>
          <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap text-sm border border-gray-200">
            {application.resume ? (
              // 💡 CHANGE 2: Display the raw text content
              <p>{application.resume}</p> 
            ) : (
              <span className="text-gray-500 italic">No Resume Text Provided.</span>
            )}
          </div>
        </div>

        {/* 2. Cover Letter Text */}
        <div className="border-b pb-4">
          <h4 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
            <FaFileContract className="mr-2 text-green-600" /> Cover Letter Text (Optional)
          </h4>
          <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap text-sm border border-gray-200">
            {application.cover_letter ? (
              // 💡 CHANGE 3: Display the raw text content
              <p>{application.cover_letter}</p>
            ) : (
              <span className="text-gray-500 italic">No Cover Letter Text Provided.</span>
            )}
          </div>
        </div>
        
        {/* 3. Portfolio Link */}
        <div>
          <h4 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
            <FaLink className="mr-2 text-green-600" /> Portfolio / Website Link
          </h4>
          {application.portfolio_link ? (
            <a
              href={application.portfolio_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              {application.portfolio_link}
            </a>
          ) : (
            <span className="text-gray-500">N/A</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;