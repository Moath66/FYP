import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
