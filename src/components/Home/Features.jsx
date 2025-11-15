import useAuthContext from "../../hooks/useAuthContext";

const Features = () => {
  const { user } = useAuthContext();

  // Temporary mock role — same idea as Hero
  // const [role, setRole] = useState("guest"); // guest | job_seeker | employer | admin

  const role = user?.role || "guest";

  const featuresByRole = {
    guest: [
      {
        title: "Explore Opportunities",
        description:
          "Browse job listings and learn about companies hiring near you.",
        icon: "🌐",
      },
      {
        title: "Post Jobs Easily",
        description: "Employers can share open roles in just a few clicks.",
        icon: "💼",
      },
      {
        title: "Secure & Transparent",
        description: "Your data and communication stay private and protected.",
        icon: "🔒",
      },
    ],
    seeker: [
      {
        title: "Smart Job Recommendations",
        description: "Get AI-powered job suggestions based on your skills.",
        icon: "🎯",
      },
      {
        title: "One-Click Applications",
        description: "Apply to multiple jobs quickly with your saved profile.",
        icon: "⚡",
      },
      {
        title: "Track Application Status",
        description: "Monitor all your job applications easily.",
        icon: "📊",
      },
    ],
    employer: [
      {
        title: "Post & Manage Jobs",
        description: "Easily publish job openings and manage applicants.",
        icon: "🧾",
      },
      {
        title: "Find Top Talent",
        description: "Use smart filters to discover qualified candidates fast.",
        icon: "🔍",
      },
      {
        title: "Company Branding",
        description: "Showcase your culture and attract the right hires.",
        icon: "🏢",
      },
    ],
    admin: [
      {
        title: "Manage Users & Roles",
        description: "Control access and manage the platform efficiently.",
        icon: "⚙️",
      },
      {
        title: "Monitor Analytics",
        description: "Track performance, activity, and growth.",
        icon: "📈",
      },
      {
        title: "Platform Security",
        description: "Maintain security and compliance.",
        icon: "🛡️",
      },
    ],
  };

  const features = featuresByRole[role];

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-extrabold text-emerald-700 mb-8">
          {role === "employer"
            ? "Powerful Tools for Employers"
            : role === "seeker"
            ? "Everything You Need to Get Hired"
            : role === "admin"
            ? "Admin Tools for Total Control"
            : "Why Choose TalentBridge?"}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-emerald-700">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Role Switcher for Testing */}
        {/* <div className="mt-10">
          <label className="block text-sm text-emerald-600 mb-2 font-medium">
            Simulate Role:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="text-gray-800 px-4 py-2 rounded border"
          >
            <option value="guest">Guest</option>
            <option value="job_seeker">Job Seeker</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
        </div> */}
      </div>
    </section>
  );
};

export default Features;
