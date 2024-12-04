import React from "react";
import styles from "../styles/modal.module.css"; // Import default styles

const Modal = ({ isVisible, message, type, onClose, isFadingOut }) => {
  if (!isVisible) return null; // Return null if modal is not visible

  return (
    <div className={`${styles.modalOverlay} ${isFadingOut ? styles.fadeOut : ''}`}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{type === "success" ? "Success!" : "Error"}</h2>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.modalButton}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
