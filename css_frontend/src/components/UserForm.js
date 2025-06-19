import React, { useState, useEffect } from "react";
import { createUser, updateUser } from "../api/userApi";

const UserForm = ({
  onClose,
  onUserAdded,
  isEdit = false,
  existingUser = null,
}) => {
  const [formData, setFormData] = useState({
    userName: "",
    phoneNo: "",
    email: "",
    password: "",
    role: "resident",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && existingUser) {
      setFormData({
        userName: existingUser.userName,
        phoneNo: existingUser.phoneNo || "",
        email: existingUser.email,
        password: "", // Passwords shouldn't be editable here
        role: existingUser.role,
      });
    }
  }, [isEdit, existingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.userName ||
      !formData.phoneNo ||
      !formData.email ||
      (!isEdit && !formData.password)
    ) {
      setError("All fields are required!");
      return;
    }

    try {
      if (isEdit && existingUser) {
        await updateUser(existingUser.userId, formData);
      } else {
        await createUser(formData);
      }

      onUserAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? "✏️ Edit User" : "➕ Add New User"}</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form className="user-form" onSubmit={handleSubmit}>
          <label>User Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
            disabled={isEdit}
          />

          {!isEdit && (
            <>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </>
          )}

          <label>User Role</label>
          <div className="radio-group">
            {["resident", "staff", "security"].map((roleOption) => (
              <label key={roleOption}>
                <input
                  type="radio"
                  name="role"
                  value={roleOption}
                  checked={formData.role === roleOption}
                  onChange={handleChange}
                />
                {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
              </label>
            ))}
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="add-btn">
              {isEdit ? "Confirm" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
