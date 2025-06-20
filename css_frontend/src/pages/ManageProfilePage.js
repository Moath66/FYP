"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser, deleteUser } from "../api/userApi";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ManageProfilePage.css"; // Ensure this path is correct
import ConfirmDialog from "../components/ConfirmDialog"; // Assuming this component exists and is styled via ManageProfilePage.css modal styles

const ManageProfilePage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser?.userId;

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phoneNo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (!userId) {
          toast.error("Missing user ID. Please log in.");
          navigate("/login");
          return;
        }

        const data = await getUserById(userId);
        setFormData({
          userName: data.userName || "",
          email: data.email || "",
          password: "********", // for display only
          phoneNo: data.phoneNo || "",
        });
      } catch (err) {
        console.error("Failed to load user data:", err);
        toast.error("❌ Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async () => {
    try {
      // Only send updatable fields, not the display password
      const { password, ...safeData } = formData;
      await updateUser(userId, safeData);
      toast.success("✅ Profile updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("❌ Update failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userId, formData.userName);
      toast.success("✅ Account deleted. Logging out...");
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("❌ Failed to delete account");
    } finally {
      setShowConfirmDialog(false); // Close dialog regardless of success/failure
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="manage-profile-container">
        <header className="profile-header">
          <h1>Manage Profile</h1>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ⬅ Back to Dashboard
          </button>
        </header>

        <form className="profile-form">
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter name"
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            disabled // Email usually not editable from profile
          />

          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              readOnly
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="password-toggle-icon"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label htmlFor="phoneNo">Phone Number</label>
          <input
            type="text"
            id="phoneNo"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="Enter phone number"
          />

          <div className="profile-buttons-container">
            <button type="button" className="update-btn" onClick={handleEdit}>
              Update Profile
            </button>
            <button
              type="button"
              className="delete-btn"
              onClick={() => setShowConfirmDialog(true)}
            >
              Delete Account
            </button>
          </div>
        </form>

        {showConfirmDialog && (
          <ConfirmDialog
            message="Are you sure you want to delete your account? This action cannot be undone."
            onCancel={() => setShowConfirmDialog(false)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ManageProfilePage;
