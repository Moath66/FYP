import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../api/adminApi"; // Import API function
import "../styles/AdminDashboard.css"; // External stylesheet

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getAdminDashboard();
        setAdminData(data);
      } catch (err) {
        console.error("❌ Error loading admin data:", err);
        setError("Failed to load admin data. Please try again.");
        if (err.message.includes("Unauthorized")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-container">
      {/* Admin Header */}
      <header className="admin-header">
        <h1>Admin Control Panel</h1>
      </header>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <button className="nav-link active">🏠 Dashboard</button>
        <button className="nav-link" onClick={() => navigate("/admin/manage-users")}> 
  👥 Manage User Accounts 
</button>

      </nav>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        <p>Welcome, Admin! 🎉</p>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <pre className="data-box">{JSON.stringify(adminData, null, 2)}</pre>
        )}

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
