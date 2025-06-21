"use client";
import { useNavigate } from "react-router-dom";
import { UserCog, Search, FolderOpen, Eye } from "lucide-react"; // Using Lucide icons
import "../styles/SecurityDashboard.css"; // Ensure this path is correct

const SecurityDashboard = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.userName || "Security";

  const actions = [
    {
      icon: <Search />,
      title: "Report Found Item",
      description: "Submit a found item report",
      path: "/report-found-item",
    },
    {
      icon: <FolderOpen />,
      title: "Handle Items",
      description: "Manage found and claimed items",
      path: "/handle-items",
    },
    {
      icon: <Eye />,
      title: "Check Visitor",
      description: "Monitor and validate visitor entries",
      path: "/check-visitor",
    },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Security Dashboard</h1>
      </header>

      <div className="dashboard-section">
        <h2>Welcome {userName}</h2>
        <p>You can manage your account using the button below.</p>

        <button
          className="manage-profile-button"
          onClick={() => navigate("/security/profile")}
        >
          <UserCog className="manage-profile-icon" />
          Manage Profile
        </button>
      </div>

      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="action-cards-container">
          {actions.map((action, index) => (
            <div
              key={index}
              className="action-card"
              onClick={() => navigate(action.path)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
