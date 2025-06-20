import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser, deleteUser } from "../api/userApi";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ManageProfilePage.css";
import ConfirmDialog from "../components/ConfirmDialog";

const ManageProfilePage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phoneNo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) throw new Error("Missing user ID");

        const data = await getUserById(userId);
        setFormData({
          userName: data.userName || "",
          email: data.email || "",
          password: "********", // for display only
          phoneNo: data.phoneNo || "",
        });
      } catch (err) {
        toast.error("❌ Failed to load user data");
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async () => {
    try {
      const { password, ...safeData } = formData;
      await updateUser(userId, safeData);
      toast.success("✅ Profile updated successfully");
    } catch (error) {
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
      toast.error("❌ Failed to delete account");
    }
  };

  return (
    <div className="manage-profile-container">
      <header className="dashboard-header">
        <h1>Manage Profile</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Back to Dashboard
        </button>
      </header>

      <form className="profile-form">
        <label>User Name</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Enter name"
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />

        <label>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            readOnly
            style={{ paddingRight: "30px" }}
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
          placeholder="Enter phone number"
        />

        <div className="profile-buttons-container">
          <button type="button" className="edit-btn" onClick={handleEdit}>
            Update
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
          message="Are you sure you want to delete your account?"
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default ManageProfilePage;
