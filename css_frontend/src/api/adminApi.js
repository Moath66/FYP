// src/api/adminApi.js
import { fetchData } from "./api";

export const getAdminDashboard = async () => {
  // endpoint بدون /api لأنه موجود في baseURL
  return fetchData("/admin/dashboard");
};
