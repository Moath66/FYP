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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import ManageProfilePage from "./pages/ManageProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ReportLostItem from "./pages/ReportLostItem";
import ReportFoundItem from "./pages/ReportFoundItem";
import PreVisitorRegis from "./pages/PreVisitorRegis";
import RequestMaintenance from "./pages/RequestMaintenance";
import TrackingItemApp from "./pages/TrackingItemApp";
import TrackingMaintenanceApp from "./pages/TrackingMaintenanceApp";
import TrackingVisitorApp from "./pages/TrackingVisitorApp";
import SecurityHandleItems from "./pages/SecurityHandleItems";
import SecurityCheckVisitor from "./pages/SecurityCheckVisitor";
import AnalyzeMaintenance from "./pages/AnalyzeMaintenance";
import QRCodeScanPage from "./components/QRCodeScanPage"; // ✅ New page import

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
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

        {/* Dashboards */}
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

        {/* Manage Profile */}
        <Route
          path="/resident/profile"
          element={
            <ProtectedRoute requiredRole="resident">
              <ManageProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/profile"
          element={
            <ProtectedRoute requiredRole="staff">
              <ManageProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security/profile"
          element={
            <ProtectedRoute requiredRole="security">
              <ManageProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Resident Actions */}
        <Route
          path="/report-lost-item"
          element={
            <ProtectedRoute requiredRole="resident">
              <ReportLostItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-found-item"
          element={
            <ProtectedRoute requiredRole={["resident", "staff", "security"]}>
              <ReportFoundItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pre-register-visitor"
          element={
            <ProtectedRoute requiredRole="resident">
              <PreVisitorRegis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-maintenance"
          element={
            <ProtectedRoute requiredRole="resident">
              <RequestMaintenance />
            </ProtectedRoute>
          }
        />

        {/* Tracking Pages */}
        <Route
          path="/track-item"
          element={
            <ProtectedRoute requiredRole="resident">
              <TrackingItemApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-maintenance"
          element={
            <ProtectedRoute requiredRole="resident">
              <TrackingMaintenanceApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-visitor"
          element={
            <ProtectedRoute requiredRole="resident">
              <TrackingVisitorApp />
            </ProtectedRoute>
          }
        />

        {/* Security. */}
        <Route
          path="/handle-items"
          element={
            <ProtectedRoute requiredRole="security">
              <SecurityHandleItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-visitor"
          element={
            <ProtectedRoute requiredRole="security">
              <SecurityCheckVisitor />
            </ProtectedRoute>
          }
        />

        {/* Staff */}
        <Route
          path="/analyze-maintenance"
          element={
            <ProtectedRoute requiredRole="staff">
              <AnalyzeMaintenance />
            </ProtectedRoute>
          }
        />

        {/* ✅ Public Scan QR Code Page */}
        <Route path="/scan" element={<QRCodeScanPage />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
