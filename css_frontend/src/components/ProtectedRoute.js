import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ requiredRole, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    console.warn("No token found, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = Array.isArray(requiredRole)
    ? requiredRole.includes(role)
    : role === requiredRole;

  if (!isAuthorized) {
    console.warn(`Unauthorized role: ${role}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
