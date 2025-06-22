"use client";

import { useEffect, useState } from "react";
import "../styles/SecurityHandleItems.css"; // Import the new CSS file

// Lucide React icons (ensure lucide-react is installed)
import { Search, FolderOpen, ArrowLeft, Trash2, RotateCcw } from "lucide-react";

// Import your existing API functions
// IMPORTANT: Replace these with your actual imports from your MERN backend integration.
// For example:
// import { fetchAllItems, updateItemStatus } from "../api/itemApi";

// Placeholder API functions for demonstration
const fetchAllItems = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          _id: "item1",
          itemId: "ITEM001",
          itemName: "Laptop Charger",
          date: new Date("2025-06-20").toISOString(),
          location: "Reception",
          status: "unclaimed",
        },
        {
          _id: "item2",
          itemId: "ITEM002",
          itemName: "Keys",
          date: new Date("2025-06-22").toISOString(),
          location: "Security Desk",
          status: "claimed",
        },
        {
          _id: "item3",
          itemId: "ITEM003",
          itemName: "Wallet",
          date: new Date("2025-06-25").toISOString(),
          location: "Lobby",
          status: "returned",
        },
        {
          _id: "item4",
          itemId: "ITEM004",
          itemName: "Headphones",
          date: new Date("2025-06-27").toISOString(),
          location: "Cafeteria",
          status: "discarded",
        },
        {
          _id: "item5",
          itemId: "ITEM005",
          itemName: "Umbrella",
          date: new Date("2025-06-28").toISOString(),
          location: "Main Entrance",
          status: "unclaimed",
        },
      ]);
    }, 1000);
  });
};

const updateItemStatus = async (itemId, newStatus) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Item ${itemId} status updated to ${newStatus}`);
      resolve({ success: true });
    }, 500);
  });
};

const SecurityHandleItems = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await fetchAllItems();
        setItems(data);
      } catch (err) {
        setError("Error loading items.");
        console.error("Error loading items", err);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await updateItemStatus(itemId, newStatus);
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      alert("❌ Failed to update status");
    }
  };

  const getSecurityDisplayStatus = (status) => {
    switch (status) {
      case "unclaimed":
        return "Unclaimed";
      case "claimed":
        return "Claimed";
      case "returned":
        return "Returned";
      case "discarded":
        return "Discarded";
      case "lost": // Added for completeness if your backend has this status
        return "Lost";
      case "found": // Added for completeness if your backend has this status
        return "Found";
      default:
        return "Pending";
    }
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="security-page-container">
      <div className="security-card">
        <div className="security-card-header">
          <h2 className="security-card-title">
            <FolderOpen className="h-7 w-7" />
            Handle Items
          </h2>
          <button type="button" className="back-to-dashboard-button">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
        <div className="security-card-content">
          <div className="search-input-wrapper">
            <Search />
            <input
              type="text"
              className="search-input"
              placeholder="Search by item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loading-message">Loading items...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="table-wrapper">
              <table className="items-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-head">#</th>
                    <th className="table-head">Item ID</th>
                    <th className="table-head">Item Name</th>
                    <th className="table-head">Date</th>
                    <th className="table-head">Location</th>
                    <th className="table-head">Status</th>
                    <th className="table-head">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <tr key={item._id || index} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell font-medium">
                          {item.itemId}
                        </td>
                        <td className="table-cell">{item.itemName}</td>
                        <td className="table-cell">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="table-cell">{item.location}</td>
                        <td className="table-cell">
                          <span className={`status-badge ${item.status}`}>
                            {getSecurityDisplayStatus(item.status)}
                          </span>
                        </td>
                        <td className="table-cell">
                          {item.status === "claimed" ? (
                            <div className="action-buttons-container">
                              <button
                                type="button"
                                className="btn-return"
                                onClick={() =>
                                  handleStatusChange(item._id, "returned")
                                }
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Returned
                              </button>
                              <button
                                type="button"
                                className="btn-discard"
                                onClick={() =>
                                  handleStatusChange(item._id, "discarded")
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Discard
                              </button>
                            </div>
                          ) : (
                            <span className="no-action-text">No Action</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-items-message">
                        No matching items.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityHandleItems;
