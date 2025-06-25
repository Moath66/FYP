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
  // ✅ FIXED: Use numeric userId, not MongoDB _id
  const userId = storedUser?.userId; // Remove the fallback to _id

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
        const pendingMaintenance = maintenanceRequests.length;
        console.log("Maintenance Requests:", maintenanceRequests);

        // Fetch Visitor Registrations
        const visitorRegistrations = await getVisitorsByResident();
        const now = new Date();
        const upcomingVisitors = visitorRegistrations.filter((visitor) => {
          const visitDate = visitor.visitDate
            ? new Date(visitor.visitDate)
            : null;
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
        // ✅ Count ALL Lost & Found applications made by user
        const activeLostFound = lostFoundItems.length;
        console.log("Lost & Found Items:", lostFoundItems);

        setActivityCounts({
          pendingMaintenance,
          upcomingVisitors,
          activeLostFound,
        });
      } catch (error) {
        console.error("Failed to fetch resident dashboard stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [userId]);

  return (
    <div className="dashboard-layout">
      <ResidentSidebar />
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
                    ? "Total Reports"
                    : "No Reports"}
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
