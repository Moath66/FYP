import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/QRCodeScanPageVisitor.css";

const QRCodeScanPageVisitor = () => {
  const { search } = useLocation();
  const [visitorData, setVisitorData] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const encodedData = query.get("data");

    if (encodedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encodedData));
        setVisitorData(decoded);
      } catch (err) {
        console.error("❌ Failed to parse QR data", err);
      }
    }
  }, [search]);

  if (!visitorData) {
    return (
      <div className="scan-page">
        <h2>🚫 Invalid or Missing QR Code</h2>
        <p>Please scan a valid QR code.</p>
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
    <div className="scan-page">
      <h2>📋 Visitor Verification Form</h2>
      <div className="item-details">
        <p>
          <strong>🆔 Visitor ID:</strong> {visitorId}
        </p>
        <p>
          <strong>🙋 Visitor Name:</strong> {visitor_name}
        </p>
        <p>
          <strong>🛂 Passport No.:</strong> {passport_number || "-"}
        </p>
        <p>
          <strong>📱 Phone:</strong> {phone_number}
        </p>
        <p>
          <strong>📧 Email:</strong> {email}
        </p>
        <p>
          <strong>📅 Visit Date:</strong> {new Date(date).toLocaleDateString()}
        </p>
        <p>
          <strong>📝 Purpose:</strong> {purpose}
        </p>
        <p>
          <strong>📌 Status:</strong> {status}
        </p>

        <hr />
        <h3>📨 Requested By</h3>
        <div className="user-info">
          <p>
            <strong>Role:</strong> {submittedBy?.role}
          </p>
          <p>
            <strong>Name:</strong> {submittedBy?.userName}
          </p>
          <p>
            <strong>User ID:</strong> {submittedBy?.userId}
          </p>
        </div>

        <h3>✅ Approved By</h3>
        <div className="user-info">
          <p>
            <strong>Role:</strong> {approvedBy?.role}
          </p>
          <p>
            <strong>Name:</strong> {approvedBy?.userName}
          </p>
          <p>
            <strong>User ID:</strong> {approvedBy?.userId}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => window.history.back()} className="back-btn">
          🔙 Back
        </button>
        <button onClick={() => window.print()} className="print-btn">
          🖨️ Print
        </button>
      </div>
    </div>
  );
};

export default QRCodeScanPageVisitor;
