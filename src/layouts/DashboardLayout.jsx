import { useState } from "react";
import Navbar from "../components/Dashboard/Navbar";
import Sidebar from "../components/Dashboard/Sidebar";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="drawer lg:drawer-open bg-base-200 min-h-screen">
      <input
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={toggleSidebar}
      />
      <div className="drawer-content flex flex-col min-h-screen">
        <Navbar sidebarOpen={sidebarOpen} />
        <main className="p-4 md:p-8 bg-base-200 flex-1">
          <Outlet />
        </main>
      </div>
      <Sidebar />
    </div>
  );
};

export default DashboardLayout;
