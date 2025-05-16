import React, { useEffect, useState } from "react";
import "../styles/SecurityCheckVisitor.css";
import axios from "axios";

const SecurityCheckVisitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPendingVisitors = async () => {
    try {
      const res = await axios.get("/api/visitors/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVisitors(res.data);
    } catch (error) {
      console.error("❌ Error fetching visitors:", error);
    }
  };

  useEffect(() => {
    fetchPendingVisitors();
  }, []);

  const handleApprove = async (visitorId) => {
    const confirm = window.confirm(
      `Are you sure you want to approve this visitor to enter D’summit residence?`
    );
    if (!confirm) return;

    try {
      await axios.patch(`/api/visitors/approve/${visitorId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPendingVisitors(); // Refresh table
    } catch (error) {
      console.error("❌ Approval failed:", error);
    }
  };

  const handleDeny = async (visitorId) => {
    const reason = prompt("Please enter reason for denial:");
    if (!reason) return;

    try {
      await axios.patch(`/api/visitors/deny/${visitorId}`, { reason }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPendingVisitors(); // Refresh table
    } catch (error) {
      console.error("❌ Denial failed:", error);
    }
  };

  const filtered = visitors.filter((v) =>
    v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="security-container">
      <h2 className="security-title">🛡️ Check Visitors</h2>

      <input
        type="text"
        placeholder="🔍 Search by name..."
        className="search-box"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="security-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Visitor ID</th>
            <th>Full Name</th>
            <th>Purpose</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((v, i) => (
            <tr key={v._id}>
              <td>{i + 1}</td>
              <td>{v.visitorId}</td>
              <td>{v.visitor_name}</td>
              <td><span className="tag purpose">{v.purpose}</span></td>
              <td>{v.phone_number}</td>
              <td>{v.email}</td>
              <td>{new Date(v.date).toLocaleDateString()}</td>
              <td>
                <button className="btn-approve" onClick={() => handleApprove(v._id)}>Approve</button>
                <button className="btn-deny" onClick={() => handleDeny(v._id)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityCheckVisitor;
