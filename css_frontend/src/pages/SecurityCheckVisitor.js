import React, { useEffect, useState } from "react";
import "../styles/SecurityCheckVisitor.css";
import {
  fetchPendingVisitors,
  approveVisitor,
  denyVisitor,
} from "../api/visitorApis";

const SecurityCheckVisitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [showPurposeBox, setShowPurposeBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVisitors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please login.");
        setVisitors([]);
        return;
      }

      const data = await fetchPendingVisitors();
      setVisitors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching visitors:", err);
      setError("Failed to fetch visitors.");
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleApprove = async (visitorId) => {
    const confirm = window.confirm("✅ Approve this visitor?");
    if (!confirm) return;

    try {
      await approveVisitor(visitorId);
      loadVisitors();
    } catch {
      alert("Failed to approve visitor.");
    }
  };

  const handleDeny = async (visitorId) => {
    const reason = prompt("❌ Enter reason for denial:");
    if (!reason) return;

    try {
      await denyVisitor(visitorId, reason);
      loadVisitors();
    } catch {
      alert("Failed to deny visitor.");
    }
  };

  const filtered = visitors.filter((v) =>
    v.visitor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="security-container">
      <h2 className="security-title">🛡️ Check Visitors</h2>

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
        <table className="security-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Visitor ID</th>
              <th>Visitor Name</th>
              <th>Purpose</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((v, i) => (
                <tr key={v._id}>
                  <td>{i + 1}</td>
                  <td>{v.visitorId}</td>
                  <td>{v.visitor_name}</td>
                  <td>
                    <button
                      className="btn-details"
                      onClick={() => {
                        setSelectedPurpose(v.purpose || "No details provided.");
                        setShowPurposeBox(true);
                      }}
                    >
                      Details
                    </button>
                  </td>
                  <td>{v.phone_number}</td>
                  <td>{v.email}</td>
                  <td>{new Date(v.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(v._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-deny"
                      onClick={() => handleDeny(v._id)}
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", color: "gray" }}>
                  No pending visitors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showPurposeBox && (
        <div className="purpose-popup">
          <div className="purpose-content">
            <h4>Purpose of Visit</h4>
            <p>{selectedPurpose}</p>
            <button
              className="close-popup"
              onClick={() => setShowPurposeBox(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityCheckVisitor;
