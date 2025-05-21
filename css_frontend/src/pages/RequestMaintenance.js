import React, { useState } from "react";
import "../styles/RequestMaintenance.css";
import { submitMaintenance } from "../api/maintenanceApis";

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
        <label>Equipment Name</label>
        <input
          name="eq_type"
          value={formData.eq_type}
          onChange={handleChange}
          required
        />

        <label>Equipment Age</label>
        <select
          name="eq_age"
          value={formData.eq_age}
          onChange={handleChange}
          required
        >
          <option value="">Select Age</option>
          <option value="2 months">2 months</option>
          <option value="6 months">6 months</option>
          <option value="1 year">1 year</option>
          <option value="3 years">3 years</option>
          <option value="4 years">4 years</option>
        </select>

        <label>Usage Pattern</label>
        <select
          name="usage_pattern"
          value={formData.usage_pattern}
          onChange={handleChange}
          required
        >
          <option value="">Select Pattern</option>
          <option value="Economic">Economic</option>
          <option value="Continuous">Continuous</option>
        </select>

        <label>Environmental Condition</label>
        <select
          name="environment_condition"
          value={formData.environment_condition}
          onChange={handleChange}
          required
        >
          <option value="">Select Condition</option>
          <option value="Humidity">Humidity</option>
          <option value="Temperature">Temperature</option>
          <option value="Pressure">Pressure</option>
          <option value="Vibration">Vibration</option>
          <option value="Noise">Noise</option>
          <option value="Echo">Echo</option>
        </select>

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
