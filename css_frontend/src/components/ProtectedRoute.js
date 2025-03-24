import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ requiredRole, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    console.warn("No token found, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  if (!role || role !== requiredRole) {
    console.warn(`Unauthorized role: ${role}, expected: ${requiredRole}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
