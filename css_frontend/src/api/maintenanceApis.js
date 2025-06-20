import axios from "axios";

// Base URL from .env + static subroute
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/maintenance`;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 🔹 1. Submit Maintenance Request (Resident)
export const submitMaintenance = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/submit`, data, authHeader());
    return response.data;
  } catch (error) {
    console.error(
      "❌ submitMaintenance error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 2. Get All Maintenance Records (for staff)
export const getAllMaintenance = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, authHeader());
    return response.data;
  } catch (error) {
    console.error(
      "❌ getAllMaintenance error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 3. Update Status & Action (staff)
export const updateMaintenanceStatus = async (id, action) => {
  try {
    const response = await axios.patch(
      `${API_URL}/update/${id}`,
      { staffAction: action },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ updateMaintenanceStatus error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 4. Get Records by Resident ID (for tracking)
export const getMaintenanceByResident = async (residentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/resident/${residentId}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ getMaintenanceByResident error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
