// src/api/maintenanceApis.js
import apiClient from "./apiClient";

export const submitMaintenance = async (data) => {
  const res = await apiClient.post("/maintenance/submit", data);
  return res.data;
};

export const getAllMaintenance = async () => {
  const res = await apiClient.get("/maintenance/all");
  return res.data;
};

export const updateMaintenanceStatus = async (id, action) => {
  const res = await apiClient.patch(`/maintenance/update/${id}`, {
    staffAction: action,
  });
  return res.data;
};

export const getMaintenanceByResident = async (residentId) => {
  const res = await apiClient.get(`/maintenance/resident/${residentId}`);
  return res.data;
};
