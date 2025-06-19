"use client";

import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ResetPasswordPage.css"; // New CSS file for this page

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

const LockIcon = () => (
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
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CodeIcon = () => (
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
    <path d="M10 13l-4 4l4 4" />
    <path d="M14 5l4 4l-4 4" />
    <path d="M20 20h-4" />
    <path d="M4 4h4" />
    <path d="M16 4h4" />
    <path d="M4 20h4" />
  </svg>
);

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/reset-password`,
        {
          email,
          code,
          newPassword,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message || "✅ Password reset successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "❌ Reset failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page-container">
      <div className="reset-password-card">
        <h2 className="reset-password-title">Set a New Password</h2>
        <p className="reset-password-subtitle">
          Please enter your email, the 6-digit code you received, and your new
          password.
        </p>

        <form onSubmit={handleReset} className="reset-password-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <MailIcon />
              </span>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="code">Verification Code</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <CodeIcon />
              </span>
              <input
                id="code"
                type="text"
                placeholder="Enter 6-digit OTP code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="form-input"
                maxLength="6"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <LockIcon />
              </span>
              <input
                id="newPassword"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <p className="form-footer-link">
          Remembered your password?{" "}
          <Link to="/login" className="link-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
