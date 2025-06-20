"use client";

import { useState } from "react";
import "../styles/ReportFoundItem.css"; // Ensure this path is correct
import { FaCloudUploadAlt, FaSearch, FaArrowLeft } from "react-icons/fa"; // Using react-icons/fa
import { toast } from "react-toastify";
import { searchLostItems, confirmFoundItem } from "../api/itemApi";
import { useNavigate } from "react-router-dom";
import { Package } from "react-feather";

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
  const [showDesc, setShowDesc] = useState(null); // For description modal
  const [showImage, setShowImage] = useState(null); // For image modal
  const [reportedIds, setReportedIds] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  const navigate = useNavigate();

  const apiBaseURL =
    process.env.REACT_APP_API_BASE_URL?.replace("/api", "") || "";

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
    setLoadingSearch(true);
    try {
      const matches = await searchLostItems({ itemName: formData.itemName });
      setMatchedItems(matches);
      setShowResults(true);
      toast.success("🔍 Search complete!");
    } catch (err) {
      console.error("Error searching for match:", err);
      toast.error("❌ Error searching for match");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleConfirm = async (matchedItemId) => {
    setLoadingConfirm(true);
    try {
      const form = new FormData();
      form.append("matchedItemId", matchedItemId);
      form.append("itemName", formData.itemName);
      form.append("location", formData.location);
      form.append("date", formData.date);
      form.append("description", formData.description);
      if (formData.picture) {
        form.append("picture", formData.picture);
      }

      await confirmFoundItem(form);
      toast.success("✅ Found item reported successfully. Redirecting...");
      setReportedIds((prev) => [...prev, matchedItemId]);

      // Clear form after successful submission
      setFormData({
        itemName: "",
        location: "",
        date: "",
        description: "",
        picture: null,
      });
      setPreview(null);

      // Redirect to dashboard after a short delay for toast to show
      setTimeout(() => {
        navigate("/resident/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error confirming item:", err);
      toast.error("❌ Error confirming item.");
    } finally {
      setLoadingConfirm(false);
    }
  };

  return (
    <div className="lost-page-wrapper">
      <div className="lost-card">
        <header className="profile-header">
          <h2 className="lost-card-title">
            <Package className="lost-card-icon" /> Report Found Item
          </h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </button>
        </header>

        <form className="lost-form" onSubmit={handleSearch}>
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
                    <FaCloudUploadAlt size={32} className="upload-icon" />
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

          <button type="submit" className="submit-btn" disabled={loadingSearch}>
            {loadingSearch ? (
              "Searching..."
            ) : (
              <>
                <FaSearch className="mr-2 h-5 w-5" /> Search for Match
              </>
            )}
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
                  <th>Description</th>
                  <th>Picture</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {matchedItems.map((item, index) => (
                  <tr key={item._id}>
                    <td data-label="#">{index + 1}</td>
                    <td data-label="Item Name">{item.itemName}</td>
                    <td data-label="Date">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td data-label="Location">{item.location}</td>
                    <td data-label="Description">
                      {item.description ? (
                        <button
                          className="read-more-btn"
                          onClick={() => setShowDesc(item.description)}
                        >
                          Read More
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td data-label="Picture">
                      {item.picture ? (
                        <img
                          src={`${apiBaseURL}${item.picture}`}
                          alt="match"
                          className="thumb"
                          onClick={() =>
                            setShowImage(`${apiBaseURL}${item.picture}`)
                          }
                          onError={(e) =>
                            (e.currentTarget.src =
                              "/placeholder.svg?height=60&width=60")
                          }
                        />
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td data-label="Action">
                      {item.status === "lost" &&
                      !reportedIds.includes(item._id) ? (
                        <button
                          className="found-btn"
                          onClick={() => handleConfirm(item._id)}
                          disabled={loadingConfirm}
                        >
                          {loadingConfirm ? "Confirming..." : "Confirm"}
                        </button>
                      ) : (
                        <button className="found-btn reported" disabled>
                          Reported
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal: Description (Re-integrated) */}
      {showDesc && (
        <div className="modal-overlay" onClick={() => setShowDesc(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-title">📋 Item Description</h4>
            <p className="modal-description">{showDesc}</p>
            <div className="btn-close-wrapper">
              <button className="btn-close" onClick={() => setShowDesc(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Image (Re-integrated) */}
      {showImage && (
        <div className="modal-overlay" onClick={() => setShowImage(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img
              src={showImage || "/placeholder.svg"}
              alt="Detail"
              className="modal-image"
            />
            <div className="btn-close-wrapper">
              <button className="btn-close" onClick={() => setShowImage(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportFoundItem;
