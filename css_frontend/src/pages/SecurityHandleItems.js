"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaArrowLeft, FaSearch } from "react-icons/fa"; // Using FaBook for the title icon

import "../styles/SecurityHandleItems.css";
import { fetchAllItems, updateItemStatus } from "../api/itemApi"; // Keeping backend imports as is

const SecurityHandleItems = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchAllItems();
        setItems(data);
      } catch (err) {
        console.error("Error loading items", err);
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
      case "found": // Added 'found' status for consistency with tracking page
        return "Found";
      default:
        return "Pending";
    }
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="handle-items-page-wrapper">
      {/* New Header Section */}
      <header className="page-header">
        <h2 className="page-title">
          <FaBook className="page-title-icon" /> Tracking Items Application
        </h2>
        <button
          className="back-button"
          onClick={() => navigate("/security/dashboard")}
        >
          <FaArrowLeft className="back-button-icon" /> Back to Dashboard
        </button>
      </header>

      <div className="handle-items-container">
        <div className="card">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <FaSearch />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table className="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Date</th>
                {/* Removed Location column */}
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
                  {/* Removed Location data */}
                  <td>
                    <span className={`status-pill ${item.status}`}>
                      {getSecurityDisplayStatus(item.status)}
                    </span>
                  </td>
                  <td>
                    {item.status === "claimed" ? (
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-return"
                          onClick={() =>
                            handleStatusChange(item._id, "returned")
                          }
                        >
                          Returned
                        </button>
                        <button
                          className="btn-action btn-discard"
                          onClick={() =>
                            handleStatusChange(item._id, "discarded")
                          }
                        >
                          Discard
                        </button>
                      </div>
                    ) : (
                      <span className="no-action">No Action</span> // Display "No Action" explicitly
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
      </div>
    </div>
  );
};

export default SecurityHandleItems;
