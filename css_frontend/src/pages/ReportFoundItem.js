import React, { useState } from "react";
import "../styles/ReportFoundItem.css";
import { FaCloudUploadAlt, FaSearch } from "react-icons/fa";
import { searchLostItems, confirmFoundItem } from "../api/itemApi";

const ReportFoundItem = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    location: "",
    date: "",
    description: "",
    picture: null,
  });

  const [preview, setPreview] = useState(null);
  const [matchedItems, setMatchedItems] = useState([]);
  const [showResults, setShowResults] = useState(false);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const matches = await searchLostItems({ itemName: formData.itemName });
      setMatchedItems(matches);
      setShowResults(true);
    } catch (err) {
      alert("❌ Error searching for match");
    }
  };

  const handleConfirm = async (matchedItemId) => {
    try {
      const form = new FormData();
      form.append("matchedItemId", matchedItemId); // ✅ Key field to target original lost item
      form.append("itemName", formData.itemName);
      form.append("location", formData.location);
      form.append("date", formData.date);
      form.append("description", formData.description);
      if (formData.picture) {
        form.append("picture", formData.picture);
      }

      await confirmFoundItem(form);
      alert("✅ Found item reported successfully.");

      // Reset form and state
      setFormData({
        itemName: "",
        location: "",
        date: "",
        description: "",
        picture: null,
      });
      setPreview(null);
      setMatchedItems([]);
      setShowResults(false);
    } catch (err) {
      alert("❌ Error confirming item.");
    }
  };

  return (
    <div className="found-container">
      <div className="found-card">
        <h2>📌 Report Found Item</h2>

        <form className="found-form" onSubmit={handleSearch}>
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
              <label
                style={{ width: "100%", height: "100%", cursor: "pointer" }}
              >
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

          <button type="submit" className="search-btn">
            <FaSearch /> Search for Match
          </button>
        </form>
      </div>

      {showResults && (
        <div className="matched-card">
          <h3>Matched Lost Items</h3>
          {matchedItems.length === 0 ? (
            <p className="no-match">No matches found.</p>
          ) : (
            <table className="match-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Picture</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {matchedItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.itemName}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.location}</td>
                    <td>
                      <img src={item.picture} alt="match" className="thumb" />
                    </td>
                    <td>
                      <button
                        className="confirm-btn"
                        onClick={() => handleConfirm(item._id)}
                      >
                        Confirm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportFoundItem;
