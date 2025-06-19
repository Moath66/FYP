"use client"
import { Link, useNavigate } from "react-router-dom"
import {
  FaHome,
  FaUserEdit,
  FaClipboardList,
  FaSearch,
  FaUserPlus,
  FaTools,
  FaHistory,
  FaWrench,
  FaAddressCard,
  FaSignOutAlt,
} from "react-icons/fa"
import "../styles/ResidentSidebar.css" // New CSS for the sidebar

const ResidentSidebar = () => {
  const navigate = useNavigate()
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
  const userName = storedUser?.userName || "Resident"

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    navigate("/login")
  }

  return (
    <aside className="resident-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">CSS</span>
        <h1 className="sidebar-title">Resident Panel</h1>
      </div>
      <nav className="sidebar-nav">
        <Link to="/resident/dashboard" className="nav-item active">
          <FaHome /> Dashboard
        </Link>
        <Link to="/resident/profile" className="nav-item">
          <FaUserEdit /> Manage Profile
        </Link>
        <div className="sidebar-separator"></div> {/* Separator */}
        <span className="sidebar-group-label">Quick Actions</span>
        <Link to="/report-lost-item" className="nav-item">
          <FaClipboardList /> Report Lost Item
        </Link>
        <Link to="/report-found-item" className="nav-item">
          <FaSearch /> Report Found Item
        </Link>
        <Link to="/pre-register-visitor" className="nav-item">
          <FaUserPlus /> Pre-Register Visitor
        </Link>
        <Link to="/request-maintenance" className="nav-item">
          <FaTools /> Request Maintenance
        </Link>
        <div className="sidebar-separator"></div> {/* Separator */}
        <span className="sidebar-group-label">Tracking</span>
        <Link to="/track-item" className="nav-item">
          <FaHistory /> Track Item App.
        </Link>
        <Link to="/track-maintenance" className="nav-item">
          <FaWrench /> Track Maint. App.
        </Link>
        <Link to="/track-visitor" className="nav-item">
          <FaAddressCard /> Track Visitor App.
        </Link>
      </nav>
      <button onClick={handleLogout} className="sidebar-logout-button">
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  )
}

export default ResidentSidebar
