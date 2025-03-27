import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // 👈 External stylesheet

const Login = () => {
  const [email, setEmail] = useState("");
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
        email,
        password,
      });

      // ✅ Store token and role in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      alert("✅ Login successful!");

      // ✅ Redirect based on user role
      switch (res.data.user.role) {
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
    </div>
  );
};

export default Login;
