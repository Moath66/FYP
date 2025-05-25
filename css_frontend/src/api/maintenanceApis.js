import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/maintenance";

// Already added earlier
export const submitMaintenance = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/submit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Add this to fix the Vercel error
export const getAllMaintenance = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Also add this for updating maintenance status (needed in Analyze page)
export const updateMaintenanceStatus = async (id, action) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${API_URL}/update/${id}`,
    {
      staffAction: action,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getMaintenanceByResident = async (residentId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/resident/${residentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


