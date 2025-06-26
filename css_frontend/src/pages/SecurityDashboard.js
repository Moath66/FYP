"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaSearch,
  FaFolderOpen,
  FaEye,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/SecurityDashboard.css";
// ✅ Import API functions
import { fetchAllItems } from "../api/itemApi";
import { fetchAllVisitorsForSecurity } from "../api/visitorApis";

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Security");
  const [activePath, setActivePath] = useState("/security/dashboard");

  // ✅ State for activity counts
  const [activityCounts, setActivityCounts] = useState({
    pendingItems: 0,
    activeVisitorEntries: 0,
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

  // ✅ Function to load real data from APIs
  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true);

      // Fetch all items and count pending ones
      const allItems = await fetchAllItems();
      const pendingItems = allItems.filter(
        (item) => item.status === "unclaimed" || item.status === "found"
      ).length;

      // Fetch all visitors and count active entries (approved status)
      const allVisitors = await fetchAllVisitorsForSecurity();
      const activeVisitorEntries = allVisitors.filter(
        (visitor) => visitor.status === "approved"
      ).length;

      setActivityCounts({
        pendingItems,
        activeVisitorEntries,
      });

      console.log("✅ Dashboard stats loaded:", {
        pendingItems,
        activeVisitorEntries,
      });
    } catch (error) {
      console.error("❌ Failed to load dashboard stats:", error);
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
      url: "/security/dashboard",
      icon: FaHome,
    },
    {
      title: "Manage Profile",
      url: "/security/profile",
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
      title: "Handle Items",
      url: "/handle-items",
      icon: FaFolderOpen,
    },
    {
      title: "Check Visitor",
      url: "/check-visitor",
      icon: FaEye,
    },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo-badge">CSS</span>
          <span className="sidebar-panel-text">Security Panel</span>
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
          <h1>Security Dashboard</h1>
          <p className="welcome-text">Welcome back, 👋</p>
        </header>

        {/* Welcome Section */}
        <div className="welcome-banner">
          <h2 className="welcome-title">Hello, {userName}!</h2>
          <p className="welcome-description">
            Your central hub for managing security operations. Quickly access
            reports, handle items, and monitor visitors.
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
              {/* ✅ TASK 1.1: Changed "Unresolved Found Items" to "Pending Items" */}
              <div className="activity-card">
                <h4>Pending Items</h4>
                <p className="activity-value">{activityCounts.pendingItems}</p>
                <span
                  className={`activity-status ${
                    activityCounts.pendingItems > 0
                      ? "action-required"
                      : "no-active-reports"
                  }`}
                >
                  {activityCounts.pendingItems > 0
                    ? "ACTION REQUIRED"
                    : "NO PENDING"}
                </span>
              </div>

              {/* ✅ TASK 1.2: Keep "Active Visitor Entries" */}
              <div className="activity-card">
                <h4>Active Visitor Entries</h4>
                <p className="activity-value">
                  {activityCounts.activeVisitorEntries}
                </p>
                <span
                  className={`activity-status ${
                    activityCounts.activeVisitorEntries > 0
                      ? "action-required"
                      : "no-upcoming"
                  }`}
                >
                  {activityCounts.activeVisitorEntries > 0
                    ? "ACTIVE ENTRIES"
                    : "NO ACTIVE ENTRIES"}
                </span>
              </div>

              {/* ✅ TASK 1.3: Deleted "Pending Incident Reports" card */}
            </div>
          )}
        </div>

        {/* Community Updates / Recent Logs Section */}
        <div className="community-updates-section">
          <h3 className="section-title">Recent Security Logs</h3>
          <div className="update-card">
            <h4>No recent security logs.</h4>
            <p className="update-date">June 21, 2025</p>
            <p className="update-description">
              All systems are operating normally.
            </p>
            <a href="#" className="read-more">
              Read More
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityDashboard;
