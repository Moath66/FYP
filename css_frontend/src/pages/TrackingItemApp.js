"use client";

import { useEffect, useState } from "react";
import "../styles/TrackingItemApp.css"; // Ensure this path is correct
import { fetchItemsByUser, claimItem } from "../api/itemApi"; // Keep your existing API imports
import QRCodePopup from "../components/QRCodePopup"; // Assuming this component exists
import {
  FaArrowLeft,
  FaBookOpen,
  FaTimes,
  FaCheck,
  FaBoxOpen,
  FaTrash,
} from "react-icons/fa"; // Using react-icons/fa for icons
import { toast } from "react-toastify"; // Using react-toastify for notifications
import { useNavigate } from "react-router-dom"; // For navigation

const TrackingItemApp = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [scanUrl, setScanUrl] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser?.userId;

  const navigate = useNavigate();

  useEffect(() => {
    const loadItems = async () => {
      try {
        if (!userId) {
          toast.error("Missing user ID. Please log in.");
          navigate("/login");
          return;
        }
        const data = await fetchItemsByUser(userId);
        setItems(data);
      } catch (err) {
        console.error("Error loading user items", err);
        toast.error("❌ Error loading user items.");
      }
    };

    if (userId) loadItems();
  }, [userId, navigate]);

  const handleClaim = async (itemId) => {
    setLoadingClaim(true);
    try {
      const res = await claimItem(itemId);
      const { item, qrCode, qrData, scanUrl } = res;

      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, status: item.status } : i
        )
      );

      setQrCode(qrCode);
      setQrData(qrData);
      setScanUrl(scanUrl);
      setPopupVisible(true);
      toast.success("✅ Item claimed successfully!");
    } catch (err) {
      console.error("❌ Failed to claim item:", err);
      toast.error("❌ Failed to claim item.");
    } finally {
      setLoadingClaim(false);
    }
  };

  const getResidentDisplayStatus = (status) => {
    switch (status) {
      case "lost":
        return (
          <span className="status lost">
            <FaTimes /> Lost
          </span>
        );
      case "unclaimed":
      case "claimed":
        return (
          <span className="status found">
            <FaBoxOpen /> Found
          </span>
        );
      case "returned":
        return (
          <span className="status returned">
            <FaCheck /> Returned
          </span>
        );
      case "discarded":
        return (
          <span className="status discarded">
            <FaTrash /> Discarded
          </span>
        );
      default:
        return <span className="status pending">Pending</span>;
    }
  };

  const filteredAndSortedItems = items
    .filter((item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      // Extract numeric part from itemId (e.g., "ITEM001" -> 1)
      const idA = Number.parseInt(a.itemId.replace("ITEM", ""), 10);
      const idB = Number.parseInt(b.itemId.replace("ITEM", ""), 10);
      return idA - idB;
    });

  return (
    <div className="lost-page-wrapper">
      {" "}
      {/* Reusing wrapper for centering */}
      <div className="lost-card">
        {" "}
        {/* Reusing card styling */}
        <header className="profile-header">
          {" "}
          {/* Reusing header styling */}
          <h2 className="lost-card-title">
            <FaBookOpen className="lost-card-icon" /> Tracking Items Application
          </h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            {" "}
            {/* Reusing back-btn styling */}
            <FaArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </button>
        </header>
        <div className="tracking-content">
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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
              {filteredAndSortedItems.length > 0 ? (
                filteredAndSortedItems.map((item, index) => (
                  <tr key={item._id || index}>
                    <td data-label="#">{index + 1}</td>
                    <td data-label="Item ID">{item.itemId}</td>
                    <td data-label="Item Name">{item.itemName}</td>
                    <td data-label="Date">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td data-label="Status">
                      {getResidentDisplayStatus(item.status)}
                    </td>
                    <td data-label="Action">
                      {item.status === "unclaimed" ? (
                        <button
                          className="claim-btn"
                          onClick={() => handleClaim(item._id)}
                          disabled={loadingClaim}
                        >
                          {loadingClaim ? "Claiming..." : "Claim Now"}
                        </button>
                      ) : (
                        <span className="no-action">No Action</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-items">
                    No matching items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {popupVisible && (
        <QRCodePopup
          visible={popupVisible}
          qrCodeData={qrCode}
          qrData={qrData}
          qrScanUrl={scanUrl}
          onClose={() => setPopupVisible(false)}
        />
      )}
    </div>
  );
};

export default TrackingItemApp;
