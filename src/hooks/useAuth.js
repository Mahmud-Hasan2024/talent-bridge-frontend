import { useEffect, useState, createContext } from "react";
import apiClient from "../services/api-client";

export const AuthContext = createContext(null);

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);

  const getToken = () => {
    const token = localStorage.getItem("authTokens");
    return token ? JSON.parse(token) : null;
  };

  const [authTokens, setAuthTokens] = useState(getToken());


  useEffect(() => {
    const checkUserAuth = async () => {
      if (authTokens) {
        await fetchUserProfile();
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    };

    setLoadingAuth(true); 
    checkUserAuth();

  }, [authTokens]); 

  const handleAPIError = (
    error,
    defaultMessage = "Something Went Wrong! Try Again"
  ) => {
    console.error("API Error:", error);

    if (error.response && error.response.data) {
      const errorMessage =
        error.response.data?.detail ||
        Object.values(error.response.data).flat().join("\n") ||
        defaultMessage;
      setErrorMsg(errorMessage);
      return { success: false, message: errorMessage };
    }
    setErrorMsg(defaultMessage);
    return {
      success: false,
      message: defaultMessage,
    };
  };

  const fetchUserProfile = async () => {
    if (!authTokens?.access) {
      setUser(null);
      setLoadingAuth(false);
      return;
    }

    try {
      const response = await apiClient.get("/auth/users/me/", {
        headers: { Authorization: `JWT ${authTokens.access}` },
      });
      setUser(response.data);
    } catch (error) {
      console.log("Error Fetching user", error);
      setUser(null);
      setAuthTokens(null);
      localStorage.removeItem("authTokens");
      localStorage.removeItem("cartId");
      if (error.response?.status === 401 || error.response?.status === 403) {
          setErrorMsg("Session expired. Please log in again.");
      }
    } finally {
      setLoadingAuth(false); 
    }
  };

  // Update User Profile
  const updateUserProfile = async (data) => {
    setErrorMsg("");
    try {
      const response = await apiClient.put("/auth/users/me/", data, {
        headers: {
          Authorization: `JWT ${authTokens?.access}`,
        },
      });
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return handleAPIError(error);
    }
  };

  // Password Change
  const changePassword = async (data) => {
    setErrorMsg("");
    try {
      await apiClient.post("/auth/users/set_password/", data, {
        headers: {
          Authorization: `JWT ${authTokens?.access}`,
        },
      });
      return { success: true, message: "Password changed successfully." };
    } catch (error) {
      return handleAPIError(error);
    }
  };

  const loginUser = async (userData) => {
    setErrorMsg("");
    try {
      const response = await apiClient.post("/auth/jwt/create/", userData);
      const newAuthTokens = response.data;
      setAuthTokens(newAuthTokens);
      localStorage.setItem("authTokens", JSON.stringify(newAuthTokens));
      
      return { success: true };
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || "Login failed. Please check credentials.");
      return { success: false };
    }
  };

  // Register User
  const registerUser = async (userData) => {
    setErrorMsg("");
    try {
      await apiClient.post("/auth/users/", userData);
      return {
        success: true,
        message:
          "Registration successful. Check your email to activate your account.",
      };
    } catch (error) {
      return handleAPIError(error, "Registration Failed! Try Again");
    }
  };

  // Logout User
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("cartId");
    setErrorMsg("");
  };

  return {
    user,
    loadingAuth,
    errorMsg,
    authTokens,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    changePassword,
  };
};

export default useAuth;
