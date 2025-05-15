import React, { useEffect, useState } from "react";
import "../../styles/TrackingVisitorApp.css";
import axios from "axios";

const TrackingVisitorApp = () => {
  const [visitorList, setVisitorList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVisitors = async () => {
    try {
      const res = await axios.get(
        `/api/visitors/byResident/${localStorage.getItem("userId")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setVisitorList(res.data);
    } catch (error) {
      console.error("❌ Error fetching visitor data:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const filteredVisitors = visitorList.filter((v) =>
    v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {filteredVisitors.map((visitor, index) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingVisitorApp;
