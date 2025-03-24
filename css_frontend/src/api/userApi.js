import axios from "axios";

// ✅ Use `import.meta.env.VITE_API_BASE_URL` for Vite projects
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"; 
const API_URL = `${API_BASE_URL}/users`; 

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Add a new user
export const createUser = async (userData) => {
  try {
    console.log("📤 Sending request to:", `${API_URL}/register`, userData); // ✅ Check request
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" }, // ✅ Ensure JSON format
    });
    console.log("✅ User created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding user:", error.response?.data || error.message);
    throw error;
  }
};

