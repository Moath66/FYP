"use client";

import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { toast } from "react-toastify";
import "../styles/ForgotPasswordPage.css"; // New CSS file for this page

// Inline SVG icons
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );

      toast.success(res.data.message || "✅ Reset code sent to your email!");
      navigate("/reset-password"); // Navigate to reset password page (where user enters code)
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "❌ Error sending reset code. Please check the email and try again."
      );
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="forgot-password-page-container">
      <div className="forgot-password-card">
        <Link to="/login" className="back-to-login-link">
          <ArrowLeftIcon /> Back to Login
        </Link>
        <h2 className="forgot-password-title">Reset Your Password</h2>
        <p className="forgot-password-subtitle">
          Enter the email address associated with your account, and we&apos;ll
          send you a link to reset your password.
        </p>

        <form onSubmit={handleReset} className="forgot-password-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <MailIcon />
              </span>
              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
