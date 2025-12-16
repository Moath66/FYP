// src/api/itemApi.js
import apiClient from "./apiClient";

// 1) Submit Lost Item
export const submitLostItem = async (formData) => {
  const form = new FormData();
  form.append("itemName", formData.itemName);
  form.append("location", formData.location);
  form.append("date", formData.date);
  form.append("description", formData.description);
  if (formData.picture) form.append("picture", formData.picture);

  const res = await apiClient.post("/items/lost", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 2) Search Lost Items
export const searchLostItems = async (data) => {
  const res = await apiClient.post("/items/found/search", data);
  return res.data;
};

// 3) Confirm Found Item
export const confirmFoundItem = async (data) => {
  const res = await apiClient.post("/items/found/confirm", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 4) Update Status
export const updateItemStatus = async (itemId, status) => {
  const res = await apiClient.put(`/items/status/${itemId}`, { status });
  return res.data;
};

// 5) Claim Item
export const claimItem = async (itemId) => {
  const res = await apiClient.post(`/items/claim/${itemId}`);
  return res.data;
};

// 6) Get All Items
export const fetchAllItems = async () => {
  const res = await apiClient.get("/items/all");
  return res.data;
};

// 7) Items by User
export const fetchItemsByUser = async (userId) => {
  const res = await apiClient.get(`/items/by-user/${userId}`);
  return res.data;
};
