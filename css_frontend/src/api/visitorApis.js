import axios from "axios";

// ✅ Fallback to localhost in development
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/visitors`;

// ✅ Auth header helper
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 🔹 Register Visitor
export const registerVisitor = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, formData, authHeader());
    return res.data;
  } catch (err) {
    console.error(
      "❌ Error registering visitor:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// (Optional future methods for your module structure)
// 🔹 Get Pending Visitors
export const fetchPendingVisitors = async () => {
  try {
    const res = await axios.get(`${API_URL}/pending`, authHeader());
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching pending visitors:", err);
    throw err;
  }
};

// 🔹 Approve Visitor
export const approveVisitor = async (visitorId) => {
  try {
    const res = await axios.patch(
      `${API_URL}/approve/${visitorId}`,
      {},
      authHeader()
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error approving visitor:", err);
    throw err;
  }
};

// 🔹 Deny Visitor
export const denyVisitor = async (visitorId, reason) => {
  try {
    const res = await axios.patch(
      `${API_URL}/deny/${visitorId}`,
      { reason },
      authHeader()
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error denying visitor:", err);
    throw err;
  }
};

// 🔹 Get Visitor By Resident
export const getVisitorsByResident = async (userId) => {
  try {
    const res = await axios.get(
      `${API_URL}/byResident/${userId}`,
      authHeader()
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching visitor list:", err);
    throw err;
  }
};
