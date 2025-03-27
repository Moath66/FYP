import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageUsers from "./pages/AdminManageUsers";
import ResidentDashboard from "./pages/ResidentDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify"; // ✅ Add this line
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected Routes for Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminManageUsers />
            </ProtectedRoute>
          }
        />

        {/* ✅ Protected Routes for Other Roles */}
        <Route
          path="/resident/dashboard"
          element={
            <ProtectedRoute requiredRole="resident">
              <ResidentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security/dashboard"
          element={
            <ProtectedRoute requiredRole="security">
              <SecurityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
