import React from "react";
import "../styles/QRCodePopup.css"; // Make sure this matches your provided CSS

const QRCodePopup = ({ visible, qrCodeData, qrScanUrl, onClose }) => {
  if (!visible) return null;

  return (
    <div className="qr-popup-overlay">
      <div className="qr-popup-card">
        <h2>🎉 Claim Successful</h2>
        <p>Scan or present this QR code to security for verification.</p>

        <img src={qrCodeData} alt="QR Code" className="qr-image" />

        <div className="qr-details">
          <p>
            <strong>🔗 Scan Link:</strong>
          </p>
          <input
            type="text"
            value={qrScanUrl}
            readOnly
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "13px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginTop: "8px",
              fontFamily: "monospace",
            }}
            onClick={(e) => e.target.select()}
          />
          <p style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
            This link will open the verification form instantly.
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
