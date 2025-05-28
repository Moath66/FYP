import React, { useEffect, useState } from "react";
import "../styles/SecurityCheckVisitor.css";
import {
  fetchAllVisitorsForSecurity,
  approveVisitor,
  denyVisitor,
} from "../api/visitorApis";
import ConfirmDialog from "../components/ConfirmDialog";

const SecurityCheckVisitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [showPurposeBox, setShowPurposeBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmData, setConfirmData] = useState(null);
  const [denyData, setDenyData] = useState(null);
  const [reasonText, setReasonText] = useState("");

  const loadVisitors = async () => {
    try {
      setLoading(true);
      const data = await fetchAllVisitorsForSecurity();
      setVisitors(data);
    } catch (err) {
      setError("Failed to fetch visitors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleApprove = async (visitor) => {
    setConfirmData({
      message: `✅ Are you sure you want to approve ${visitor.visitor_name} with (ID: ${visitor.visitorId}) to enter D'summit Residence?`,
      onConfirm: async () => {
        try {
          await approveVisitor(visitor._id);
          setConfirmData(null);
          loadVisitors();
        } catch (err) {
          alert("Approval failed.");
        }
      },
    });
  };

  const handleDeny = (visitor) => {
    setDenyData(visitor);
  };

  const submitDenial = async () => {
    try {
      await denyVisitor(denyData._id, reasonText);
      setDenyData(null);
      setReasonText("");
      loadVisitors();
    } catch (err) {
      alert("Denial failed.");
    }
  };

  const filtered = Array.isArray(visitors)
    ? visitors.filter((v) =>
        v.visitor_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
              <th>Passport No</th>
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
                  <td>{v.passport_number || "-"}</td>
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
                    {v.status === "pending" ? (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(v)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-deny"
                          onClick={() => handleDeny(v)}
                        >
                          Deny
                        </button>
                      </>
                    ) : (
                      <span className="completed-status">✅ Completed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", color: "gray" }}>
                  No visitors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Purpose Pop-up */}
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

      {/* Confirm Approve Dialog */}
      {confirmData && (
        <ConfirmDialog
          message={confirmData.message}
          onCancel={() => setConfirmData(null)}
          onConfirm={confirmData.onConfirm}
        />
      )}

      {/* Deny Reason Dialog */}
      {denyData && (
        <div className="popup-overlay">
          <div className="popup-card">
            <p>
              ❌ Enter reason to deny <b>{denyData.visitor_name}</b> with (ID:{" "}
              <b>{denyData.visitorId}</b>)
            </p>
            <textarea
              rows="4"
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Please enter the reason..."
            ></textarea>
            <div className="confirm-dialog-buttons">
              <button className="cancel-btn" onClick={() => setDenyData(null)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={submitDenial}>
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
