import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );

      toast.success(res.data.message || "✅ Reset code sent to your email!");
      navigate("/reset-password");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error sending reset code");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Reset Your Password</h2>
      <form onSubmit={handleReset} className="login-form">
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">
          Send Reset Code
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
