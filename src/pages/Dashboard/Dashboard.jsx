import useDashboardData from "../../hooks/useDashboardData";
import AdminDashboard from "./AdminDashboard";
import EmployerDashboard from "./EmployerDashboard"; 
import SeekerDashboard from "./SeekerDashboard"; 
import { Navigate } from "react-router";

const Dashboard = () => {
  const { dashboardData, loading, error, user } = useDashboardData();

  if (loading) {
    return (
      // Loading screen adjusted for light background
      <div className="flex justify-center items-center h-screen bg-white"> 
        <span className="loading loading-spinner loading-lg text-green-700"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }
  
  if (!user || !dashboardData) {
      return <Navigate to="/login" replace={true} />; 
  }


  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard data={dashboardData} />;
      case "employer":
        return <EmployerDashboard data={dashboardData} />;
      case "seeker":
        return <SeekerDashboard data={dashboardData} />;
      default:
        return <div className="text-center text-gray-600 mt-8">Dashboard view is not available for your role ({user.role}).</div>;
    }
  };

  return (
    // Main background set to white
    <div className="min-h-screen bg-white"> 
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;