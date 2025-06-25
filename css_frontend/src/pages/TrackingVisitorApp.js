"use client";

import { useEffect, useState } from "react";
import "../styles/TrackingVisitorApp.css"; // Ensure this path is correct
import { getVisitorsByResident } from "../api/visitorApis"; // Use API helper
import {
  FaArrowLeft,
  FaBook,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaInfoCircle,
} from "react-icons/fa"; // Using react-icons/fa for icons
import { toast } from "react-toastify"; // Using react-toastify for notifications
import { useNavigate } from "react-router-dom"; // For navigation

const TrackingVisitorApp = () => {
  const [visitorList, setVisitorList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchVisitors = async () => {
    setLoading(true);
    setError("");
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!storedUser || !token || !storedUser._id) {
        setError("Missing user session. Please log in again.");
        toast.error("Missing user session. Please log in again.");
        navigate("/login");
        return;
      }

      const data = await getVisitorsByResident(); // Centralized API call
      setVisitorList(data || []);
    } catch (err) {
      console.error("❌ Error fetching visitor data:", err);
      setError("Failed to load visitors.");
      toast.error("❌ Failed to load visitors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const filteredVisitors = Array.isArray(visitorList)
    ? visitorList.filter((v) =>
        v.visitor_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getStatusBadge = (status, denialReason, visitorId) => {
    switch (status) {
      case "approved":
        return (
          <span className="status approved">
            <FaCheckCircle /> Approved
          </span>
        );
      case "denied":
        return (
          <span className="status denied">
            <FaTimesCircle /> Denied
            {denialReason && (
              <button
                className="reason-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click if any
                  // ✅ FIXED: Use the correct visitor ID for comparison
                  setVisitorList((prev) =>
                    prev.map((v) =>
                      v._id === visitorId
                        ? { ...v, showReason: !v.showReason }
                        : v
                    )
                  );
                }}
              >
                <FaInfoCircle /> View Reason
              </button>
            )}
          </span>
        );
      case "pending":
      default:
        return (
          <span className="status pending">
            <FaHourglassHalf /> Pending
          </span>
        );
    }
  };

  return (
    <div className="lost-page-wrapper">
      <div className="lost-card">
        <header className="profile-header">
          <h2 className="lost-card-title">
            <FaBook className="lost-card-icon" /> Tracking Visitor Application
          </h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </button>
        </header>
        <div className="tracking-content">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search by visitor name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loading-message">Loading visitor records...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table className="tracking-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Visitor Name</th>
                  <th>Passport No</th>
                  <th>QR Code</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.length > 0 ? (
                  filteredVisitors
                    .sort((a, b) =>
                      (a.visitorId || "").localeCompare(b.visitorId || "")
                    )
                    .map((visitor, index) => (
                      <tr key={visitor._id}>
                        <td data-label="#">{index + 1}</td>
                        <td data-label="ID">{visitor.visitorId}</td>
                        <td data-label="Visitor Name">
                          {visitor.visitor_name}
                        </td>
                        <td data-label="Passport No">
                          {visitor.passport_number || "-"}
                        </td>
                        <td data-label="QR Code">
                          {visitor.status === "approved" && visitor.qrCode ? (
                            <img
                              src={visitor.qrCode || "/placeholder.svg"}
                              alt="QR"
                              className="qr-image"
                            />
                          ) : (
                            <span className="not-available">N/A</span>
                          )}
                        </td>
                        <td data-label="Status">
                          {/* ✅ FIXED: Pass visitor._id as third parameter */}
                          {getStatusBadge(
                            visitor.status,
                            visitor.denialReason,
                            visitor._id
                          )}
                          {visitor.showReason && visitor.denialReason && (
                            <div className="reason-popup">
                              <FaInfoCircle className="reason-popup-icon" />
                              {visitor.denialReason}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-items">
                      No visitor records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingVisitorApp;
