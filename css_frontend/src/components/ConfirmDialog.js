// src/components/ConfirmDialog.js
import React from "react";
import "../styles/ConfirmDialog.css";

const ConfirmDialog = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <p>{message}</p>
        <div className="confirm-dialog-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
