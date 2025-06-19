"use client"

import "../styles/ConfirmDialog.css" // Dedicated CSS for ConfirmDialog

const ConfirmDialog = ({
  message,
  onCancel,
  onConfirm,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  title = "Confirm Action", // Added title prop
}) => {
  return (
    <div className="modal-overlay confirm-dialog-overlay">
      <div className="modal-content confirm-dialog-modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-button" onClick={onCancel} aria-label="Close dialog">
            &times;
          </button>
        </div>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button onClick={onCancel} className="button-cancel">
            {cancelButtonText}
          </button>
          <button onClick={onConfirm} className="button-confirm-action">
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
