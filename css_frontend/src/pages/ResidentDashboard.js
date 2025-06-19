"use client";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaSearch,
  FaUserPlus,
  FaTools,
  FaHistory,
  FaWrench,
  FaAddressCard,
} from "react-icons/fa";
import ResidentSidebar from "../components/ResidentSidebar"; // Import the new sidebar
import "../styles/ResidentDashboard.css"; // Ensure this path is correct

const ResidentDashboard = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.userName || "Resident";

  const quickActions = [
    {
      icon: <FaClipboardList />,
      title: "Report Lost Item",
      description: "Submit a lost item report",
      path: "/report-lost-item",
      iconBg: "#e8f0fe", // Light blue
      iconColor: "#4285f4", // Blue
    },
    {
      icon: <FaSearch />,
      title: "Report Found Item",
      description: "Submit a found item report",
      path: "/report-found-item",
      iconBg: "#e6f4ea", // Light green
      iconColor: "#34a853", // Green
    },
    {
      icon: <FaUserPlus />,
      title: "Pre-Register a Visitor",
      description: "Create a new visitor registration",
      path: "/pre-register-visitor",
      iconBg: "#fcefe3", // Light orange
      iconColor: "#fbbc05", // Orange
    },
    {
      icon: <FaTools />,
      title: "Request Maintenance",
      description: "Submit a new maintenance request",
      path: "/request-maintenance",
      iconBg: "#fde2e2", // Light red
      iconColor: "#ea4335", // Red
    },
  ];

  const trackingActions = [
    {
      icon: <FaHistory />,
      title: "Track Item Application",
      description: "View status of lost/found items",
      path: "/track-item",
      iconBg: "#e8f0fe",
      iconColor: "#4285f4",
    },
    {
      icon: <FaWrench />,
      title: "Track Maintenance Application",
      description: "Check maintenance request status",
      path: "/track-maintenance",
      iconBg: "#e6f4ea",
      iconColor: "#34a853",
    },
    {
      icon: <FaAddressCard />,
      title: "Track Visitor Application",
      description: "Follow up on your visitor registration",
      path: "/track-visitor",
      iconBg: "#fcefe3",
      iconColor: "#fbbc05",
    },
  ];

  return (
    <div className="dashboard-layout">
      <ResidentSidebar /> {/* Render the new sidebar */}
      <main className="dashboard-main-content">
        <header className="main-content-header">
          <h2>Resident Dashboard</h2>
          <p>Welcome back, {userName}! 👋</p>
        </header>

        <section className="stats-overview">
          {/* Reusing the stat-card class for quick actions */}
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="stat-card"
              onClick={() => navigate(action.path)}
            >
              <div
                className="stat-card-icon"
                style={{
                  backgroundColor: action.iconBg,
                  color: action.iconColor,
                }}
              >
                {action.icon}
              </div>
              <div className="stat-card-info">
                <h3>{action.title}</h3>
                <p className="stat-description">{action.description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="stats-overview" style={{ marginTop: "2rem" }}>
          {/* Reusing the stat-card class for tracking actions */}
          {trackingActions.map((action, index) => (
            <div
              key={index}
              className="stat-card"
              onClick={() => navigate(action.path)}
            >
              <div
                className="stat-card-icon"
                style={{
                  backgroundColor: action.iconBg,
                  color: action.iconColor,
                }}
              >
                {action.icon}
              </div>
              <div className="stat-card-info">
                <h3>{action.title}</h3>
                <p className="stat-description">{action.description}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ResidentDashboard;
