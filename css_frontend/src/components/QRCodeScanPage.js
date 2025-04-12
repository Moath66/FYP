import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/QRCodeScanPage.css";

const QRCodeScanPage = () => {
  const { search } = useLocation();
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const encodedData = query.get("data");

    console.log("🔍 Encoded query string:", encodedData); // Add this

    if (encodedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encodedData));
        console.log("✅ Decoded Data:", decoded); // Add this
        setItemData(decoded);
      } catch (err) {
        console.error("❌ Failed to parse QR data", err);
      }
    }
  }, [search]);

  if (!itemData) {
    return (
      <div className="qr-scan-container">
        <h2>🚫 Invalid or Missing QR Code</h2>
        <p>Please ensure you're scanning a valid code from the system.</p>
      </div>
    );
  }

  const {
    itemId,
    itemName,
    location,
    date,
    description,
    status,
    claimedBy,
    reportedBy,
  } = itemData;

  return (
    <div className="qr-scan-container">
      <div className="scan-card">
        <h2>🔍 Item Claim Verification</h2>
        <div className="item-details">
          <p>
            <strong>🆔 Item ID:</strong> {itemId}
          </p>
          <p>
            <strong>📦 Item Name:</strong> {itemName}
          </p>
          <p>
            <strong>📍 Location:</strong> {location}
          </p>
          <p>
            <strong>📅 Date:</strong> {new Date(date).toLocaleDateString()}
          </p>
          <p>
            <strong>📝 Description:</strong> {description}
          </p>
          <p>
            <strong>📌 Status:</strong> {status}
          </p>
          <hr />
          <div className="user-info">
            <h4>🙋 Claimed By:</h4>
            <p>
              <strong>Role:</strong> {claimedBy.role}
            </p>
            <p>
              <strong>Name:</strong> {claimedBy.userName}
            </p>
            <p>
              <strong>User ID:</strong> {claimedBy.userId}
            </p>
          </div>
          <div className="user-info">
            <h4>🧾 Reported By:</h4>
            <p>
              <strong>Role:</strong> {reportedBy.role}
            </p>
            <p>
              <strong>Name:</strong> {reportedBy.userName}
            </p>
            <p>
              <strong>User ID:</strong> {reportedBy.userId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanPage;
