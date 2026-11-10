import useAuthContext from "../../hooks/useAuthContext";

const Features = () => {
  const { user } = useAuthContext();
  const role = user?.role?.toLowerCase() || "guest";

  const featuresByRole = {
    guest: [
      {
        title: "Explore Opportunities",
        description:
          "Browse verified job listings and learn about companies hiring near you.",
        icon: "🌐",
      },
      {
        title: "Post Jobs Easily",
        description:
          "Employers can share open roles and feature listings in just a few clicks.",
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
        description:
          "Get personalized job suggestions tailored to your profile.",
        icon: "🎯",
      },
      {
        title: "One-Click Applications",
        description:
          "Apply to multiple jobs quickly with your resume and portfolio.",
        icon: "⚡",
      },
      {
        title: "Track Application Status",
        description:
          "Monitor all your job applications from pending to offered.",
        icon: "📊",
      },
    ],
    employer: [
      {
        title: "Post & Manage Jobs",
        description:
          "Easily publish job openings and manage applicants in one place.",
        icon: "🧾",
      },
      {
        title: "Feature Your Listings",
        description:
          "Boost visibility with SSLCommerz instant featured job promotion.",
        icon: "🌟",
      },
      {
        title: "Company Branding",
        description:
          "Showcase your culture and collect verified employee reviews.",
        icon: "🏢",
      },
    ],
    admin: [
      {
        title: "Manage Users & Roles",
        description: "Control access and oversee all accounts efficiently.",
        icon: "⚙️",
      },
      {
        title: "Monitor Analytics",
        description: "Track platform performance, activity, and growth.",
        icon: "📈",
      },
      {
        title: "Platform Security",
        description: "Maintain security, categories, and compliance.",
        icon: "🛡️",
      },
    ],
  };

  const features = featuresByRole[role] || featuresByRole.guest;

  return (
    <section className="bg-base-200 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-10">
          {role === "employer"
            ? "Powerful Tools for Employers"
            : role === "seeker"
              ? "Everything You Need to Get Hired"
              : role === "admin"
                ? "Admin Tools for Total Control"
                : "Why Choose Talent Bridge?"}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-base-100 border border-base-300 shadow-sm hover:shadow-xl rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-emerald-600 dark:text-emerald-400">
                {feature.title}
              </h3>
              <p className="text-base-content/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
