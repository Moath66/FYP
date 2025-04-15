import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/QRCodeScanPage.css";

const QRCodeScanPage = () => {
  const { search } = useLocation();
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const encodedData = query.get("data");

    if (encodedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encodedData));
        setItemData(decoded);
      } catch (err) {
        console.error("❌ Failed to parse QR data", err);
      }
    }
  }, [search]);

  if (!itemData) {
    return (
      <div className="scan-page">
        <h2>🚫 Invalid or Missing QR Code</h2>
        <p>Please scan a valid QR code.</p>
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
    picture,
    claimedBy,
    reportedBy,
    foundBy, // ✅ now supported
  } = itemData;

  const apiBaseURL =
    process.env.REACT_APP_API_BASE_URL?.replace("/api", "") || "";

  return (
    <div className="scan-page">
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

        {/* ✅ Show Item Picture */}
        {picture && (
          <div style={{ marginTop: "15px" }}>
            <strong>🖼️ Picture:</strong>
            <div style={{ marginTop: "8px" }}>
              <img
                src={`${apiBaseURL}${picture}`}
                alt="Item"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300?text=Image+Not+Available")
                }
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          </div>
        )}

        <hr />

        {/* ✅ Claimed By Section */}
        <h3 style={{ marginTop: "25px" }}>📌 Report Lost Item Info</h3>
        <div className="user-info">
          <h4>🙋 Claimed By:</h4>
          <p>
            <strong>Role:</strong> {claimedBy?.role}
          </p>
          <p>
            <strong>Name:</strong> {claimedBy?.userName}
          </p>
          <p>
            <strong>User ID:</strong> {claimedBy?.userId}
          </p>
        </div>

        {/* ✅ Reported By Section (now using foundBy) */}
        <h3 style={{ marginTop: "25px" }}>📦 Report Found Item Info</h3>
        <div className="user-info">
          <h4>🧾 Reported By:</h4>
          <p>
            <strong>Role:</strong> {foundBy?.role || "N/A"}
          </p>
          <p>
            <strong>Name:</strong> {foundBy?.userName || "N/A"}
          </p>
          <p>
            <strong>User ID:</strong> {foundBy?.userId || "N/A"}
          </p>
        </div>
      </div>

      {/* ✅ Action Buttons */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#d3d3d3",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🔙 Back
        </button>
        <button
          onClick={() => window.print()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🖨️ Print
        </button>
      </div>
    </div>
  );
};

export default QRCodeScanPage;
