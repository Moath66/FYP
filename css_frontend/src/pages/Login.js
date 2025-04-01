import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
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
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        identifier,
        password,
      });

      const user = res.data.user;
      console.log("✅ Login response user:", user);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

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

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Enter email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* ✅ Forgot Password Link */}
      <p
        className="forgot-password-link"
        onClick={() => navigate("/forgot-password")}
        style={{
          marginTop: "10px",
          color: "#007bff",
          cursor: "pointer",
          textAlign: "center",
          textDecoration: "underline",
        }}
      >
        Forgot Password?
      </p>
    </div>
  );
};

export default Login;
