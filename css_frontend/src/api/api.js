const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"; // ✅ Use deployed URL if available

export const fetchData = async (endpoint) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach token
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Failed to fetch"}`
      );
    }

    const data = await response.json();
    console.log("✅ Data from backend:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    throw error;
  }
};
