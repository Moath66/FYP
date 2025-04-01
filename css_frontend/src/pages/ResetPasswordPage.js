import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ForgotPasswordPage.css";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        code,
        newPassword,
      });

      toast.success(res.data.message || "✅ Password reset successfully!");

      // ✅ Redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Reset failed");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Reset Password</h2>
      <form onSubmit={handleReset} className="login-form">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="text"
          placeholder="Enter 6-digit OTP code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
