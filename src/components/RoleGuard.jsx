import { Navigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const RoleGuard = ({ allowedRoles, children }) => {
  const { user, loadingAuth } = useAuthContext();

  if (loadingAuth) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const role = user.role?.toLowerCase();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleGuard;
