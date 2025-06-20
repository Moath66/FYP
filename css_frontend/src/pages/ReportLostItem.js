"use client";

import { useState } from "react";
import "../styles/ReportLostItem.css"; // Ensure this path is correct
import { CloudUpload, Package } from "lucide-react"; // Using Lucide icons
import { toast } from "react-toastify";
import { submitLostItem } from "../api/itemApi"; // Keep your existing API import

const ReportLostItem = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    location: "",
    date: "",
    description: "",
    picture: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, picture: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitLostItem(formData);
      toast.success("✅ Lost item reported successfully.");
      setFormData({
        itemName: "",
        location: "",
        date: "",
        description: "",
        picture: null,
      });
      setPreview(null);
    } catch (err) {
      console.error("Failed to report lost item:", err);
      toast.error("❌ Failed to report lost item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lost-page-wrapper">
      {" "}
      {/* New wrapper for centering */}
      <div className="lost-card">
        <h2 className="lost-card-title">
          <Package className="lost-card-icon" /> Report Lost Item
        </h2>
        <form className="lost-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Picture</label>
            <div className="upload-box">
              <label htmlFor="picture-upload" className="upload-label">
                {preview ? (
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="preview"
                    className="image-preview"
                  />
                ) : (
                  <>
                    <CloudUpload size={32} className="upload-icon" />
                    <span>Click to upload image</span>
                  </>
                )}
                <input
                  type="file"
                  id="picture-upload"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportLostItem;
