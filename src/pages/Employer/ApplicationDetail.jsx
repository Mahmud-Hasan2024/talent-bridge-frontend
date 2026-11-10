import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../../hooks/useAuthContext";
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
  const { user } = useAuthContext();
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

  if (loading)
    return (
      <div className="text-center py-10">Loading Applicant Details...</div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-error font-bold">{error}</div>
    );
  if (!application)
    return <div className="text-center py-10">Application not found.</div>;

  const applicant = application.applicant || {};
  const backPath =
    user?.role === "admin"
      ? "/dashboard/admin/applicants"
      : "/dashboard/employer/applicants";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-base-100 shadow-lg border border-base-300 rounded-2xl mt-4 mb-10">
      <Link to={backPath} className="btn btn-ghost mb-6 btn-sm md:btn-md">
        <FaArrowLeft className="mr-2" /> Back to Applicants
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-base-content leading-tight">
          Application & Profile
        </h1>
        <h2 className="text-base md:text-xl font-bold text-base-content/70 mt-1 pb-4 border-b border-base-300">
          Position: {application.job?.title}
          <span className="ml-2 px-3 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 rounded-full text-xs md:text-sm capitalize inline-block mt-2 sm:mt-0 font-black">
            {application.status}
          </span>
        </h2>
      </div>

      <div className="grid gap-6">
        <div className="border p-4 md:p-6 rounded-2xl bg-base-200/50 border-base-300">
          <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-emerald-600 dark:text-emerald-400">
            <FaUser className="mr-3 shrink-0" /> Applicant Profile
          </h3>
          <div className="space-y-3">
            <p className="text-base md:text-lg font-bold text-base-content">
              Name:{" "}
              <span className="font-medium text-base-content/80">
                {applicant.first_name} {applicant.last_name}
              </span>
            </p>
            <p className="text-base md:text-lg font-bold text-base-content flex flex-wrap items-baseline break-all">
              <FaEnvelope className="mr-2 text-emerald-500 shrink-0 self-center" />{" "}
              Email:
              <span className="text-emerald-600 dark:text-emerald-400 ml-1 font-medium">
                {applicant.email}
              </span>
            </p>
          </div>
        </div>

        <div className="border p-4 md:p-6 rounded-2xl bg-base-100 border-base-300 space-y-8">
          <h3 className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            Application Content
          </h3>

          <div className="border-b border-base-200 pb-6">
            <h4 className="text-lg font-bold mb-3 flex items-center text-base-content">
              <FaFileAlt className="mr-2 text-emerald-500 shrink-0" /> Resume /
              CV Text
            </h4>
            <div className="bg-base-200/60 p-4 rounded-xl whitespace-pre-wrap text-sm border border-base-300 text-base-content/80 leading-relaxed overflow-x-auto">
              {application.resume || (
                <span className="text-base-content/40 italic">
                  No Resume Text Provided.
                </span>
              )}
            </div>
          </div>

          <div className="border-b border-base-200 pb-6">
            <h4 className="text-lg font-bold mb-3 flex items-center text-base-content">
              <FaFileContract className="mr-2 text-emerald-500 shrink-0" />{" "}
              Cover Letter Text
            </h4>
            <div className="bg-base-200/60 p-4 rounded-xl whitespace-pre-wrap text-sm border border-base-300 text-base-content/80 leading-relaxed overflow-x-auto">
              {application.cover_letter || (
                <span className="text-base-content/40 italic">
                  No Cover Letter Text Provided.
                </span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3 flex items-center text-base-content">
              <FaLink className="mr-2 text-emerald-500 shrink-0" /> Portfolio /
              Website Link
            </h4>
            {application.portfolio_link ? (
              <a
                href={application.portfolio_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold break-all block p-3 bg-emerald-500/10 rounded-xl"
              >
                {application.portfolio_link}
              </a>
            ) : (
              <span className="text-base-content/40 italic">N/A</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
