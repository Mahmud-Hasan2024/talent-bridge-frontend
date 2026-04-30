import { Route, Routes } from "react-router";

// Public Pages
import About from "../pages/About";
import Contact from "../pages/Contact";
import TermsOfService from "../pages/TermsOfService";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth & Role
import PrivateRoute from "../components/PrivateRoute";
import RoleGuard from "../components/RoleGuard";

// Public Pages
import Home from "../pages/Home";
import Job from "../pages/Job";
import CategoryPage from "../JobBoard/CategoryPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ActivateAccount from "../components/Registration/ActivateAccount";
import Unauthorized from "../pages/Unauthorized";
import JobDetails from "../pages/JobDetails";

// Dashboard Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile";

// Seeker
import MyApplications from "../pages/Seeker/MyApplications";
import ApplicationStatus from "../pages/Seeker/ApplicationStatus";

// Employer
import MyJobs from "../pages/Employer/MyJobs";
import Applicants from "../pages/Employer/Applicants";
import ApplicationDetail from "../pages/Employer/ApplicationDetail";
import JobForm from "../pages/Employer/JobForm";

// Admin
import ManageJobs from "../pages/Admin/ManageJobs";
import CategoryManager from "../pages/Admin/CategoryManager";
import ManageUsers from "../pages/Admin/ManageUsers";
import AllApplicants from "../pages/Admin/AllApplicants";
import AllJobs from "../pages/Admin/AllJobs";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="jobs" element={<Job />} />
        <Route path="job-categories" element={<CategoryPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="activate/:uid/:token" element={<ActivateAccount />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="jobs/:jobId" element={<JobDetails />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        path="dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* Common routes */}
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        {/* Seeker-only */}
        <Route
            path="jobs"
            element={
              <RoleGuard allowedRoles={["seeker"]}>
                <Job />
              </RoleGuard>
            }
          />
        <Route
          path="admin/all-jobs"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <AllJobs />
            </RoleGuard>
          }
        />
          <Route
            path="job-categories"
            element={
              <RoleGuard allowedRoles={["seeker"]}>
                <CategoryPage />
              </RoleGuard>
            }
          />
        {/* <Route
          path="seeker/my-applications"
          element={
            <RoleGuard allowedRoles={["seeker"]}>
              <MyApplications />
            </RoleGuard>
          }
        /> */}
        <Route
          path="seeker/applications-status"
          element={
            <RoleGuard allowedRoles={["seeker"]}>
              <ApplicationStatus />
            </RoleGuard>
          }
        />

        {/* Employer-only */}
        <Route
          path="employer/jobs"
          element={
            <RoleGuard allowedRoles={["employer"]}>
              <ManageJobs />
            </RoleGuard>
          }
        />
        <Route
          path="employer/my-jobs"
          element={
            <RoleGuard allowedRoles={["employer"]}>
              <MyJobs />
            </RoleGuard>
          }
        />
        <Route
          path="employer/post-job"
          element={
            <RoleGuard allowedRoles={["employer"]}>
              <JobForm isEdit={false} />
            </RoleGuard>
          }
        />
        <Route
          path="employer/jobs/:jobId/edit"
          element={
            <RoleGuard allowedRoles={["employer"]}>
              <JobForm isEdit={true} />
            </RoleGuard>
          }
        />
        <Route
          path="employer/applicants"
          element={
            <RoleGuard allowedRoles={["employer"]}>
              <Applicants />
            </RoleGuard>
          }
        />
        <Route
          path="applications/:applicationId"
          element={
            <RoleGuard allowedRoles={["employer", "admin"]}>
              <ApplicationDetail />
            </RoleGuard>
          }
        />

        {/* Admin-only */}
        <Route
          path="admin/jobs/:jobId/edit"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <JobForm isEdit={true} />
            </RoleGuard>
          }
        />
        <Route
          path="admin/jobs"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <ManageJobs />
            </RoleGuard>
          }
        />
        <Route
          path="admin/categories"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <CategoryManager />
            </RoleGuard>
          }
        />
        <Route
          path="admin/users"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <ManageUsers />
            </RoleGuard>
          }
        />
        <Route
          path="admin/applicants"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <AllApplicants />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
