import React, { useState, useEffect } from "react";
import { fetchUsers, deleteUser } from "../api/userApi";
import UserForm from "../components/UserForm";
import ConfirmDialog from "../components/ConfirmDialog";
import "../styles/AdminManageUsers.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManageUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const currentAdmin = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    const nonAdminUsers = data
      .filter((user) => user.role !== "admin")
      .sort((a, b) => a.userId - b.userId);
    setUsers(nonAdminUsers);
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmDialog(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.userId, userToDelete.userName);
      toast.success(
        `✅ User "${userToDelete.userName}" was successfully removed.`
      );
      setUserToDelete(null);
      setShowConfirmDialog(false);
      loadUsers();
    } catch (error) {
      toast.error("❌ Failed to delete user. Please try again.");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  return (
    <div className="manage-users-container">
      <h1>User Accounts</h1>
      <p>Manage system users and permissions</p>

      <button
        className="add-user-btn"
        onClick={() => {
          setEditUser(null);
          setShowForm(true);
        }}
      >
        ➕ Add New User
      </button>

      <div className="search-filter-wrapper">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <button
            className="filter-toggle"
            onClick={() => setShowFilterOptions((prev) => !prev)}
          >
            <i className="bi bi-funnel-fill"></i> Filter
          </button>

          {showFilterOptions && (
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="resident">Resident</option>
              <option value="staff">Staff</option>
              <option value="security">Security</option>
            </select>
          )}
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>UserName</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users
                .filter((user) =>
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .filter((user) =>
                  filterRole === "all" ? true : user.role === filterRole
                )
                .map((user) => (
                  <tr key={user._id || user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(user)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => confirmDeleteUser(user)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">
                  No users found. Add a user to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="prev-page">⬅</button>
        <span className="current-page">1</span>
        <button className="next-page">➡</button>
      </div>

      {showForm && (
        <UserForm
          onClose={() => setShowForm(false)}
          onUserAdded={() => {
            loadUsers();
            toast.success(
              editUser
                ? "✅ User updated successfully."
                : "✅ User added successfully."
            );
          }}
          isEdit={!!editUser}
          existingUser={editUser}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${userToDelete.userName}" with ID ${userToDelete.userId}?`}
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminManageUsers;
