// src/api/userApi.js
import { fetchData, postData, putData, deleteData } from "./api";

// ✅ Get all users (admin)
export const fetchUsers = async () => {
  return fetchData("/users");
};

// ✅ Register a new user (admin)
export const createUser = async (userData) => {
  return postData("/users/register", userData);
};

// ✅ Delete user
export const deleteUser = async (userId, userName) => {
  return deleteData(`/users/${userId}/${userName}`);
};

// ✅ Update user info
export const updateUser = async (userId, updatedData) => {
  return putData(`/users/${userId}`, updatedData);
};

// ✅ Get user by ID
export const getUserById = async (userId) => {
  return fetchData(`/users/${userId}`);
};

// ✅ Login (مفيد لو تحب توحيده هنا بدل Login.js)
export const loginUser = async (identifier, password) => {
  return postData("/auth/login", { identifier, password });
};
