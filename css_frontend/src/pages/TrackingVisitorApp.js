import React, { useEffect, useState } from "react";
import "../styles/TrackingVisitorApp.css";
import { getVisitorsByResident } from "../api/visitorApis"; // ✅ Use API helper

const TrackingVisitorApp = () => {
  const [visitorList, setVisitorList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser || !token) {
        setError("Missing user session. Please log in again.");
        setLoading(false);
        return;
      }

      const data = await getVisitorsByResident(); // ✅ Centralized API call
      setVisitorList(data || []);
    } catch (err) {
      console.error("❌ Error fetching visitor data:", err);
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
              filteredVisitors
                .sort((a, b) => a.visitorId.localeCompare(b.visitorId))
                .map((visitor, index) => (
                  <tr key={visitor._id}>
                    <td>{index + 1}</td>
                    <td>{visitor.visitorId}</td>
                    <td>{visitor.visitor_name}</td>
                    <td>
                      {visitor.status === "approved" ? (
                        <img
                          src={visitor.qrCode}
                          alt="QR"
                          className="qr-image"
                        />
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
                        <span className="status denied">
                          ✖ Denied
                          {visitor.denialReason && (
                            <div className="denial-reason-box">
                              <strong>Reason:</strong> {visitor.denialReason}
                            </div>
                          )}
                        </span>
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
