import React, { useState, useEffect } from "react";
import { fetchUsers, deleteUser } from "../api/userApi";
import UserForm from "../components/UserForm";
import ConfirmDialog from "../components/ConfirmDialog";
import "../styles/AdminManageUsers.css";

const AdminManageUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users.");
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUser.userId);
      setShowConfirm(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditMode(false);
    setSelectedUser(null);
  };

  return (
    <div className="manage-users-container">
      <h1>User Accounts</h1>
      <p>Manage system users and permissions</p>

      {error && <p className="error-msg">{error}</p>}

      <button className="add-user-btn" onClick={() => setShowForm(true)}>
        ➕ Add New User
      </button>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>UserName</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id || user.userId}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(user)}>
                      ✏ Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(user)}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-users">
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
          onClose={handleCloseForm}
          onUserAdded={loadUsers}
          isEdit={editMode}
          existingUser={editMode ? selectedUser : null}
        />
      )}

      {showConfirm && selectedUser && (
        <ConfirmDialog
          message={`Are you sure you want to delete user "${selectedUser.userName}"?`}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AdminManageUsers;
