import useAuthContext from "../../hooks/useAuthContext";
import guestImg from "../../assets/images/guest.png";
import jobSeekerImg from "../../assets/images/job.png";
import employerImg from "../../assets/images/employer.png";
import adminImg from "../../assets/images/admin.png";
import { Link } from "react-router";

const Hero = () => {
  const { user } = useAuthContext();

  // Temporary mock role for development
  // const [role, setRole] = useState("guest"); // guest | job_seeker | employer | admin

  const role = user?.role || "guest";

  const roleImages = {
    guest: guestImg,
    seeker: jobSeekerImg,
    employer: employerImg,
    admin: adminImg,
  };

  const heroImage = roleImages[role] || guestImg;

  const getTitle = () => {
    switch (role) {
      case "employer":
        return (
          <>
            Hire Top Talent with{" "}
            <span className="text-lime-300">Talent Bridge</span>
          </>
        );
      case "seeker":
        return (
          <>
            Find Your Dream Job with{" "}
            <span className="text-lime-300">Talent Bridge</span>
          </>
        );
      case "admin":
        return (
          <>
            Manage the Platform with{" "}
            <span className="text-lime-300">Talent Bridge</span>
          </>
        );
      default:
        return (
          <>
            Build Your Career with{" "}
            <span className="text-lime-300">Talent Bridge</span>
          </>
        );
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case "employer":
        return "Post jobs and discover skilled professionals ready to work with you.";
      case "seeker":
        return "Browse top opportunities and get hired by leading companies.";
      case "admin":
        return "Oversee the platform, manage users, and ensure smooth operation.";
      default:
        return "Discover top job opportunities and connect with leading companies.";
    }
  };

  return (
    <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
      <div className="container mx-auto px-6 text-center md:text-left md:flex md:items-center md:justify-between">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            {getTitle()}
          </h1>
          <p className="text-lg text-emerald-100 mb-8">{getSubtitle()}</p>

          <div className="space-x-4">
            {role === "employer" && (
              <Link
                to="/Dashboard/employer/post-job"
                className="px-6 py-2 rounded-lg font-semibold bg-white hover:bg-gray-100 text-emerald-700 transition"
              >
                Post a Job
              </Link>
            )}
            {role === "seeker" && (
              <Link
                to="/jobs"
                className="px-6 py-2 rounded-lg font-semibold bg-lime-400 hover:bg-lime-500 text-gray-900 transition"
              >
                Find Jobs
              </Link>
            )}
            {role === "admin" && (
              <Link
                to="/Dashboard"
                className="px-6 py-2 rounded-lg font-semibold bg-lime-400 hover:bg-lime-500 text-gray-900 transition"
              >
                Go to Dashboard
              </Link>
            )}
            {role === "guest" && (
              <>
                <Link
                  to="/jobs"
                  className="px-6 py-2 rounded-lg font-semibold bg-lime-400 hover:bg-lime-500 text-gray-900 transition"
                >
                  Find Jobs
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-lg font-semibold bg-white hover:bg-gray-100 text-emerald-700 transition"
                >
                  Post a Job
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Test Role Switcher */}
        {/* <div className="mt-8">
            <label className="block text-sm text-emerald-200 mb-2">Simulate Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="text-gray-800 px-4 py-2 rounded"
            >
              <option value="guest">Guest</option>
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}
          
        {/* Hero Image */}
        <img src={heroImage} alt="Hero" className="hidden md:block w-1/3" />
      </div>
    </section>
  );
};

export default Hero;
