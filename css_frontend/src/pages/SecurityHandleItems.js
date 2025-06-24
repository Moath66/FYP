"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FolderOpen, ArrowLeft, Trash2, RotateCcw } from "lucide-react"; // Using Lucide React icons
import "../styles/SecurityHandleItems.css"; // Import the new CSS file

// IMPORTANT: These imports are from your existing backend integration.
// I will NOT modify these or provide placeholder functions.
import { fetchAllItems, updateItemStatus } from "../api/itemApi";

const SecurityHandleItems = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
      case "lost":
        return "Lost";
      case "found":
        return "Found";
      default:
        return "Pending";
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
    <div className="security-page-container">
      <div className="security-card">
        <div className="security-card-header">
          <h2 className="security-card-title">
            <FolderOpen className="h-7 w-7" />
            Handle Items
          </h2>
          <button
            type="button"
            className="back-to-dashboard-button"
            onClick={() => navigate("/security/dashboard")}
          >
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
                  {filteredAndSortedItems.length > 0 ? (
                    filteredAndSortedItems.map((item, index) => (
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
