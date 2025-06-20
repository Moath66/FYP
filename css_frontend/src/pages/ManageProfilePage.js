"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser, deleteUser } from "../api/userApi";
import { toast } from "react-toastify";
import { Eye, EyeOff, ArrowLeft } from "lucide-react"; // Changed from react-icons/fa to lucide-react
import "react-toastify/dist/ReactToastify.css";
import "../styles/ManageProfilePage.css"; // Keep this import
import ConfirmDialog from "../components/ConfirmDialog";

const ManageProfilePage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id || storedUser?.userId; // Ensure we get the MongoDB _id

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
      try {
        if (!userId) {
          toast.error("❌ User ID not found. Please log in again.");
          navigate("/login");
          return;
        }

        const data = await getUserById(userId);
        setFormData({
          userName: data.userName || "",
          email: data.email || "",
          password: "********", // for display only, never pre-fill actual password
          phoneNo: data.phoneNo || "",
        });
      } catch (err) {
        console.error("Error loading user data:", err);
        toast.error("❌ Failed to load user data. Please try again.");
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
      // Only send fields that are actually editable and not the placeholder password
      const { password, ...safeData } = formData;
      await updateUser(userId, safeData);
      toast.success("✅ Profile updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("❌ Update failed. Please try again.");
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
      toast.error("❌ Failed to delete account. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        className="manage-profile-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "var(--muted-text-color)" }}>
          Loading profile data...
        </p>
      </div>
    );
  }

  return (
    <div className="manage-profile-container">
      <header className="dashboard-header">
        <h1>Manage Profile</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} style={{ marginRight: "8px" }} /> Back to
          Dashboard
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
          disabled // Email is typically not editable
        />

        <label htmlFor="password">Password</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            readOnly
            placeholder="********"
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff /> : <Eye />}
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
          <button type="button" className="edit-btn" onClick={handleEdit}>
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
          confirmButtonText="Yes, Delete My Account" // Added explicit text
          cancelButtonText="Cancel" // Added explicit text
          title="Confirm Account Deletion" // Added title
        />
      )}
    </div>
  );
};

export default ManageProfilePage;
