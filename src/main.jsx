import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
