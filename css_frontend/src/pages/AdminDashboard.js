"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { fetchUsers } from "../api/userApi"; // Assuming this API function exists
import "../styles/AdminDashboard.css"; // New CSS file

// Inline SVG Icons (replace with a library like react-icons or lucide-react for more options)
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);
const BuildingIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="36"
    height="36"
    fill="currentColor"
    className="stat-icon"
  >
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="36"
    height="36"
    fill="currentColor"
    className="stat-icon"
  >
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>
);
const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="36"
    height="36"
    fill="currentColor"
    className="stat-icon"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
  </svg>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin"); // Placeholder for admin's name

  const total = users.length;
  const residents = users.filter((u) => u.role === "resident").length;
  const staff = users.filter((u) => u.role === "staff").length;
  const security = users.filter((u) => u.role === "security").length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Assuming user object has a 'name' or 'username' field
        setAdminName(parsedUser.name || parsedUser.username || "Admin");
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    const loadUsers = async () => {
      try {
        const data = await fetchUsers(); // Ensure fetchUsers is correctly implemented and returns user data
        setUsers(data);
      } catch (err) {
        console.error("❌ Failed to load users:", err);
        // Optionally, show a toast message here
        // navigate("/login"); // Consider if navigating away on fetch error is the best UX
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate]); // Added navigate to dependency array

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userId"); // Ensure userId is also cleared
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">CSS</span>
          <h1 className="sidebar-title">Admin Panel</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-item active">
            <DashboardIcon /> Dashboard
          </Link>
          <Link to="/admin/manage-users" className="nav-item">
            <UsersIcon /> Manage Users
          </Link>
          {/* Add more navigation items here */}
        </nav>
        <button onClick={handleLogout} className="sidebar-logout-button">
          <LogoutIcon /> Logout
        </button>
      </aside>

      <main className="admin-main-content">
        <header className="main-content-header">
          <h2>Admin Dashboard</h2>
          <p>Welcome back, {adminName}! 👋</p>
        </header>

        {loading ? (
          <div className="loading-indicator">
            <p>Loading dashboard data...</p> {/* Or a spinner component */}
          </div>
        ) : (
          <section className="stats-overview">
            <div className="stat-card total-users-card">
              <div className="stat-card-icon">
                <UsersIcon />
              </div>
              <div className="stat-card-info">
                <h3>Total Users</h3>
                <p className="stat-value">{total}</p>
              </div>
            </div>
            <div className="stat-card residents-card">
              <div className="stat-card-icon">
                <BuildingIcon />
              </div>
              <div className="stat-card-info">
                <h3>Residents</h3>
                <p className="stat-value">{residents}</p>
              </div>
            </div>
            <div className="stat-card staff-card">
              <div className="stat-card-icon">
                <BriefcaseIcon />
              </div>
              <div className="stat-card-info">
                <h3>Staff</h3>
                <p className="stat-value">{staff}</p>
              </div>
            </div>
            <div className="stat-card security-card">
              <div className="stat-card-icon">
                <ShieldIcon />
              </div>
              <div className="stat-card-info">
                <h3>Security</h3>
                <p className="stat-value">{security}</p>
              </div>
            </div>
          </section>
        )}
        {/* More dashboard sections can be added here */}
      </main>
    </div>
  );
};

export default AdminDashboard;
