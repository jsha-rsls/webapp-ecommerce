import React, { useState } from 'react';
import styles from '../styles/editAddress.module.css';
import "../styles/global.css";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const EditAddressModal = ({ isOpen, onClose }) => {

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);
  

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [activeLabel, setActiveLabel] = useState(null);
  const [errors, setErrors] = useState({});

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [activeHeader, setActiveHeader] = useState("Region");
  
    const regionDropdown = () => {
      setIsDropdownVisible(!isDropdownVisible);
    };

    const handleHeaderClick = (header) => {
      setActiveHeader(header);
    };

    const handleLabelClick = (label) => setActiveLabel(label);

  const handleValidation = () => {
    const newErrors = {};

    if (!name) newErrors.name = "Please enter your name";
    if (!phone) newErrors.phone = "Please enter your phone number";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!handleValidation()) return;
  
    try {
      const response = await fetch("http://localhost:8000/submit_account.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name,
          phone,
          postalCode,
          address,
          label: activeLabel,
        }),
      });
  
      const textResponse = await response.text(); // Get raw response text
      console.log("Raw response:", textResponse); // Log it for debugging
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Check if the response is JSON before parsing
      try {
        const data = JSON.parse(textResponse);
        if (data.success) {
          console.log("Account created successfully!");
        } else {
          console.error("Errors:", data.errors || data.message);
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError, textResponse);
      }
    } catch (error) {
      console.error("Error submitting account information:", error);
    }
  };

  if (!isOpen) return null;

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    },
    container: {
      background: '#fff',
      padding: '20px',
      borderRadius: '10px',
      width: '700px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      fontSize: '30px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <div className={styles.modalHeader}>
          <button style={modalStyles.closeButton} onClick={onClose}>
            ×
          </button>
          <h2>Edit Address</h2>
        </div>
        <form>
            <label className={styles.labels}>Name</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
              />
            </div>
            {errors.name && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.name}
              </p>
            )}

            <label className={styles.labels}>Phone Number</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
              />
            </div>
            {errors.phone && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.phone}
              </p>
            )}

            <label className={styles.labels}>Region, Province, City, Barangay</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Region, Province, City, Barangay"
                className={styles.input}
                readOnly
              />
              <span className={styles.icon} onClick={regionDropdown}>
                {isDropdownVisible ? <FaChevronDown /> : <FaChevronUp />}
              </span>
            </div>
                
            {isDropdownVisible && (
              <div className={styles.dropdown}>
                <table>
                  <thead>
                    <tr>
                      {["Region", "Province", "City", "Barangay"].map((header) => (
                          <th
                            key={header}
                            onClick={() => handleHeaderClick(header)}
                            className={activeHeader === header ? "active-header" : ""}
                          >
                            {header}
                          </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <label className={styles.labels}>Postal Code</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={styles.input}
              />
            </div>

            <label className={styles.labels}>Street Name, Building, House No</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Street"
                value={address} // Bind the input value to `address`
                onChange={(e) => setAddress(e.target.value)} // Update state on change
                className={styles.input}
              />
            </div>
          </form>

          <div className={styles.googleMap}>Google Map</div>
          <div className={styles.labelHW}>
            <label className={styles.labels}>Label</label>
            <div className={styles.labelButtons}>
              <button
                className={`${styles.labelButton} ${
                  activeLabel === "Home" ? styles.active : ""
                }`}
                onClick={() => handleLabelClick("Home")}
              >
                Home
              </button>
              <button
                className={`${styles.labelButton} ${
                  activeLabel === "Work" ? styles.active : ""
                }`}
                onClick={() => handleLabelClick("Work")}
              >
                Work
              </button>
            </div>
          </div>

            <button onClick={handleSubmit} className={styles.savedBtn}>SAVED</button>
      </div>
    </div>
  );
};

export default EditAddressModal;
