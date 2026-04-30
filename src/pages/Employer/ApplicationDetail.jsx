import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"; 
import authApiClient from "../../services/auth-api-client";
import { FaUser, FaEnvelope, FaFileAlt, FaLink, FaArrowLeft, FaFileContract } from "react-icons/fa";

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await authApiClient.get(`/applications/${applicationId}/`);
        setApplication(res.data);
      } catch (err) {
        setError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [applicationId]);

  if (loading) return <div className="text-center py-10">Loading Applicant Details...</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-bold">{error}</div>;
  if (!application) return <div className="text-center py-10">Application not found.</div>;

  const applicant = application.applicant;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-xl rounded-xl mt-6 md:mt-10 mb-10">
      <Link to="/Dashboard/applicants" className="btn btn-ghost mb-6 btn-sm md:btn-md">
        <FaArrowLeft className="mr-2" /> Back to Applicants
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">Application & Profile</h1>
        <h2 className="text-base md:text-xl font-bold text-slate-600 mt-1 pb-4 border-b">
          Position: {application.job?.title} 
          <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs md:text-sm capitalize inline-block mt-2 sm:mt-0 font-black">
            {application.status}
          </span>
        </h2>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="border p-4 md:p-6 rounded-2xl bg-slate-50 border-slate-100 overflow-hidden">
          <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-green-700">
            <FaUser className="mr-3 shrink-0" /> Applicant Profile
          </h3>
          <div className="space-y-3">
            <p className="text-base md:text-lg font-bold text-slate-800">
              Name: <span className="font-medium text-slate-700">{applicant.first_name} {applicant.last_name}</span>
            </p>
            <p className="text-base md:text-lg font-bold text-slate-800 flex flex-wrap items-baseline break-all">
              <FaEnvelope className="mr-2 text-slate-400 shrink-0 self-center" /> Email:
              <span className="text-blue-600 ml-1 font-medium"> {applicant.email}</span>
            </p>
          </div>
        </div>

        {/* Documents Card */}
        <div className="border p-4 md:p-6 rounded-2xl bg-white border-slate-200 space-y-8">
          <h3 className="text-xl md:text-2xl font-black text-green-700">Application Content</h3>

          <div className="border-b border-slate-100 pb-6">
            <h4 className="text-lg md:text-xl font-bold mb-3 flex items-center text-slate-800">
              <FaFileAlt className="mr-2 text-green-600 shrink-0" /> Resume / CV Text
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl whitespace-pre-wrap text-sm border border-slate-100 text-slate-700 leading-relaxed overflow-x-auto">
              {application.resume || <span className="text-slate-400 italic">No Resume Text Provided.</span>}
            </div>
          </div>

          <div className="border-b border-slate-100 pb-6">
            <h4 className="text-lg md:text-xl font-bold mb-3 flex items-center text-slate-800">
              <FaFileContract className="mr-2 text-green-600 shrink-0" /> Cover Letter Text
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl whitespace-pre-wrap text-sm border border-slate-100 text-slate-700 leading-relaxed overflow-x-auto">
              {application.cover_letter || <span className="text-slate-400 italic">No Cover Letter Text Provided.</span>}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg md:text-xl font-bold mb-3 flex items-center text-slate-800">
              <FaLink className="mr-2 text-green-600 shrink-0" /> Portfolio / Website Link
            </h4>
            {application.portfolio_link ? (
              <a href={application.portfolio_link} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline font-bold break-all block p-2 bg-blue-50 rounded-lg">
                {application.portfolio_link}
              </a>
            ) : (
              <span className="text-slate-400 italic">N/A</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;