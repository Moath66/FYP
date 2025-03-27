import React, { useState, useEffect } from "react";
import { fetchUsers, deleteUser } from "../api/userApi";
import UserForm from "../components/UserForm";
import "../styles/AdminManageUsers.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManageUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);
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

  const handleDelete = async (userId, userName) => {
    if (
      currentAdmin?.userName === userName &&
      currentAdmin?.userId === userId
    ) {
      toast.error("❌ You cannot delete your own admin account.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${userName}" with ID ${userId}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(userId, userName);
      toast.success(`✅ Deleted user '${userName}' successfully.`);
      loadUsers();
    } catch (error) {
      toast.error("❌ Failed to delete user.");
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
              users.map((user) => (
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
                      onClick={() => handleDelete(user.userId, user.userName)}
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
          onUserAdded={loadUsers}
          isEdit={!!editUser}
          existingUser={editUser}
        />
      )}
    </div>
  );
};

export default AdminManageUsers;
