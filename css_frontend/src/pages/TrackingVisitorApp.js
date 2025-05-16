import React, { useEffect, useState } from "react";
import "../styles/TrackingVisitorApp.css";
import axios from "axios";

const TrackingVisitorApp = () => {
  const [visitorList, setVisitorList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVisitors = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id;
      const token = localStorage.getItem("token");

      console.log("📦 userId:", userId);
      console.log("🔐 token:", token);

      if (!userId || !token) {
        setError("Missing user session. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`/api/visitors/byResident/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVisitorList(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching visitor data:", error);
      setError("Failed to load visitors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const filteredVisitors = Array.isArray(visitorList)
    ? visitorList.filter((v) =>
        v.visitor_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="tracking-container">
      <h2 className="tracking-title">📘 Tracking Visitor Application</h2>

      <input
        type="text"
        placeholder="🔍 Search by visitor name..."
        className="search-box"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table className="tracking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Visitor Name</th>
              <th>QR Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map((visitor, index) => (
                <tr key={visitor._id}>
                  <td>{index + 1}</td>
                  <td>{visitor.visitorId}</td>
                  <td>{visitor.visitor_name}</td>
                  <td>
                    {visitor.status === "approved" ? (
                      <img src={visitor.qrCode} alt="QR" className="qr-image" />
                    ) : visitor.status === "denied" ? (
                      <span className="not-available">Not Available</span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {visitor.status === "approved" ? (
                      <span className="status approved">✔ Approved</span>
                    ) : visitor.status === "denied" ? (
                      <span className="status denied">✖ Denied</span>
                    ) : (
                      <span className="status pending">⌛ Pending</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "gray" }}>
                  No visitor records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrackingVisitorApp;
