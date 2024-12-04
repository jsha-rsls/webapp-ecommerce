// Modal.js
import React from 'react';
import styles from './BPRegistration.module.css';

const Modal = ({ message, onClose, isSuccess }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h4>{isSuccess ? 'Success' : 'Error'}</h4>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
