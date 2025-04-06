import React, { useEffect, useState } from "react";
import "../styles/TrackingItemApp.css";
import axios from "axios";

const TrackingItemApp = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`/api/items/by-user/${userId}`);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching tracking items", err);
      }
    };

    fetchItems();
  }, [userId]);

  const handleClaim = async (itemId) => {
    try {
      await axios.put(`/api/items/claim/${itemId}`);
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, status: "claimed" } : item
        )
      );
    } catch (err) {
      alert("Error claiming item");
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
                <td>{item.itemName}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${item.status}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td>
                  {item.status === "found" && (
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
                <td colSpan="5" className="no-items">
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

export default TrackingItemApp;
