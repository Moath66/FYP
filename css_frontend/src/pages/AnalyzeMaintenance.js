"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ClipboardList,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Info,
  RotateCcw,
} from "lucide-react"; // Using Lucide React icons
import "../styles/AnalyzeMaintenance.css"; // Import the new CSS file

// IMPORTANT: These imports are from your existing backend integration.
// I will NOT modify these or provide placeholder functions.
import {
  getAllMaintenance,
  updateMaintenanceStatus,
} from "../api/maintenanceApis";

const AnalyzeMaintenance = () => {
  const navigate = useNavigate();
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllMaintenance();
      setMaintenanceList(data);
    } catch (error) {
      console.error("Error fetching maintenance data:", error);
      setError("Failed to fetch maintenance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await updateMaintenanceStatus(id, action);
      fetchData(); // Re-fetch data to update the list
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredAndSortedList = Array.isArray(maintenanceList)
    ? [...maintenanceList]
        .filter(
          (item) =>
            item.eq_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.equipment_id?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.equipment_id.localeCompare(b.equipment_id)) // Sort by Equipment ID
    : [];

  return (
    <div className="security-page-container">
      <div className="security-card">
        <div className="security-card-header">
          <h2 className="security-card-title">
            <ClipboardList className="h-7 w-7" />
            Analyze Maintenance
          </h2>
          <button
            type="button"
            className="back-to-dashboard-button"
            onClick={() => navigate("/staff/dashboard")} // Navigate to staff dashboard
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
        <div className="security-card-content">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search by equipment name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loading-message">Loading maintenance data...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="table-wrapper">
              <table className="maintenance-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-head">#</th>
                    <th className="table-head">Equipment ID</th>
                    <th className="table-head">Equipment Name</th>
                    <th className="table-head">Eq. Age</th>
                    <th className="table-head">Environmental Condition</th>
                    <th className="table-head">Usage Pattern</th>
                    <th className="table-head">Last Check Date</th>
                    <th className="table-head">Description</th>
                    <th className="table-head">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedList.length > 0 ? (
                    filteredAndSortedList.map((item, index) => (
                      <tr key={item._id} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell font-medium">
                          {item.equipment_id || "N/A"}
                        </td>
                        <td className="table-cell">{item.eq_type}</td>
                        <td className="table-cell">{item.eq_age}</td>
                        <td className="table-cell">
                          {item.environment_condition}
                        </td>
                        <td className="table-cell">{item.usage_pattern}</td>
                        <td className="table-cell">
                          {formatDate(item.last_maintenance_date)}
                        </td>
                        <td className="table-cell">
                          <button
                            type="button"
                            className="btn-details"
                            onClick={() => {
                              setSelectedDescription(
                                item.description || "No description provided."
                              );
                              setShowDescriptionModal(true);
                            }}
                          >
                            <Info className="mr-1 h-4 w-4" />
                            Details
                          </button>
                        </td>
                        <td className="table-cell">
                          {item.status === "Completed" ? (
                            <span className="status-badge completed">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Completed
                            </span>
                          ) : (
                            <div className="action-buttons-container">
                              <button
                                type="button"
                                className="btn-action btn-replace"
                                onClick={() =>
                                  handleAction(item._id, "replace")
                                }
                              >
                                <RotateCcw className="mr-1 h-4 w-4" />
                                Replace
                              </button>
                              <button
                                type="button"
                                className="btn-action btn-checking"
                                onClick={() =>
                                  handleAction(item._id, "checking")
                                }
                              >
                                <Search className="mr-1 h-4 w-4" />
                                Checking
                              </button>
                              <button
                                type="button"
                                className="btn-action btn-no-checking"
                                onClick={() =>
                                  handleAction(item._id, "no_checking")
                                }
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                No Checking
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="no-items-message">
                        No maintenance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Description Pop-up (Custom Modal) */}
      {showDescriptionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title purpose-modal-title">Description</h3>
              <p className="modal-description">
                Details about the maintenance record.
              </p>
            </div>
            <div className="modal-body">
              <p>{selectedDescription}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowDescriptionModal(false)}
                className="purpose-modal-close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzeMaintenance;
