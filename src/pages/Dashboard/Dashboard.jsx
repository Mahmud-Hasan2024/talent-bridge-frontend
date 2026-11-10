import useDashboardData from "../../hooks/useDashboardData";
import AdminDashboard from "./AdminDashboard";
import EmployerDashboard from "./EmployerDashboard";
import SeekerDashboard from "./SeekerDashboard";
import { Navigate } from "react-router";

const Dashboard = () => {
  const { dashboardData, loading, error, user } = useDashboardData();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-error mt-8 font-bold">{error}</div>;
  }

  if (!user || !dashboardData) {
    return <Navigate to="/login" replace={true} />;
  }

  const renderDashboard = () => {
    switch (user.role?.toLowerCase()) {
      case "admin":
        return <AdminDashboard data={dashboardData} />;
      case "employer":
        return <EmployerDashboard data={dashboardData} />;
      case "seeker":
        return <SeekerDashboard data={dashboardData} />;
      default:
        return (
          <div className="text-center text-base-content/60 mt-8">
            Dashboard view is not available for your role ({user.role}).
          </div>
        );
    }
  };

  return <div className="min-h-screen">{renderDashboard()}</div>;
};

export default Dashboard;
