import React, { useState, useEffect } from "react";
import {
  fetchPendingVisitors,
  approveVisitor,
  denyVisitor,
} from "../api/visitorApis";
import ConfirmDialog from "../components/ConfirmDialog";
import "../styles/SecurityCheckVisitor.css";

const SecurityCheckVisitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [showPurposeBox, setShowPurposeBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmData, setConfirmData] = useState(null);
  const [denyReason, setDenyReason] = useState("");
  const [showReasonBox, setShowReasonBox] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const data = await fetchPendingVisitors();
      setVisitors(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch visitors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (visitor) => {
    setConfirmData({
      message: `✅ Are you sure you want to approve ${visitor.visitor_name} (ID: ${visitor.visitorId}) to enter D'summit Residence?`,
      onConfirm: async () => {
        try {
          await approveVisitor(visitor._id);
          setConfirmData(null);
          fetchPending();
        } catch (err) {
          console.error("❌ Approval failed:", err);
        }
      },
      onCancel: () => setConfirmData(null),
    });
  };

  const handleDeny = (visitor) => {
    setShowReasonBox(visitor);
  };

  const confirmDeny = async () => {
    if (!denyReason.trim()) return alert("Please enter a reason.");
    try {
      await denyVisitor(showReasonBox._id, denyReason);
      setShowReasonBox(false);
      setDenyReason("");
      fetchPending();
    } catch (err) {
      console.error("❌ Deny failed:", err);
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
            {filtered.map((v, i) => (
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
                    onClick={() => handleApprove(v)}
                  >
                    Approve
                  </button>
                  <button className="btn-deny" onClick={() => handleDeny(v)}>
                    Deny
                  </button>
                </td>
              </tr>
            ))}
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

      {confirmData && (
        <ConfirmDialog
          message={confirmData.message}
          onCancel={confirmData.onCancel}
          onConfirm={confirmData.onConfirm}
        />
      )}

      {showReasonBox && (
        <div className="popup-overlay">
          <div className="popup-card">
            <p>
              ❌ Enter reason to deny {showReasonBox.visitor_name} (ID:{" "}
              {showReasonBox.visitorId})
            </p>
            <textarea
              rows="3"
              placeholder="Please enter reason..."
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
            ></textarea>
            <div className="confirm-dialog-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowReasonBox(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmDeny}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityCheckVisitor;
