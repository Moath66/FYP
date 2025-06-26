"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaSearch,
  FaChartBar,
  FaHome,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

import "../styles/StaffDashboard.css";
// ✅ Import maintenance API
import { getAllMaintenance } from "../api/maintenanceApis";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Staff");
  const [activePath, setActivePath] = useState("/staff/dashboard");

  // ✅ State for activity counts
  const [activityCounts, setActivityCounts] = useState({
    pendingMaintenanceRequests: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.userName) {
      setUserName(storedUser.userName);
    }
    setActivePath(window.location.pathname);

    // ✅ Load dashboard stats
    loadDashboardStats();
  }, []);

  // ✅ Function to load real data from maintenance API
  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true);

      // Fetch all maintenance requests and count pending ones
      const allMaintenanceRequests = await getAllMaintenance();
      const pendingMaintenanceRequests = allMaintenanceRequests.filter(
        (request) => request.status === "Pending"
      ).length;

      setActivityCounts({
        pendingMaintenanceRequests,
      });

      console.log("✅ Staff dashboard stats loaded:", {
        pendingMaintenanceRequests,
      });
    } catch (error) {
      console.error("❌ Failed to load staff dashboard stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const mainItems = [
    {
      title: "Dashboard",
      url: "/staff/dashboard",
      icon: FaHome,
    },
    {
      title: "Manage Profile",
      url: "/staff/profile",
      icon: FaUserEdit,
    },
  ];

  const quickActions = [
    {
      title: "Report Found Item",
      url: "/report-found-item",
      icon: FaSearch,
    },
    {
      title: "Analyze Maintenance",
      url: "/analyze-maintenance",
      icon: FaChartBar,
    },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo-badge">CSS</span>
          <span className="sidebar-panel-text">Staff Panel</span>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {mainItems.map((item) => (
              <li key={item.title}>
                <button
                  className={`sidebar-menu-button ${
                    activePath === item.url ? "active" : ""
                  }`}
                  onClick={() => handleNavigation(item.url)}
                >
                  <item.icon className="sidebar-menu-icon" />
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>

          <h4 className="sidebar-group-label">Quick Actions</h4>
          <ul className="sidebar-menu">
            {quickActions.map((item) => (
              <li key={item.title}>
                <button
                  className={`sidebar-menu-button ${
                    activePath === item.url ? "active" : ""
                  }`}
                  onClick={() => handleNavigation(item.url)}
                >
                  <item.icon className="sidebar-menu-icon" />
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-menu-button" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-menu-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>Staff Dashboard</h1>
          <p className="welcome-text">Welcome back, 👋</p>
        </header>

        {/* Welcome Section */}
        <div className="welcome-banner">
          <h2 className="welcome-title">Hello, {userName}!</h2>
          <p className="welcome-description">
            Your central hub for managing staff operations. Quickly access
            reports, analyze maintenance, and stay informed.
          </p>
        </div>

        {/* ✅ UPDATED: Activity Overview Section */}
        <div className="activity-overview-section">
          <h3 className="section-title">Your Activity Overview</h3>
          {loadingStats ? (
            <div className="loading-indicator">
              <p>Loading activity data...</p>
            </div>
          ) : (
            <div className="activity-cards-container">
              {/* ✅ TASK 1: Keep only "Pending Maintenance Requests" */}
              <div className="activity-card">
                <h4>Pending Maintenance Requests</h4>
                <p className="activity-value">
                  {activityCounts.pendingMaintenanceRequests}
                </p>
                <span
                  className={`activity-status ${
                    activityCounts.pendingMaintenanceRequests > 0
                      ? "action-required"
                      : "no-pending"
                  }`}
                >
                  <FaExclamationTriangle className="status-icon" />
                  {activityCounts.pendingMaintenanceRequests > 0
                    ? "ACTION REQUIRED"
                    : "NO PENDING REQUESTS"}
                </span>
              </div>

              {/* ✅ TASK 1: Removed "Upcoming Scheduled Tasks" and "Unresolved Found Items" */}
            </div>
          )}
        </div>

        {/* Recent Staff Logs & Updates Section */}
        <div className="community-updates-section">
          <h3 className="section-title">Recent Staff Logs & Updates</h3>
          <div className="update-card">
            <h4>Maintenance Task Completed</h4>
            <p className="update-date">June 21, 2025</p>
            <p className="update-description">
              Task #MNT-005 (HVAC check) completed by John Doe.
            </p>
            <a href="#" className="read-more">
              View Details
            </a>
          </div>
          <div className="update-card">
            <h4>New Found Item Reported</h4>
            <p className="update-date">June 20, 2025</p>
            <p className="update-description">
              A set of keys was reported found in the lobby.
            </p>
            <a href="#" className="read-more">
              View Item
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
