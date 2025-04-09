import React, { useState } from "react";
import "../styles/ReportLostItem.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { submitLostItem } from "../api/itemApi";

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
      toast.error("❌ Failed to report lost item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lost-container">
      <div className="lost-card">
        <h2>📦 Report Lost Item</h2>
        <form className="lost-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
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
              <label style={{ width: "100%", height: "100%", cursor: "pointer" }}>
                {preview ? (
                  <img src={preview} alt="preview" className="image-preview" />
                ) : (
                  <>
                    <FaCloudUploadAlt size={32} />
                    <span>Click to upload image</span>
                  </>
                )}
                <input type="file" hidden onChange={handleFileChange} />
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
