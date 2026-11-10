import { TrendingUp, ShieldCheck, Briefcase, Users } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14 text-base-content">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-4">
          🌱 About Talent Bridge
        </h1>
        <p className="text-lg text-base-content/70">
          Talent Bridge is your premier job portal dedicated to connecting top
          companies with exceptional talent across Bangladesh. Our foundation is
          built on{" "}
          <strong className="text-base-content">
            innovation and reliability
          </strong>
          .
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-14">
        <div className="card bg-base-100 border border-base-300 shadow-sm p-8 rounded-2xl">
          <TrendingUp className="w-10 h-10 text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            Commitment to Growth
          </h3>
          <p className="text-base-content/70">
            We facilitate professional growth for both employers and job
            seekers, focusing on long-term career success rather than quick
            fixes.
          </p>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-sm p-8 rounded-2xl">
          <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            Trust and Transparency
          </h3>
          <p className="text-base-content/70">
            We maintain an open platform with clear communication, real
            application status tracking, and verified reviews throughout the
            hiring journey.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-8">
        Connecting Opportunity
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center">
          <Briefcase className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-300">
            For Employers
          </h3>
          <p className="text-sm text-base-content/70 mt-1">
            Access a curated pool of qualified candidates and feature urgent
            roles effortlessly.
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center">
          <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-300">
            For Job Seekers
          </h3>
          <p className="text-sm text-base-content/70 mt-1">
            Find verified job listings and take the next step in your career
            journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
