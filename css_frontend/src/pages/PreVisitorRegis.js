"use client";

import { useState } from "react";
import { registerVisitor } from "../api/visitorApis"; // Keep your existing API import
import "../styles/PreVisitorRegis.css"; // Ensure this path is correct
import { FaArrowLeft, FaDoorOpen } from "react-icons/fa"; // Using react-icons/fa for icons
import { toast } from "react-toastify"; // Using react-toastify for notifications
import { useNavigate } from "react-router-dom"; // For navigation

const PreVisitorRegis = () => {
  const [formData, setFormData] = useState({
    visitor_name: "",
    phone_number: "",
    passport_number: "",
    purpose: "",
    date: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerVisitor(formData);
      toast.success("✅ Visitor registered successfully.");
      setFormData({
        visitor_name: "",
        phone_number: "",
        passport_number: "",
        purpose: "",
        date: "",
        email: "",
      });
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        navigate("/resident/dashboard");
      }, 1500); // Short delay for toast to be visible
    } catch (err) {
      console.error("❌ Submission failed:", err.response?.data || err.message);
      toast.error("❌ Failed to register visitor.");
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
            <FaDoorOpen className="lost-card-icon" /> Pre-Visitor Registration
            Form
          </h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            {" "}
            {/* Reusing back-btn styling */}
            <FaArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </button>
        </header>
        <form onSubmit={handleSubmit} className="lost-form">
          {" "}
          {/* Reusing form styling */}
          <div className="form-group">
            <label htmlFor="visitor_name">Visitor Name</label>
            <input
              type="text"
              id="visitor_name"
              name="visitor_name"
              value={formData.visitor_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passport_number">Passport Number</label>
            <input
              type="text"
              id="passport_number"
              name="passport_number"
              value={formData.passport_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="purpose">Purpose of Visit</label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register Visitor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PreVisitorRegis;
