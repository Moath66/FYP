import React, { useEffect, useState } from "react";
import "../styles/TrackingMaintenanceApp.css";
import { getMaintenanceByResident } from "../api/maintenanceApis";

const TrackingMaintenanceApp = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const data = await getMaintenanceByResident(user._id);
      setMaintenanceList(data);
    } catch (error) {
      console.error("Error fetching maintenance data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusBadge = (action, status) => {
    if (status !== "Completed")
      return <span className="badge pending">Pending</span>;

    switch (action) {
      case "replace":
        return <span className="badge orange">Replacement Required</span>;
      case "checking":
        return <span className="badge yellow">Maintenance Scheduled</span>;
      case "no_checking":
        return <span className="badge green">Good</span>;
      default:
        return <span className="badge pending">Pending</span>;
    }
  };

  return (
    <div className="tracking-container">
      <h2>🧰 Tracking Maintenance Application</h2>
      <table className="tracking-table">
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Equipment Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceList.map((item) => (
            <tr key={item._id}>
              <td>{item.equipment_id || "N/A"}</td>
              <td>{item.eq_type}</td>
              <td>{getStatusBadge(item.staffAction, item.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingMaintenanceApp;
