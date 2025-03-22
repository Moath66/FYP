
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../api/adminApi"; // Import API function


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getAdminDashboard();
        setAdminData(data);
      } catch (err) {
        console.error("❌ Error loading admin data:", err);
        setError("Failed to load admin data. Please try again.");
        // Handle expired token
        if (err.message.includes("Unauthorized")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // ✅ Removed `navigate` from dependency array

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      <p>Welcome, Admin! 🎉</p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <pre style={styles.dataBox}>{JSON.stringify(adminData, null, 2)}</pre>
      )}

      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
};

// ✅ Styles (Consider moving this to an external CSS file)
const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "15px",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  dataBox: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "5px",
    textAlign: "left",
    whiteSpace: "pre-wrap",
    maxHeight: "200px",
    overflowY: "auto",
  },
  button: {
    padding: "10px",
    backgroundColor: "#d9534f",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default AdminDashboard;
