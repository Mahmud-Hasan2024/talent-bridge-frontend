import { useState, useEffect } from "react";
import authApiClient from "../services/auth-api-client";
import useAuthContext from "./useAuthContext";

const useDashboardData = () => {
  const { user, authTokens } = useAuthContext(); // IMPORTANT: Include authTokens
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    // 🛑 STABILIZATION FIX: Only proceed if the user object and the access token are present.
    if (!user || !user.id || !authTokens?.access) { 
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // authApiClient should automatically use authTokens.access for the header.
      const response = await authApiClient.get("/dashboard/");
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error("Dashboard data fetching failed:", err.response?.data || err);
      // Check if the error is 403 Permission Denied (common if role isn't recognized)
      if (err.response && err.response.status === 403) {
         setError("Permission denied. Check your user role configuration.");
      } else {
         setError("Failed to load dashboard data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🚦 Trigger fetch when user or user.id changes.
    // This handles the transition from loading state (user=null) to authenticated (user={...}).
    fetchDashboardData();
  }, [user?.id, authTokens?.access]);

  return { dashboardData, loading, error, fetchDashboardData, user };
};

export default useDashboardData;