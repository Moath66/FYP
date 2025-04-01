import React from "react";
import "../styles/ResidentDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

const StaffDashboard = () => {
  const navigate = useNavigate();

  // ✅ Get the user name from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.userName || "Staff";

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Staff Dashboard</h1>
        <FaUserEdit
          className="profile-icon"
          title="Manage Profile"
          onClick={() => navigate("/staff/profile")}
        />
      </header>

      <div className="dashboard-section">
        <h2>Welcome {userName}</h2>
        <p>You can manage your account using the button above.</p>
      </div>
    </div>
  );
};

export default StaffDashboard;
