"use client";
import { useNavigate } from "react-router-dom";
import ResidentSidebar from "../components/ResidentSidebar"; // Import the new sidebar
import "../styles/ResidentDashboard.css"; // Ensure this path is correct

const ResidentDashboard = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.userName || "Resident";
  const userEmail = storedUser?.email || "resident@example.com"; // Assuming email is available

  // Placeholder data for activity counts
  const activityCounts = {
    pendingMaintenance: 2,
    upcomingVisitors: 1,
    activeLostFound: 0,
  };

  return (
    <div className="dashboard-layout">
      <ResidentSidebar /> {/* Render the new sidebar */}
      <main className="dashboard-main-content">
        <header className="main-content-header">
          <h2>Resident Dashboard</h2>
          <p>Welcome back, {userName}! 👋</p>
        </header>

        {/* New: Welcome Card */}
        <section className="dashboard-section welcome-card">
          <div className="welcome-content">
            <h3>Hello, {userName}!</h3>
            <p>
              Your central hub for managing community services. Quickly access
              your requests, track applications, and stay informed.
            </p>
            <button
              className="welcome-button"
              onClick={() => navigate("/resident/profile")}
            >
              Manage Your Profile
            </button>
          </div>
          <div className="welcome-illustration">
            {/* Placeholder for an illustration or dynamic content */}
            <img
              src="/placeholder.svg?height=150&width=150"
              alt="Welcome illustration"
              className="welcome-img"
            />
          </div>
        </section>

        {/* New: Your Activity Overview */}
        <section className="dashboard-section activity-overview">
          <h3>Your Activity Overview</h3>
          <div className="activity-cards-grid">
            <div className="activity-card">
              <h4>Pending Maintenance Requests</h4>
              <p className="activity-count">
                {activityCounts.pendingMaintenance}
              </p>
              <span className="activity-status">Action Required</span>
            </div>
            <div className="activity-card">
              <h4>Upcoming Visitors</h4>
              <p className="activity-count">
                {activityCounts.upcomingVisitors}
              </p>
              <span className="activity-status">Scheduled</span>
            </div>
            <div className="activity-card">
              <h4>Active Lost & Found Reports</h4>
              <p className="activity-count">{activityCounts.activeLostFound}</p>
              <span className="activity-status">No Active Reports</span>
            </div>
          </div>
        </section>

        {/* New: Community Updates (Placeholder) */}
        <section className="dashboard-section community-updates">
          <h3>Community Updates</h3>
          <div className="update-item">
            <h4>Notice: Annual Building Maintenance</h4>
            <p className="update-date">June 15, 2025</p>
            <p>
              Scheduled maintenance will occur from June 20-25. Expect minor
              disruptions.
            </p>
            <a href="#" className="read-more-link">
              Read More
            </a>
          </div>
          <div className="update-item">
            <h4>Reminder: Community Event - Summer BBQ</h4>
            <p className="update-date">June 10, 2025</p>
            <p>
              Join us for our annual Summer BBQ on July 1st at the main park.
              RSVP by June 25th!
            </p>
            <a href="#" className="read-more-link">
              Read More
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResidentDashboard;
