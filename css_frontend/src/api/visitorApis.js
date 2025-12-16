// src/api/visitorApis.js
import apiClient from "./apiClient";

export const registerVisitor = async (formData) => {
  const res = await apiClient.post("/visitors/register", formData);
  return res.data;
};

export const fetchPendingVisitors = async () => {
  const res = await apiClient.get("/visitors/pending");
  return res.data;
};

export const approveVisitor = async (visitorId) => {
  const res = await apiClient.patch(`/visitors/approve/${visitorId}`, {});
  return res.data;
};

export const denyVisitor = async (visitorId, reason) => {
  const res = await apiClient.patch(`/visitors/deny/${visitorId}`, { reason });
  return res.data;
};

export const getVisitorsByResident = async () => {
  const res = await apiClient.get("/visitors/byResident");
  return res.data;
};

export const fetchAllVisitorsForSecurity = async () => {
  const res = await apiClient.get("/visitors/all");
  return res.data;
};
