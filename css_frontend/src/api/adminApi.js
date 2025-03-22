export const getAdminDashboard = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/admin/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch admin dashboard");

    console.log("✅ Fetching admin dashboard data..."); // Debugging log
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching admin dashboard:", error);
    throw error;
  }
};
