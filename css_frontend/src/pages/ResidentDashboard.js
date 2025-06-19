"use client";
import { useNavigate } from "react-router-dom";
import ResidentSidebar from "../components/ResidentSidebar"; // Import the new sidebar
import "../styles/ResidentDashboard.css"; // Ensure this path is correct

const ResidentDashboard = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.userName || "Resident";

  const quickActions = [
    {
      title: "Report Lost Item",
      description: "Easily submit a report for any lost belongings.",
      path: "/report-lost-item",
    },
    {
      title: "Report Found Item",
      description: "Help others by reporting items you've found.",
      path: "/report-found-item",
    },
    {
      title: "Pre-Register a Visitor",
      description: "Streamline visitor entry by pre-registering guests.",
      path: "/pre-register-visitor",
    },
    {
      title: "Request Maintenance",
      description: "Submit a new request for property maintenance.",
      path: "/request-maintenance",
    },
  ];

  const trackingApplications = [
    {
      title: "Track Item Applications",
      description: "View the current status of your lost/found item reports.",
      path: "/track-item",
      status: "2 Pending, 1 Resolved", // Example status
    },
    {
      title: "Track Maintenance Requests",
      description: "Check the progress of your submitted maintenance requests.",
      path: "/track-maintenance",
      status: "1 In Progress", // Example status
    },
    {
      title: "Track Visitor Registrations",
      description:
        "Follow up on the approval status of your visitor registrations.",
      path: "/track-visitor",
      status: "All Approved", // Example status
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

        <section className="dashboard-section">
          <h3>Quick Actions</h3>
          <div className="action-cards-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="action-card-simple"
                onClick={() => navigate(action.path)}
              >
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section" style={{ marginTop: "2rem" }}>
          <h3>Tracking Applications</h3>
          <div className="action-cards-grid">
            {trackingApplications.map((app, index) => (
              <div
                key={index}
                className="action-card-status"
                onClick={() => navigate(app.path)}
              >
                <h4>{app.title}</h4>
                <p>{app.description}</p>
                {app.status && <div className="status-badge">{app.status}</div>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResidentDashboard;
