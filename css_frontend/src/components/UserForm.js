"use client"

import { useState, useEffect } from "react"
import { createUser, updateUser } from "../api/userApi" // Import the API functions
import "./UserForm.css" // Dedicated CSS for UserForm

const UserForm = ({ onClose, onUserAddedOrUpdated, isEdit = false, existingUser = null }) => {
  const [formData, setFormData] = useState({
    userName: "",
    phoneNo: "",
    email: "",
    password: "",
    role: "resident", // Default role
    userId: "", // For editing
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit && existingUser) {
      setFormData({
        userName: existingUser.userName || "",
        phoneNo: existingUser.phoneNo || "",
        email: existingUser.email || "",
        password: "", // Password should generally not be pre-filled for edit
        role: existingUser.role || "resident",
        userId: existingUser.userId || existingUser._id || "", // Handle both userId and _id
      })
    } else {
      // Reset for add new user
      setFormData({ userName: "", phoneNo: "", email: "", password: "", role: "resident", userId: "" })
    }
  }, [isEdit, existingUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.userName || !formData.phoneNo || !formData.email || (!isEdit && !formData.password)) {
      setError("All fields marked with * are required.")
      setLoading(false)
      return
    }
    if (formData.phoneNo && !/^\d{10,15}$/.test(formData.phoneNo)) {
      setError("Please enter a valid phone number (10-15 digits).")
      setLoading(false)
      return
    }

    try {
      if (isEdit && existingUser) {
        // Use existingUser.userId or existingUser._id as the identifier for the update API call
        await updateUser(existingUser.userId || existingUser._id, formData)
      } else {
        await createUser(formData)
      }

      onUserAddedOrUpdated() // This prop should handle toast & refresh
      onClose() // Close the modal on success
    } catch (err) {
      console.error("Form submission error:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay user-form-overlay">
      <div className="modal-content user-form-modal-content">
        <div className="modal-header">
          <h2>{isEdit ? "Edit User Details" : "Add New User"}</h2>
          <button className="modal-close-button" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        {error && <p className="form-error-message">{error}</p>}

        <form className="user-form-fields" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">User Name *</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNo">Phone Number *</label>
            <input
              type="tel"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder="e.g., 1234567890"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              disabled={isEdit} // Email usually not editable
            />
            {isEdit && <small className="form-hint">Email cannot be changed for existing users.</small>}
          </div>

          {!isEdit && (
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>User Role *</label>
            <div className="role-radio-group">
              {["resident", "staff", "security"].map((roleOption) => (
                <label key={roleOption} className="radio-label">
                  <input
                    type="radio"
                    name="role"
                    value={roleOption}
                    checked={formData.role === roleOption}
                    onChange={handleChange}
                  />
                  <span className="radio-text">{roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="button-cancel">
              Cancel
            </button>
            <button type="submit" className="button-submit" disabled={loading}>
              {loading ? (isEdit ? "Updating..." : "Adding...") : isEdit ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm
