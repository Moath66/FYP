import React, { useState } from "react";
import { createUser } from "../api/userApi";

const UserForm = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    userName: "",
    phoneNo: "",
    email: "",
    password: "",
    role: "resident", // Default to Resident
  });

  const [error, setError] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // ✅ Ensuring previous data is maintained
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    console.log("Submitting User Data:", formData); // ✅ Check what's being sent
  
    // Validate required fields
    if (!formData.userName || !formData.phoneNo || !formData.email || !formData.password || !formData.role) {
      setError("All fields are required!");
      console.error("Error: Missing fields", formData);
      return;
    }
  
    try {
      await createUser(formData);
      onUserAdded(); // Refresh the user list in AdminManageUsers
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user. Try again.");
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>➕ ADD NEW USER</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form className="user-form" onSubmit={handleSubmit}>
          <label>userName</label>
          <input
            type="text"
            name="userName"
            placeholder="Enter userName"
            value={formData.userName} 
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            placeholder="Enter Phone Number"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>User Account Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="resident"
                checked={formData.role === "resident"}
                onChange={handleChange}
              /> Resident
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="staff"
                checked={formData.role === "staff"}
                onChange={handleChange}
              /> Staff
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="security"
                checked={formData.role === "security"}
                onChange={handleChange}
              /> Security
            </label>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="add-btn">Add User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
