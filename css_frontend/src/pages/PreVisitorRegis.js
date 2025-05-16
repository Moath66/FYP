import React, { useState } from "react";
import { registerVisitor } from "../api/userApis/visitorApis";
import "../styles/PreVisitorRegis.css";

const PreVisitorRegis = () => {
  const [formData, setFormData] = useState({
    visitor_name: "",
    phone_number: "",
    purpose: "",
    date: "",
    email: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerVisitor(formData, localStorage.getItem("token"));
      setSuccessMsg("Form submitted successfully");
      setFormData({
        visitor_name: "",
        phone_number: "",
        purpose: "",
        date: "",
        email: "",
      });
    } catch (err) {
      console.error("❌ Submission failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="visitor-form-container">
      <h2 className="form-title">🚪 Pre-Visitor Registration Form</h2>

      {successMsg && (
        <div className="success-box">
          <p>{successMsg}</p>
          <button onClick={() => setSuccessMsg("")}>OK</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="visitor-form">
        <label>Visitor Name</label>
        <input
          type="text"
          name="visitor_name"
          value={formData.visitor_name}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />

        <label>Purpose of Visit</label>
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          Register Visitor
        </button>
      </form>
    </div>
  );
};

export default PreVisitorRegis;
