import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../api/userApi";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const total = users.length;
  const residents = users.filter(u => u.role === "resident").length;
  const staff = users.filter(u => u.role === "staff").length;
  const security = users.filter(u => u.role === "security").length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error("❌ Failed to load users:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h1>Admin Control Panel</h1>
      </header>

      <nav className="nav-bar">
        <button className="nav-link active">🏠 Dashboard</button>
        <button className="nav-link" onClick={() => navigate("/admin/manage-users")}>👥 Manage User Accounts</button>
      </nav>

      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        <p>Welcome, Admin! 🎉</p>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="stat-grid">
            <div className="stat-card">
              <div className="icon">👥</div>
              <h3>Total Users</h3>
              <p>{total}</p>
            </div>
            <div className="stat-card">
              <div className="icon">🏠</div>
              <h3>Residents</h3>
              <p>{residents}</p>
            </div>
            <div className="stat-card">
              <div className="icon">🧰</div>
              <h3>Staff</h3>
              <p>{staff}</p>
            </div>
            <div className="stat-card">
              <div className="icon">🔒</div>
              <h3>Security</h3>
              <p>{security}</p>
            </div>
          </div>
        )}

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
