"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchUsers, deleteUser } from "../api/userApi"; // Assuming these API functions exist
import UserForm from "../components/UserForm"; // Assuming this component exists
import ConfirmDialog from "../components/ConfirmDialog"; // Assuming this component exists
import "../styles/AdminManageUsers.css"; // New CSS file
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Usually imported once in App.js

// Inline SVG Icons
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);
const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const AdminManageUsers = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  // const [showFilterOptions, setShowFilterOptions] = useState(false); // Replaced by direct select
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Or any other number you prefer

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAdminName(parsedUser.name || parsedUser.username || "Admin");
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      const nonAdminUsers = data
        .filter((user) => user.role !== "admin") // Assuming admin users are not managed here
        .sort((a, b) => (a.userId || 0) - (b.userId || 0)); // Sort by userId
      setUsers(nonAdminUsers);
    } catch (error) {
      toast.error("❌ Failed to load users.");
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmDialog(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      // Assuming deleteUser API needs userId. Adjust if it needs _id or userName.
      await deleteUser(userToDelete.userId, userToDelete.userName);
      toast.success(
        `✅ User "${userToDelete.userName}" was successfully removed.`
      );
      setUserToDelete(null);
      setShowConfirmDialog(false);
      loadUsers(); // Refresh the list
    } catch (error) {
      toast.error("❌ Failed to delete user. Please try again.");
      console.error("Delete user error:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Filtered and paginated users
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((user) =>
        filterRole === "all" ? true : user.role === filterRole
      );
  }, [users, searchQuery, filterRole]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">CSS</span>
          <h1 className="sidebar-title">Admin Panel</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-item">
            <DashboardIcon /> Dashboard
          </Link>
          <Link to="/admin/manage-users" className="nav-item active">
            <UsersIcon /> Manage Users
          </Link>
        </nav>
        <button onClick={handleLogout} className="sidebar-logout-button">
          <LogoutIcon /> Logout
        </button>
      </aside>

      <main className="admin-main-content">
        <header className="main-content-header">
          <h2>User Accounts Management</h2>
          <p>
            Oversee and manage all system user accounts and their permissions.
          </p>
        </header>

        <div className="actions-toolbar">
          <div className="search-filter-controls">
            <div className="search-input-wrapper">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="search-field"
              />
            </div>
            <div className="filter-select-wrapper">
              <FilterIcon />
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                className="filter-dropdown"
              >
                <option value="all">All Roles</option>
                <option value="resident">Resident</option>
                <option value="staff">Staff</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>
          <button
            className="add-new-user-button"
            onClick={() => {
              setEditUser(null);
              setShowForm(true);
            }}
          >
            <PlusIcon /> Add New User
          </button>
        </div>

        {loading ? (
          <div className="loading-indicator">
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table-styled">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user._id || user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button
                          className="action-btn edit-action"
                          onClick={() => handleEdit(user)}
                        >
                          <EditIcon /> Edit
                        </button>
                        <button
                          className="action-btn delete-action"
                          onClick={() => confirmDeleteUser(user)}
                        >
                          <DeleteIcon /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data-message">
                      No users match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`pagination-button ${
                  currentPage === number + 1 ? "active" : ""
                }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        )}

        {showForm && (
          <UserForm
            onClose={() => setShowForm(false)}
            onUserAddedOrUpdated={() => {
              // Renamed prop for clarity
              loadUsers();
              toast.success(
                editUser
                  ? "✅ User updated successfully."
                  : "✅ User added successfully."
              );
              setShowForm(false); // Close form on success
            }}
            isEdit={!!editUser}
            existingUser={editUser}
          />
        )}

        {showConfirmDialog &&
          userToDelete && ( // Ensure userToDelete is not null
            <ConfirmDialog
              message={`Are you sure you want to delete "${userToDelete.userName}" (ID: ${userToDelete.userId})? This action cannot be undone.`}
              onCancel={() => setShowConfirmDialog(false)}
              onConfirm={handleDelete}
              confirmButtonText="Yes, Delete User"
              cancelButtonText="Cancel"
            />
          )}
      </main>
    </div>
  );
};

export default AdminManageUsers;
