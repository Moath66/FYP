"use client";

import { useEffect, useState } from "react";
import "../styles/TrackingMaintenanceApp.css"; // Ensure this path is correct
import { getMaintenanceByResident } from "../api/maintenanceApis"; // Keep your existing API import
import {
  FaArrowLeft,
  FaBriefcase,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa"; // Using react-icons/fa for icons
import { toast } from "react-toastify"; // Using react-toastify for notifications
import { useNavigate } from "react-router-dom"; // For navigation

const TrackingMaintenanceApp = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !user._id) {
        toast.error("Missing user ID. Please log in.");
        navigate("/login");
        return;
      }
      const data = await getMaintenanceByResident(user._id);

      // Sort by equipment ID (e.g., EQ0001, EQ0002)
      const sorted = [...data].sort((a, b) =>
        (a.equipment_id || "").localeCompare(b.equipment_id || "")
      );
      setMaintenanceList(sorted);
    } catch (error) {
      console.error("Error fetching maintenance data:", error);
      toast.error("❌ Error fetching maintenance data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusBadge = (action, status) => {
    if (status !== "Completed")
      return (
        <span className="status pending">
          <FaClock /> Pending
        </span>
      );

    switch (action) {
      case "replace":
        return (
          <span className="status orange">
            <FaExclamationTriangle /> Replacement Required
          </span>
        );
      case "checking":
        return (
          <span className="status yellow">
            <FaClock /> Maintenance Scheduled
          </span>
        );
      case "no_checking":
        return (
          <span className="status green">
            <FaCheck /> Good
          </span>
        );
      default:
        return (
          <span className="status pending">
            <FaClock /> Pending
          </span>
        );
    }
  };

  return (
    <div className="lost-page-wrapper">
      {" "}
      {/* Reusing wrapper for centering */}
      <div className="lost-card">
        {" "}
        {/* Reusing card styling */}
        <header className="profile-header">
          {" "}
          {/* Reusing header styling */}
          <h2 className="lost-card-title">
            <FaBriefcase className="lost-card-icon" /> Tracking Maintenance
            Application
          </h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            {" "}
            {/* Reusing back-btn styling */}
            <FaArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </button>
        </header>
        <div className="tracking-content">
          <table className="tracking-table">
            <thead>
              <tr>
                <th>Equipment ID</th>
                <th>Equipment Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceList.length > 0 ? (
                maintenanceList.map((item) => (
                  <tr key={item._id}>
                    <td data-label="Equipment ID">
                      {item.equipment_id || "N/A"}
                    </td>
                    <td data-label="Equipment Name">{item.eq_type}</td>
                    <td data-label="Status">
                      {getStatusBadge(item.staffAction, item.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-items">
                    No maintenance requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrackingMaintenanceApp;
