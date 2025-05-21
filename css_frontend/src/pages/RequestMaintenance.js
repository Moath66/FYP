import React, { useState } from "react";
import "../styles/RequestMaintenance.css";
import { submitMaintenance } from "../api/maintenanceApis"; // You'll create this

const RequestMaintenance = () => {
  const [formData, setFormData] = useState({
    eq_type: "",
    eq_age: "",
    usage_pattern: "",
    environment_condition: "",
    description: "",
    last_maintenance_date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitMaintenance(formData);
      alert("Maintenance request submitted successfully!");
      setFormData({
        eq_type: "",
        eq_age: "",
        usage_pattern: "",
        environment_condition: "",
        description: "",
        last_maintenance_date: "",
      });
    } catch (err) {
      alert("Failed to submit request.");
    }
  };

  return (
    <div className="maintenance-form-container">
      <h2>🛠️ Maintenance Request Form</h2>
      <form className="maintenance-form" onSubmit={handleSubmit}>
        <label>Equipment Type</label>
        <input
          name="eq_type"
          value={formData.eq_type}
          onChange={handleChange}
          required
        />

        <label>Equipment Age</label>
        <input
          name="eq_age"
          value={formData.eq_age}
          onChange={handleChange}
          required
        />

        <label>Usage Pattern</label>
        <input
          name="usage_pattern"
          value={formData.usage_pattern}
          onChange={handleChange}
          required
        />

        <label>Environmental Condition</label>
        <input
          name="environment_condition"
          value={formData.environment_condition}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Last Maintenance Date</label>
        <input
          type="date"
          name="last_maintenance_date"
          value={formData.last_maintenance_date}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestMaintenance;
