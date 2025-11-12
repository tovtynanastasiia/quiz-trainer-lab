import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    // Зберігаємо поточну локацію для редіректу після входу
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

