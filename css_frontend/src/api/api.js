// src/api/api.js
import apiClient from "./apiClient";

// GET
export const fetchData = async (endpoint, params = {}) => {
  const res = await apiClient.get(endpoint, { params });
  return res.data;
};

// POST
export const postData = async (endpoint, payload = {}) => {
  const res = await apiClient.post(endpoint, payload);
  return res.data;
};

// PUT
export const putData = async (endpoint, payload = {}) => {
  const res = await apiClient.put(endpoint, payload);
  return res.data;
};

// DELETE
export const deleteData = async (endpoint) => {
  const res = await apiClient.delete(endpoint);
  return res.data;
};
