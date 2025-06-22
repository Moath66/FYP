"use client";

import { useEffect, useState } from "react";
import "../styles/SecurityCheckVisitor.css"; // Import the new CSS file

// Import your existing API functions and ConfirmDialog
import {
  fetchAllVisitorsForSecurity,
  approveVisitor,
  denyVisitor,
} from "../api/visitorApis";
import ConfirmDialog from "../components/ConfirmDialog";

// Lucide React icons (ensure lucide-react is installed)
import {
  Search,
  Book,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

const SecurityCheckVisitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [showPurposeBox, setShowPurposeBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmData, setConfirmData] = useState(null); // Used for approve confirmation
  const [denyData, setDenyData] = useState(null); // Used for deny reason input
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
    <div className="security-page-container">
      <div className="security-card">
        <div className="security-card-header">
          <h2 className="security-card-title">
            <Book className="h-7 w-7" />
            Check Visitors
          </h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ⬅ Back to Dashboard
          </button>
        </div>
        <div className="security-card-content">
          <div className="search-input-wrapper">
            <Search />
            <input
              type="text"
              placeholder="Search by visitor name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loading-message">Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="table-wrapper">
              <table className="security-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-head">#</th>
                    <th className="table-head">Visitor ID</th>
                    <th className="table-head">Visitor Name</th>
                    <th className="table-head">Passport No</th>
                    <th className="table-head">Purpose</th>
                    <th className="table-head">Phone</th>
                    <th className="table-head">Email</th>
                    <th className="table-head">Date</th>
                    <th className="table-head">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    [...filtered]
                      .sort((a, b) => a.visitorId.localeCompare(b.visitorId))
                      .map((v, i) => (
                        <tr key={v._id} className="table-row">
                          <td className="table-cell">{i + 1}</td>
                          <td className="table-cell font-medium">
                            {v.visitorId}
                          </td>
                          <td className="table-cell">{v.visitor_name}</td>
                          <td className="table-cell text-gray-500">
                            {v.passport_number || "-"}
                          </td>
                          <td className="table-cell">
                            <button
                              type="button"
                              className="btn-details"
                              onClick={() => {
                                setSelectedPurpose(
                                  v.purpose || "No details provided."
                                );
                                setShowPurposeBox(true);
                              }}
                            >
                              <Info />
                              Details
                            </button>
                          </td>
                          <td className="table-cell">{v.phone_number}</td>
                          <td className="table-cell">{v.email}</td>
                          <td className="table-cell">
                            {new Date(v.date).toLocaleDateString()}
                          </td>
                          <td className="table-cell">
                            {v.status === "pending" ? (
                              <div className="action-buttons-container">
                                <button
                                  type="button"
                                  className="btn-approve"
                                  onClick={() => handleApprove(v)}
                                >
                                  <CheckCircle />
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  className="btn-deny"
                                  onClick={() => handleDeny(v)}
                                >
                                  <XCircle />
                                  Deny
                                </button>
                              </div>
                            ) : (
                              <span className="status-completed-badge">
                                <CheckCircle />
                                Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="no-visitors-message">
                        No visitors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Purpose Pop-up (Custom Modal) */}
      {showPurposeBox && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title purpose-modal-title">
                Purpose of Visit
              </h3>
              <p className="modal-description">
                Details about the visitor's reason for their visit.
              </p>
            </div>
            <div className="modal-body">
              <p>{selectedPurpose}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowPurposeBox(false)}
                className="purpose-modal-close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Approve Dialog (Your existing ConfirmDialog component) */}
      {confirmData && (
        <ConfirmDialog
          message={confirmData.message}
          onCancel={() => setConfirmData(null)}
          onConfirm={confirmData.onConfirm}
        />
      )}

      {/* Deny Reason Dialog (Custom Modal) */}
      {denyData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title deny-modal-title">Deny Visitor</h3>
              <p className="modal-description">
                <XCircle />
                Enter reason to deny <b>{denyData?.visitor_name}</b> (ID:{" "}
                <b>{denyData?.visitorId}</b>)
              </p>
            </div>
            <div className="modal-body">
              <textarea
                rows="4"
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Please enter the reason..."
                className="deny-modal-textarea"
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setDenyData(null)}
                className="deny-modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitDenial}
                className="deny-modal-confirm-btn"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityCheckVisitor;
