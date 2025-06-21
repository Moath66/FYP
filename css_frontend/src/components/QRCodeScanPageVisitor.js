"use client";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/QRCodeScanPageVisitor.css"; // Ensure this path is correct
import {
  FaClipboardList,
  FaUser,
  FaPassport,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaPrint,
} from "react-icons/fa"; // Using react-icons/fa for icons
import { toast } from "react-toastify"; // Using react-toastify for notifications

const QRCodeScanPageVisitor = () => {
  const { search } = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [visitorData, setVisitorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(search);
    const encodedData = query.get("data");

    if (encodedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encodedData));
        setVisitorData(decoded);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to parse QR data", err);
        setError("Invalid QR code data.");
        toast.error("Invalid QR code data.");
        setLoading(false);
      }
    } else {
      setError("Missing QR code data.");
      toast.error("Missing QR code data.");
      setLoading(false);
    }
  }, [search]);

  if (loading) {
    return (
      <div className="lost-page-wrapper">
        <div className="lost-card">
          <p className="loading-message">Loading visitor data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lost-page-wrapper">
        <div className="lost-card">
          <p className="error-message">{error}</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft className="mr-2 h-4 w-4" /> Back
          </button>
        </div>
      </div>
    );
  }

  if (!visitorData) {
    return (
      <div className="lost-page-wrapper">
        <div className="lost-card">
          <p className="error-message">🚫 Invalid or Missing QR Code</p>
          <p className="error-message-detail">Please scan a valid QR code.</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft className="mr-2 h-4 w-4" /> Back
          </button>
        </div>
      </div>
    );
  }

  const {
    visitorId,
    visitor_name,
    passport_number,
    phone_number,
    purpose,
    date,
    email,
    status,
    submittedBy,
    approvedBy,
  } = visitorData;

  return (
    <div className="lost-page-wrapper">
      <div className="lost-card">
        <header className="profile-header">
          <h2 className="lost-card-title">
            <FaClipboardList className="lost-card-icon" /> Visitor Verification
            Form
          </h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft className="mr-2 h-4 w-4" /> Back
          </button>
        </header>
        <div className="scan-page-content">
          <div className="item-details">
            <p>
              <strong>
                <FaUser className="detail-icon" /> Visitor ID:
              </strong>{" "}
              {visitorId}
            </p>
            <p>
              <strong>
                <FaUser className="detail-icon" /> Visitor Name:
              </strong>{" "}
              {visitor_name}
            </p>
            <p>
              <strong>
                <FaPassport className="detail-icon" /> Passport No.:
              </strong>{" "}
              {passport_number || "-"}
            </p>
            <p>
              <strong>
                <FaPhone className="detail-icon" /> Phone:
              </strong>{" "}
              {phone_number}
            </p>
            <p>
              <strong>
                <FaEnvelope className="detail-icon" /> Email:
              </strong>{" "}
              {email}
            </p>
            <p>
              <strong>
                <FaCalendarAlt className="detail-icon" /> Visit Date:
              </strong>{" "}
              {new Date(date).toLocaleDateString()}
            </p>
            <p>
              <strong>
                <FaTag className="detail-icon" /> Purpose:
              </strong>{" "}
              {purpose}
            </p>
            <p>
              <strong>
                {status === "approved" ? (
                  <FaCheckCircle className="detail-icon status-approved-icon" />
                ) : (
                  <FaTimesCircle className="detail-icon status-denied-icon" />
                )}{" "}
                Status:
              </strong>{" "}
              <span className={`status-text ${status}`}>{status}</span>
            </p>
          </div>

          <hr className="section-divider" />
          <h3 className="section-title">📨 Requested By</h3>
          <div className="user-info">
            <p>
              <strong>Role:</strong> {submittedBy?.role || "N/A"}
            </p>
            <p>
              <strong>Name:</strong> {submittedBy?.userName || "N/A"}
            </p>
            <p>
              <strong>User ID:</strong> {submittedBy?.userId || "N/A"}
            </p>
          </div>

          <h3 className="section-title">✅ Approved By</h3>
          <div className="user-info">
            <p>
              <strong>Role:</strong> {approvedBy?.role || "N/A"}
            </p>
            <p>
              <strong>Name:</strong> {approvedBy?.userName || "N/A"}
            </p>
            <p>
              <strong>User ID:</strong> {approvedBy?.userId || "N/A"}
            </p>
          </div>

          <div className="button-group">
            <button onClick={() => navigate(-1)} className="back-btn-bottom">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Back
            </button>
            <button onClick={() => window.print()} className="print-btn">
              <FaPrint className="mr-2 h-4 w-4" /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanPageVisitor;
