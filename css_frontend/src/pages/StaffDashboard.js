"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaSearch,
  FaChartBar,
  FaHome,
  FaSignOutAlt,
  FaExclamationTriangle, // For pending maintenance
  FaCalendarCheck, // For upcoming events/visitors
  FaBoxOpen, // For lost & found items
} from "react-icons/fa"; // Using Fa icons

import "../styles/StaffDashboard.css"; // Import the dedicated CSS file

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Staff");
  const [activePath, setActivePath] = useState("/staff/dashboard"); // State to manage active link

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.userName) {
      setUserName(storedUser.userName);
    }
    // Set active path based on current URL
    setActivePath(window.location.pathname);
  }, []);

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
    // Add other staff-specific quick actions if needed, e.g.,
    // {
    //   title: "View Schedules",
    //   url: "/staff/schedules",
    //   icon: FaCalendarAlt,
    // },
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

        {/* Activity Overview Section */}
        <div className="activity-overview-section">
          <h3 className="section-title">Your Activity Overview</h3>
          <div className="activity-cards-container">
            <div className="activity-card">
              <h4>Pending Maintenance Requests</h4>
              <p className="activity-value">3</p>
              <span className="activity-status action-required">
                <FaExclamationTriangle className="status-icon" /> ACTION
                REQUIRED
              </span>
            </div>
            <div className="activity-card">
              <h4>Upcoming Scheduled Tasks</h4>
              <p className="activity-value">2</p>
              <span className="activity-status upcoming">
                <FaCalendarCheck className="status-icon" /> UPCOMING
              </span>
            </div>
            <div className="activity-card">
              <h4>Unresolved Found Items</h4>
              <p className="activity-value">0</p>
              <span className="activity-status no-active-reports">
                <FaBoxOpen className="status-icon" /> NO UNRESOLVED
              </span>
            </div>
          </div>
        </div>

        {/* Community Updates / Recent Logs Section (Placeholder) */}
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
