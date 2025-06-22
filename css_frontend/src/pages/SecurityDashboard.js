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
} from "react-icons/fa"; // Using Fa icons as per original code

import "../styles/SecurityDashboard.css"; // Import the dedicated CSS file

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Security");
  const [activePath, setActivePath] = useState("/security/dashboard"); // State to manage active link

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

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userId"); // Clear userId if stored
    navigate("/login"); // Redirect to the login page
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
          <button
            className="sidebar-menu-button"
            onClick={handleLogout} // Changed to call the new handleLogout function
          >
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

        {/* Activity Overview Section */}
        <div className="activity-overview-section">
          <h3 className="section-title">Your Activity Overview</h3>
          <div className="activity-cards-container">
            <div className="activity-card">
              <h4>Pending Incident Reports</h4>
              <p className="activity-value">1</p>
              <span className="activity-status action-required">
                ACTION REQUIRED
              </span>
            </div>
            <div className="activity-card">
              <h4>Active Visitor Entries</h4>
              <p className="activity-value">0</p>
              <span className="activity-status no-upcoming">
                NO ACTIVE ENTRIES
              </span>
            </div>
            <div className="activity-card">
              <h4>Unresolved Found Items</h4>
              <p className="activity-value">0</p>
              <span className="activity-status no-active-reports">
                NO UNRESOLVED
              </span>
            </div>
          </div>
        </div>

        {/* Community Updates / Recent Logs Section (Placeholder) */}
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
          {/* Example of another log entry if needed */}
          {/* <div className="update-card">
            <h4>Visitor Entry Logged</h4>
            <p className="update-date">June 20, 2025</p>
            <p className="update-description">John Doe entered at 10:30 AM.</p>
            <a href="#" className="read-more">Read More</a>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default SecurityDashboard;
