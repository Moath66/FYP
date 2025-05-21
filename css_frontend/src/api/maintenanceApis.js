import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/maintenance";

export const submitMaintenance = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/submit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
