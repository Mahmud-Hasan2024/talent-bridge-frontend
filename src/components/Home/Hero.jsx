import useAuthContext from "../../hooks/useAuthContext";
import guestImg from "../../assets/images/guest.png";
import jobSeekerImg from "../../assets/images/job.png";
import employerImg from "../../assets/images/employer.png";
import adminImg from "../../assets/images/admin.png";
import { Link } from "react-router";

const Hero = () => {
  const { user } = useAuthContext();
  const role = user?.role?.toLowerCase() || "guest";

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
        return "Post jobs, feature listings, and discover skilled professionals ready to work with you.";
      case "seeker":
        return "Browse verified opportunities and get hired by leading companies across Bangladesh.";
      case "admin":
        return "Oversee the platform, manage users, and ensure smooth operation.";
      default:
        return "Discover top job opportunities and connect with leading companies.";
    }
  };

  return (
    <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 text-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left md:flex md:items-center md:justify-between gap-12">
        <div className="md:w-1/2 space-y-6">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-lime-300 text-xs font-bold uppercase tracking-wider">
            #1 Career Portal in Bangladesh
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            {getTitle()}
          </h1>
          <p className="text-lg text-emerald-100/90 max-w-xl">
            {getSubtitle()}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            {role === "employer" && (
              <>
                <Link
                  to="/dashboard"
                  className="btn bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold border-none rounded-xl px-6"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/dashboard/employer/post-job"
                  className="btn bg-white hover:bg-gray-100 text-emerald-800 font-bold border-none rounded-xl px-6"
                >
                  Post a Job
                </Link>
              </>
            )}
            {role === "seeker" && (
              <>
                <Link
                  to="/dashboard"
                  className="btn bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold border-none rounded-xl px-6"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/jobs"
                  className="btn bg-white hover:bg-gray-100 text-emerald-800 font-bold border-none rounded-xl px-6"
                >
                  Find Jobs
                </Link>
              </>
            )}
            {role === "admin" && (
              <Link
                to="/dashboard"
                className="btn bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold border-none rounded-xl px-6"
              >
                Go to Dashboard
              </Link>
            )}
            {role === "guest" && (
              <>
                <Link
                  to="/jobs"
                  className="btn bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold border-none rounded-xl px-6"
                >
                  Explore Jobs
                </Link>
                <Link
                  to="/login"
                  className="btn bg-white hover:bg-gray-100 text-emerald-800 font-bold border-none rounded-xl px-6"
                >
                  Post a Job
                </Link>
              </>
            )}
          </div>
        </div>

        <img
          src={heroImage}
          alt="Hero illustration"
          className="hidden md:block w-2/5 max-w-md drop-shadow-2xl"
        />
      </div>
    </section>
  );
};

export default Hero;
