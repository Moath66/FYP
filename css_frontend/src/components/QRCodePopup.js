// ✅ Updated QRCodePopup.js
import React from "react";
import "../styles/QRCodePopup.css";

const QRCodePopup = ({ visible, qrCodeData, onClose }) => {
  if (!visible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h3>🎉 Claim Successful</h3>
        <p>Scan the QR code below to show item details to security:</p>

        <div className="qr-wrapper">
          <img src={qrCodeData} alt="QR Code" className="qr-image" />
        </div>

        <button className="btn-close" onClick={onClose}>
        </button>
      </div>
    </div>
  );
};

export default QRCodePopup;
