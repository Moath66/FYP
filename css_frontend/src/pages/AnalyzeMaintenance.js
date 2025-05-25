import React, { useEffect, useState } from "react";
import "../styles/AnalyzeMaintenance.css";
import {
  getAllMaintenance,
  updateMaintenanceStatus,
} from "../api/maintenanceApis";

const AnalyzeMaintenance = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getAllMaintenance();
      setMaintenanceList(data);
    } catch (error) {
      console.error("Error fetching maintenance data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await updateMaintenanceStatus(id, action);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // e.g. 5/26/2025
  };

  const renderActionButton = (item) => {
    if (item.status === "Completed") {
      return <span className="badge green">Completed</span>;
    }

    return (
      <div className="action-buttons">
        <button
          onClick={() => handleAction(item._id, "replace")}
          className="badge orange"
        >
          Replace
        </button>
        <button
          onClick={() => handleAction(item._id, "checking")}
          className="badge yellow"
        >
          Checking
        </button>
        <button
          onClick={() => handleAction(item._id, "no_checking")}
          className="badge green"
        >
          No Checking
        </button>
      </div>
    );
  };

  return (
    <div className="analyze-container">
      <h2>📋 Analyze Maintenance</h2>
      <table className="analyze-table">
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Equipment Name</th>
            <th>Eq_Age</th>
            <th>Environmental Condition</th>
            <th>Usage Pattern</th>
            <th>Last Check Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceList.map((item) => (
            <tr key={item._id}>
              <td>{item.equipment_id || "N/A"}</td>
              <td>{item.eq_type}</td>
              <td>{item.eq_age}</td>
              <td>{item.environment_condition}</td>
              <td>{item.usage_pattern}</td>
              <td>{formatDate(item.last_maintenance_date)}</td>
              <td>{renderActionButton(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyzeMaintenance;
