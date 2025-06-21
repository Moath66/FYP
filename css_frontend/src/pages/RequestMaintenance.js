"use client";

import { useState } from "react";
import "../styles/RequestMaintenance.css"; // Ensure this path is correct
import { submitMaintenance } from "../api/maintenanceApis"; // Keep your existing API import
import { FaArrowLeft, FaTools } from "react-icons/fa"; // Using react-icons/fa for icons
import { toast } from "react-toastify"; // Using react-toastify for notifications
import { useNavigate } from "react-router-dom"; // For navigation

const RequestMaintenance = () => {
  const [formData, setFormData] = useState({
    eq_type: "",
    eq_age: "",
    usage_pattern: "",
    environment_condition: "",
    description: "",
    last_maintenance_date: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitMaintenance(formData);
      toast.success("✅ Maintenance request submitted successfully!");
      setFormData({
        eq_type: "",
        eq_age: "",
        usage_pattern: "",
        environment_condition: "",
        description: "",
        last_maintenance_date: "",
      });
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        navigate("/resident/dashboard");
      }, 1500); // Short delay for toast to be visible
    } catch (err) {
      console.error("❌ Submission error:", err.response?.data || err.message);
      toast.error("❌ Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lost-page-wrapper">
      {" "}
      {/* Reusing wrapper for centering */}
      <div className="lost-card">
        {" "}
        {/* Reusing card styling */}
        <header className="profile-header">
          {" "}
          {/* Reusing header styling */}
          <h2 className="lost-card-title">
            <FaTools className="lost-card-icon" /> Maintenance Request Form
          </h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            {" "}
            {/* Reusing back-btn styling */}
            <FaArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </button>
        </header>
        <form className="lost-form" onSubmit={handleSubmit}>
          {" "}
          {/* Reusing form styling */}
          <div className="form-group">
            <label htmlFor="eq_type">Equipment Name</label>
            <input
              type="text"
              id="eq_type"
              name="eq_type"
              value={formData.eq_type}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eq_age">Equipment Age</label>
            <select
              id="eq_age"
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
          </div>
          <div className="form-group">
            <label htmlFor="usage_pattern">Usage Pattern</label>
            <select
              id="usage_pattern"
              name="usage_pattern"
              value={formData.usage_pattern}
              onChange={handleChange}
              required
            >
              <option value="">Select Pattern</option>
              <option value="Economic">Economic</option>
              <option value="Continuous">Continuous</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="environment_condition">
              Environmental Condition
            </label>
            <select
              id="environment_condition"
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
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_maintenance_date">Last Maintenance Date</label>
            <input
              type="date"
              id="last_maintenance_date"
              name="last_maintenance_date"
              value={formData.last_maintenance_date}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestMaintenance;
