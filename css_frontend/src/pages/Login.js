import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"; // Make sure to use the new CSS file

// Inline SVG icons for use in the component
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

const Login = () => {
  // --- All your existing state and logic remains unchanged ---
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        {
          identifier,
          password,
        },
        { withCredentials: true }
      );

      const user = res.data.user;
      console.log("✅ Login response user:", user);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);

      alert("✅ Login successful!");

      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "resident":
          navigate("/resident/dashboard");
          break;
        case "security":
          navigate("/security/dashboard");
          break;
        case "staff":
          navigate("/staff/dashboard");
          break;
        default:
          navigate("/user/profile");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };
  // --- End of unchanged logic ---

  return (
    <div className="login-page-container">
      <div className="branding-section">
        <div className="branding-content">
          <div className="logo-container">
            <span className="logo-text">CSS</span>
          </div>
          <h1 className="branding-title">Community Services System</h1>
          <p className="branding-description">
            A comprehensive platform for managing community services and
            resources efficiently.
          </p>
          <div className="branding-features">
            <p>✓ Lost & Found Management</p>
            <p>✓ Visitor Registration</p>
            <p>✓ Maintenance Requests</p>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">
            Please sign in to access your account.
          </p>

          {error && <p className="login-error-message">{error}</p>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="identifier">Email or Username</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            </div>

            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <p className="signup-link">
            Need help? <Link to="/contact">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
