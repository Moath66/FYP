import React, { useEffect, useState } from "react";
import "../styles/SecurityHandleItems.css";
import { fetchAllItems, updateItemStatus } from "../api/itemApi";

const SecurityHandleItems = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

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
      default:
        return "Pending";
    }
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="handle-items-container">
      <div className="card">
        <h2>📁 Handle Items</h2>

        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Date</th>
              <th>Location</th>
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
                <td>{item.location}</td>
                <td>
                  <span className={`status ${item.status}`}>
                    {getSecurityDisplayStatus(item.status)}
                  </span>
                </td>
                <td>
                  {["claimed", "unclaimed"].includes(item.status) ? (
                    <div className="action-buttons">
                      <button
                        className="btn-return"
                        onClick={() => handleStatusChange(item._id, "returned")}
                      >
                        Returned
                      </button>
                      <button
                        className="btn-discard"
                        onClick={() =>
                          handleStatusChange(item._id, "discarded")
                        }
                      >
                        Discard
                      </button>
                    </div>
                  ) : (
                    <span className="no-action"></span>
                  )}
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="7" className="no-items">
                  No matching items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityHandleItems;
