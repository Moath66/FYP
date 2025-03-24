import React, { useState, useEffect } from "react";
import { fetchUsers } from "../api/userApi";
import UserForm from "../components/UserForm";
import "../styles/AdminManageUsers.css";

const AdminManageUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  return (
    <div className="manage-users-container">
      <h1>User Accounts</h1>
      <p>Manage system users and permissions</p>

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
                <tr key={user._id || user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="edit-btn">✏ Edit</button>
                    <button className="delete-btn">🗑 Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-users">No users found. Add a user to get started.</td>
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

      {showForm && <UserForm onClose={() => setShowForm(false)} onUserAdded={loadUsers} />}
    </div>
  );
};

export default AdminManageUsers;