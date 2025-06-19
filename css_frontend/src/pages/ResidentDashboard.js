"use client";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaClipboardList,
  FaSearch,
  FaUserPlus,
  FaTools,
  FaHistory,
  FaWrench,
  FaAddressCard,
} from "react-icons/fa";
import "../styles/ResidentDashboard.css"; // Ensure this path is correct

const ResidentDashboard = () => {
  const navigate = useNavigate();

  // Safely parse user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.userName || "Resident";

  const quickActions = [
    {
      icon: <FaClipboardList />,
      title: "Report Lost Item",
      description: "Submit a lost item report",
      path: "/report-lost-item",
    },
    {
      icon: <FaSearch />,
      title: "Report Found Item",
      description: "Submit a found item report",
      path: "/report-found-item",
    },
    {
      icon: <FaUserPlus />,
      title: "Pre-Register a Visitor",
      description: "Create a new visitor registration",
      path: "/pre-register-visitor",
    },
    {
      icon: <FaTools />,
      title: "Request Maintenance",
      description: "Submit a new maintenance request",
      path: "/request-maintenance",
    },
  ];

  const trackingActions = [
    {
      icon: <FaHistory />,
      title: "Track Item Application",
      description: "View status of lost/found items",
      path: "/track-item",
    },
    {
      icon: <FaWrench />,
      title: "Track Maintenance Application",
      description: "Check maintenance request status",
      path: "/track-maintenance",
    },
    {
      icon: <FaAddressCard />,
      title: "Track Visitor Application",
      description: "Follow up on your visitor registration",
      path: "/track-visitor",
    },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Resident Dashboard</h1>
      </header>

      <section className="dashboard-section welcome-section">
        <h2>Welcome {userName}!</h2>
        <button
          className="manage-profile-button"
          onClick={() => navigate("/resident/profile")}
        >
          <FaUserEdit className="manage-profile-icon" />
          Manage Profile
        </button>
      </section>

      <section className="dashboard-section quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="action-cards-container">
          {quickActions.map((action, index) => (
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
      </section>

      <section className="dashboard-section tracking-actions-section">
        <h3>Tracking Applications</h3>
        <div className="action-cards-container">
          {trackingActions.map((action, index) => (
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
      </section>
    </div>
  );
};

export default ResidentDashboard;
