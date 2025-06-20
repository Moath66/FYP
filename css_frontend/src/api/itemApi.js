import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/items`;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 🔹 1. Submit Lost Item
export const submitLostItem = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("itemName", formData.itemName);
    form.append("location", formData.location);
    form.append("date", formData.date);
    form.append("description", formData.description);
    if (formData.picture) {
      form.append("picture", formData.picture);
    }

    const response = await axios.post(`${API_URL}/lost`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error submitting lost item:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 2. Search Lost Items by Name (match logic)
export const searchLostItems = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/found/search`, formData, {
      headers: {
        "Content-Type": "application/json", // ✅ Change this
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error searching lost items:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 3. Confirm Found Item (create new found item)
export const confirmFoundItem = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/found/confirm`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error confirming found item:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 4. Update Item Status (used by security)
export const updateItemStatus = async (itemId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/status/${itemId}`,
      { status },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating item status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 5. Claim Item (for resident – generates QR code)
export const claimItem = async (itemId) => {
  try {
    const response = await axios.post(
      `${API_URL}/claim/${itemId}`,
      null,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error claiming item:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 6. Get All Items (for security or admin view)
export const fetchAllItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, authHeader());
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching items:",
      error.response?.data || error.message
    );
    return [];
  }
};

// 🔹 7. Fetch Items by User (used in TrackingItemApp)
export const fetchItemsByUser = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/by-user/${userId}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching items by user:",
      error.response?.data || error.message
    );
    return [];
  }
};
