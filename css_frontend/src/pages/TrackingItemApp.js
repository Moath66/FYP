import React, { useEffect, useState } from "react";
import "../styles/TrackingItemApp.css";
import { fetchItemsByUser, claimItem } from "../api/itemApi";
import QRCodePopup from "../components/QRCodePopup";

const TrackingItemApp = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItemsByUser(userId);
        setItems(data);
      } catch (err) {
        console.error("Error loading user items", err);
      }
    };

    if (userId) loadItems();
  }, [userId]);

  useEffect(() => {
    console.log("✅ Items loaded:", items);
  }, [items]);

  const handleClaim = async (itemId) => {
    try {
      const res = await claimItem(itemId);
      const { item, qrCode, qrData } = res;

      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, status: item.status } : i
        )
      );

      setQrCode(qrCode);
      setQrData(qrData);
      setPopupVisible(true);
    } catch (err) {
      alert("❌ Failed to claim item");
    }
  };

  const getResidentDisplayStatus = (status) => {
    switch (status) {
      case "lost":
        return "Lost";
      case "unclaimed":
      case "claimed":
        return "Found";
      case "returned":
        return "Returned";
      case "discarded":
        return "Discarded";
      default:
        return "Pending";
    }
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tracking-app-container">
      <div className="card">
        <h2>📖 Tracking Items Application</h2>

        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="tracking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={item._id || index}>
                <td>{index + 1}</td>
                <td>{item.itemId}</td>
                <td>{item.itemName}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${item.status}`}>
                    {getResidentDisplayStatus(item.status)}
                  </span>
                </td>
                <td>
                  {item.status === "unclaimed" && (
                    <button
                      className="claim-btn"
                      onClick={() => handleClaim(item._id)}
                    >
                      Claim Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="6" className="no-items">
                  No matching items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <QRCodePopup
        visible={popupVisible}
        qrCodeData={qrCode}
        qrData={qrData}
        onClose={() => setPopupVisible(false)}
      />
    </div>
  );
};

export default TrackingItemApp;
