import React from "react";
import "../styles/StaffDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSearch, FaChartBar } from "react-icons/fa";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.userName || "Staff";

  const actions = [
    {
      icon: <FaSearch />,
      title: "Report Found Item",
      description: "Submit a found item report",
      path: "/report-found-item",
    },
    {
      icon: <FaChartBar />,
      title: "Analyze Maintenance",
      description: "View maintenance insights and reports",
      path: "/analyze-maintenance",
    },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Staff Dashboard</h1>
      </header>

      <div className="dashboard-section">
        <h2>Welcome {userName}</h2>
        <p>You can manage your account using the button below.</p>

        <button
          className="manage-profile-button"
          onClick={() => navigate("/staff/profile")}
        >
          <FaUserEdit className="manage-profile-icon" />
          Manage Profile
        </button>
      </div>

      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="action-cards-container">
          {actions.map((action, index) => (
            <div
              key={index}
              className="action-card"
              onClick={() => navigate(action.path)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
