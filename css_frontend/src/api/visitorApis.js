import axios from "axios";

// ✅ Use .env variable or fallback to localhost
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/visitors`;

// 🔐 Auth header helper
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 🔹 Register Visitor (used in PreVisitorRegis.js)
export const registerVisitor = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      formData,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error registering visitor:",
      error.response?.data || error.message
    );
    throw error;
  }
};
