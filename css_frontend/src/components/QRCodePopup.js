import React from "react";
import "../styles/QRCodePopup.css";

const QRCodePopup = ({ qrCodeData, qrData, onClose }) => {
  if (!qrCodeData || !qrData) return null;

  const {
    itemId,
    itemName,
    location,
    date,
    status,
    claimedBy = {},
    reportedBy = {},
  } = qrData;

  return (
    <div className="qr-popup-overlay">
      <div className="qr-popup-card">
        <h2>🎉 Claim Successful</h2>
        <p>Scan the QR code below or verify the item details manually:</p>

        <img
          src={qrCodeData}
          alt="QR Code for claimed item"
          className="qr-image"
        />

        <div className="qr-details">
          <p>
            <strong>🆔 Item ID:</strong> {itemId || "N/A"}
          </p>
          <p>
            <strong>📦 Name:</strong> {itemName || "N/A"}
          </p>
          <p>
            <strong>📍 Location:</strong> {location || "N/A"}
          </p>
          <p>
            <strong>📅 Date:</strong>{" "}
            {date ? new Date(date).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status-badge ${status}`}>{status}</span>
          </p>
          <hr />
          <p>
            <strong>🙋 Claimed By:</strong> {claimedBy?.userName || "N/A"} (ID:{" "}
            {claimedBy?.userId || "N/A"})
          </p>
          <p>
            <strong>📝 Reported By:</strong> {reportedBy?.userName || "N/A"}{" "}
            (ID: {reportedBy?.userId || "N/A"})
          </p>
        </div>

        <button className="close-btn" onClick={onClose}>
          ✖ Close
        </button>
      </div>
    </div>
  );
};

export default QRCodePopup;
