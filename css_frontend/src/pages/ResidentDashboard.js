"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResidentSidebar from "../components/ResidentSidebar";
import "../styles/ResidentDashboard.css";

// Ensure these import paths exactly match your file names (e.g., maintenanceApis.js vs maintenanceApi.js)
import { getMaintenanceByResident } from "../api/maintenanceApis";
import { getVisitorsByResident } from "../api/visitorApis";
import { fetchItemsByUser } from "../api/itemApi";

const ResidentDashboard = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.userName || "Resident";
  const userId = storedUser?._id || storedUser?.userId; // Get userId for API calls

  const [activityCounts, setActivityCounts] = useState({
    pendingMaintenance: 0,
    upcomingVisitors: 0,
    activeLostFound: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) {
        console.warn("User ID not found, cannot fetch dashboard stats.");
        setLoadingStats(false);
        return;
      }

      try {
        setLoadingStats(true);

        // Fetch Maintenance Requests
        const maintenanceRequests = await getMaintenanceByResident(userId);
        // Assuming 'pending' or 'in progress' are statuses for active requests
        // IMPORTANT: Check your backend Maintenance model and controller to ensure 'status' field is returned.
        const pendingMaintenance = maintenanceRequests.filter(
          (req) =>
            req.status &&
            (req.status.toLowerCase() === "pending" ||
              req.status.toLowerCase() === "in progress")
        ).length;
        console.log("Maintenance Requests:", maintenanceRequests);

        // Fetch Visitor Registrations
        const visitorRegistrations = await getVisitorsByResident();
        // Assuming 'pending' or 'approved' and future date for upcoming visitors
        // IMPORTANT: Check your backend Visitor model and controller to ensure 'status' and 'visitDate' fields are returned.
        const now = new Date();
        const upcomingVisitors = visitorRegistrations.filter((visitor) => {
          const visitDate = visitor.visitDate
            ? new Date(visitor.visitDate)
            : null; // Check if visitDate exists
          return (
            visitor.status &&
            (visitor.status.toLowerCase() === "pending" ||
              visitor.status.toLowerCase() === "approved") &&
            visitDate &&
            visitDate >= now
          );
        }).length;
        console.log("Visitor Registrations:", visitorRegistrations);

        // Fetch Lost & Found Items
        const lostFoundItems = await fetchItemsByUser(userId);
        // Corrected: Use "unclaimed" as per your Item model enum, not "unresolved"
        // IMPORTANT: Ensure your backend Item controller returns the 'status' field.
        const activeLostFound = lostFoundItems.filter(
          (item) =>
            item.status &&
            (item.status.toLowerCase() === "lost" ||
              item.status.toLowerCase() === "unclaimed")
        ).length;
        console.log("Lost & Found Items:", lostFoundItems);

        setActivityCounts({
          pendingMaintenance,
          upcomingVisitors,
          activeLostFound,
        });
      } catch (error) {
        console.error("Failed to fetch resident dashboard stats:", error);
        // You might want to show a toast notification here for the user
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [userId]); // Re-run when userId changes

  return (
    <div className="dashboard-layout">
      <ResidentSidebar /> {/* Render the new sidebar */}
      <main className="dashboard-main-content">
        <header className="main-content-header">
          <h2>Resident Dashboard</h2>
          <p>Welcome back, 👋</p>
        </header>

        {/* Welcome Card */}
        <section className="dashboard-section welcome-card">
          <div className="welcome-content">
            <h3>Hello, {userName}!</h3>
            <p>
              Your central hub for managing community services. Quickly access
              your requests, track applications, and stay informed.
            </p>
          </div>
        </section>

        {/* Your Activity Overview */}
        <section className="dashboard-section activity-overview">
          <h3>Your Activity Overview</h3>
          {loadingStats ? (
            <div className="loading-indicator">
              <p>Loading your activity data...</p>
            </div>
          ) : (
            <div className="activity-cards-grid">
              <div className="activity-card">
                <h4>Maintenance Applications</h4>
                <p className="activity-count">
                  {activityCounts.pendingMaintenance}
                </p>
                <span className="activity-status">
                  {activityCounts.pendingMaintenance > 0
                    ? "Action Required"
                    : "No Pending"}
                </span>
              </div>
              <div className="activity-card">
                <h4>Visitor Applications</h4>
                <p className="activity-count">
                  {activityCounts.upcomingVisitors}
                </p>
                <span className="activity-status">
                  {activityCounts.upcomingVisitors > 0
                    ? "Scheduled"
                    : "No Upcoming"}
                </span>
              </div>
              <div className="activity-card">
                <h4>Lost & Found Reports</h4>
                <p className="activity-count">
                  {activityCounts.activeLostFound}
                </p>
                <span className="activity-status">
                  {activityCounts.activeLostFound > 0
                    ? "Active Reports"
                    : "No Active Reports"}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Community Updates (Placeholder) */}
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
