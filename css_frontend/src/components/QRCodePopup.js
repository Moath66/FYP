"use client";
import "../styles/QRCodePopup.css"; // Make sure this matches your provided CSS
import { FaTimes } from "react-icons/fa"; // Using react-icons/fa for icons

const QRCodePopup = ({ visible, qrCodeData, qrScanUrl, onClose }) => {
  if (!visible) return null;

  return (
    <div className="qr-popup-overlay">
      <div className="qr-popup-card">
        <h2 className="qr-popup-title">🎉 Claim Successful</h2>
        <p className="qr-popup-description">
          Scan or present this QR code to security for verification.
        </p>

        <img
          src={qrCodeData || "/placeholder.svg?height=220&width=220"}
          alt="QR Code"
          className="qr-image"
        />

        <div className="qr-details">
          <p className="qr-details-label">
            <strong>🔗 Scan Link:</strong>
          </p>
          <input
            type="text"
            value={qrScanUrl}
            readOnly
            className="qr-scan-link-input"
            onClick={(e) => e.target.select()}
            aria-label="QR Code Scan Link"
          />
          <p className="qr-details-hint">
            This link will open the verification form instantly.
          </p>
        </div>

        <button className="close-btn" onClick={onClose}>
          <FaTimes className="mr-2 h-4 w-4" /> Close
        </button>
      </div>
    </div>
  );
};

export default QRCodePopup;
