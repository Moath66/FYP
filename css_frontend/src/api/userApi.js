import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/users`;

export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const createUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error adding user:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/${userId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating user:", error);
    throw error;
  }
};
