import React, { useState } from 'react';
import { AiOutlineExclamationCircle } from "react-icons/ai";  // Updated icon
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import styles from './BPRegistration.module.css';
import './Custom.css';

import axios from 'axios';
import Modal from './modal';
import { writeRFID } from './rfidFunction/rfidWrite';
import { readRFID } from './rfidFunction/rfidRead';


const BookPass = () => {
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isMonthDropdownOpen, setMonthDropdownOpen] = useState(false);

  // Months for the dropdown
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

// Toggle the dropdown
const toggleDropdown = () => setMonthDropdownOpen(!isMonthDropdownOpen);

// Handle month selection
const handleMonthSelect = (month) => {
  setSelectedMonth(month);
  setDob((prev) => ({ ...prev, month }));
  setMonthDropdownOpen(false);
};

// Handle day and year changes
const handleDobChange = (e) => {
  const { name, value } = e.target;
  setDob((prev) => ({ ...prev, [name]: value }));
};

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    gender: '',
    dob: JSON.stringify(dob),
    postalCode: '',
    address: '',
    label: '',
    bookPassID: generateBookPassID(),
    password: '', 
  });

  const [errors, setErrors] = useState({}); // Store errors for validation
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isSuccess, setIsSuccess] = useState(false); // For success or error status

  function generateBookPassID() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const getRandomChar = () => characters[Math.floor(Math.random() * characters.length)];
  
    // Generate three groups of three random characters
    const part1 = Array.from({ length: 3 }, getRandomChar).join("");
    const part2 = Array.from({ length: 3 }, getRandomChar).join("");
    const part3 = Array.from({ length: 3 }, getRandomChar).join("");
  
    // Join parts with dashes
    return `${part1}-${part2}-${part3}`;
  }

  const handleRegenerateID = () => {
    setFormData({
      ...formData,
      bookPassID: generateBookPassID(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'phone') {
      // Only allow digits and limit to 11 characters
      const formattedValue = value.replace(/\D/g, '').slice(0, 11); // Remove non-digit characters and limit to 11 digits
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Email validator function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, name, phone, gender, postalCode, address, label, password, rfid } = formData;

    if (!rfid || rfid === 'No RFID detected') {
      newErrors.rfid = 'RFID UID is required';
    }
  
    // Check if all fields are filled
    if (!email || !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!name) {
      newErrors.name = 'Full name is required';
    }
    if (!phone || phone.length !== 11) {
      newErrors.phone = 'Phone number must be 11 digits';
    }
    if (!gender) {
      newErrors.gender = 'Gender is required';
    }
    // Validation for DOB (use dob state here)
    if (!dob.day || !dob.month || !dob.year) {
      newErrors.dob = "Please complete your Date of Birth.";
    } else if (
      parseInt(dob.day, 10) < 1 ||
      parseInt(dob.day, 10) > 31 ||
      parseInt(dob.year, 10) < 1900 ||
      parseInt(dob.year, 10) > new Date().getFullYear()
    ) {
      newErrors.dob = "Invalid Date of Birth.";
    }
    if (!postalCode) {
      newErrors.postalCode = 'Postal code is required';
    }
    if (!address) {
      newErrors.address = 'Address is required';
    }
    if (!label) {
      newErrors.label = 'Label (Home/Work) is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };  

  const [rfidStatus, setRfidStatus] = useState('No RFID Card Detected'); // State to track RFID status
  const [rfidReadStatus, setRfidReadStatus] = useState('Scan RFID First'); // State to track RFID status

  // Function to check and fetch RFID status
  const checkRfidStatus = async () => {
    try {
      const response = await axios.get('http://192.168.100.220/rfid');
      const rfid = response.data.rfid || 'No RFID detected';
      setRfidStatus(rfid); // Update the RFID status displayed
      setFormData((prevData) => ({
        ...prevData,
        rfid, // Add RFID UID to formData
      }));
    } catch (error) {
      console.error('Error fetching RFID data:', error);
      setRfidStatus('Error detecting RFID');
    }
  };
  
// Update handleSubmit to include RFID UID
const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    const updatedFormData = { ...formData, dob: dob };

    if (!updatedFormData.rfid) {
      console.error("RFID UID is required.");
      setErrors((prevErrors) => ({ ...prevErrors, rfid: "RFID UID is required" }));
      return;
    }

    console.log("Form Submitted:", updatedFormData);

    try {
      // Step 1: Check if RFID already exists by calling checkRFID.php
      const rfidCheckResponse = await fetch("http://localhost:8000/checkRFID.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfid: updatedFormData.rfid }),
      });

      const rfidCheckData = await rfidCheckResponse.json();

      // Step 2: If RFID exists, prevent further submission
      if (rfidCheckData.status === "exists") {
        setModalMessage("RFID already registered!");
        setIsSuccess(false);
        setIsModalVisible(true);
        return;
      }

      // Step 3: Proceed with writing data to the RFID card
      const writeResult = await writeRFID(updatedFormData);
      setIsSuccess(true);
      setModalMessage(writeResult); // Show the result message
      setIsModalVisible(true); 

      // Step 4: Save the form data to the database (saveBookPass.php)
      const response = await fetch("http://localhost:8000/saveBookPass.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status === "success") {
        setModalMessage("Registration Successful!");
      } else {
        setModalMessage(responseData.message);
        setIsSuccess(false);
      }
      setIsModalVisible(true); 
    } catch (error) {
      console.error("Error during submission:", error);
      setModalMessage("There was an error processing your registration.");
      setIsSuccess(false); 
      setIsModalVisible(true); 
    }
  }
};

const handleCloseModal = () => {
  setIsModalVisible(false);
};

  return (
    <div className={styles.container}>
      {isModalVisible && (
        <Modal message={modalMessage} onClose={handleCloseModal} isSuccess={isSuccess} />
      )}
      <span className={styles.title}>Book Pass Registration</span>

      <div className={styles.bookPassSections}>
        {/* Left Section: Part 1 and RFID */}
        <div className={styles.leftSection}>
          <div className={styles.bookPassPart1}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <h5>Book Pass ID</h5>
                <input
                  className={`${styles.input} ${styles.bookPassIDInput}`}
                  type="text"
                  name="bookPassID"
                  placeholder="XXX-XXX-XXX"
                  value={formData.bookPassID}
                  readOnly
                />
                <button
                  type="button"
                  onClick={handleRegenerateID}
                  className={styles.regenerateButton}
                >
                  Regenerate Book Pass ID
                </button>
              </div>

              <div className={styles.inputGroup}>
                <h5>Password</h5>
                <input 
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  className={`${styles.inputSmall} ${errors.password ? styles.errorInput : ''}`}
                />
                {errors.name && (
                  <span className={`${styles.errorMessage}`}>
                    <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.password}
                  </span>
                )}
              </div>
            </form>
          </div>

        {/* RFID Section */}
        <div className={styles.rfidSection}>
          <div className={styles.form}>
            <h5>RFID Detection</h5>
            <input
              type="text"
              name="rfid"
              placeholder="RFID UID"
              value={rfidStatus} // Use rfidStatus directly
              readOnly
              className={`${styles.input} ${styles.rfidUID}`} 
            />
            {errors.rfid && (
              <span className={`${styles.errorMessage}`}>
                <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.rfid}
              </span>
            )}
            <button
              onClick={checkRfidStatus} // Call checkRfidStatus when button clicked
              type="button"
              className={styles.scanButton}
            >
              Scan RFID
            </button>
          </div>
          <hr className={styles.sectionDivider} />
          <div className={styles.form}>
            <h5>RFID Read</h5>
            <button
              onClick={() => readRFID(setRfidReadStatus)}
              type="button"
              className={styles.scanButton}
            >
              Read RFID
            </button>

            {/* Box to display RFID data */}
            <div className={styles.rfidBox}>
              {rfidReadStatus || "No RFID data read yet"}
            </div>
          </div>
        </div>
        </div>

        {/* Right Section: Part 2 */}
        <div className={styles.bookPassPart2}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Personal Information */}
            <h5 className={styles.sectionTitle}>Personal Information</h5>
            <div className={styles.row}>
              <div>
                <label>Full Name:</label>
                <input
                  className={`${styles.inputSmall} ${errors.name ? styles.errorInput : ''}`}
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className={`${styles.errorMessage}`}>
                    <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.name}
                  </span>
                )}
              </div>
              <div>
                <label>Gender:</label>
                <select
                  className={`${styles.inputSmall} ${errors.gender ? styles.errorInput : ''}`}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <span className={`${styles.errorMessage}`}>
                    <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.gender}
                  </span>
                )}
              </div>
            </div>
            <label>Date of Birth</label>
            <div className={styles.dobGroup}>
              <div className={styles.monthInputWrapper}>
                <input
                  type="text"
                  placeholder="Month"
                  readOnly
                  value={selectedMonth || dob.month} // Use selectedMonth or dob.month
                  onClick={toggleDropdown}
                  className={errors.dob ? styles.errorInput : ""}
                />
                {isMonthDropdownOpen ? (
                  <FaChevronDown onClick={toggleDropdown} className={styles.chevronIcon} />
                ) : (
                  <FaChevronUp onClick={toggleDropdown} className={styles.chevronIcon} />
                )}
                {isMonthDropdownOpen && (
                  <ul className={styles.monthDropdown}>
                    {months.map((month, index) => (
                      <li
                        key={index}
                        onClick={() => handleMonthSelect(month)} // Update dob.month here
                        className={styles.monthOption}
                      >
                        {month}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input 
                type="text"
                name="day"
                placeholder="DD"
                maxLength={2}
                value={dob.day}
                onChange={handleDobChange}
                className={errors.dob ? styles.errorInput : ""}
              />
              <input
                type="text"
                name="year"
                placeholder="YYYY"
                maxLength={4}
                value={dob.year}
                onChange={handleDobChange}
                className={errors.dob ? styles.errorInput : ""}
              />
              {errors.dob && (
                <span className={`${styles.errorMessage}`}>
                  <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.dob}
                </span>
              )}
            </div>
              
            <hr className={styles.sectionDivider} />

            {/* Contact Information */}
            <h5 className={styles.sectionTitle}>Contact Information</h5>
            <div className={styles.row}>
              <div>
                <label>Email:</label>
                <input
                  className={`${styles.inputSmall} ${errors.email ? styles.errorInput : ''}`}
                  type="email"
                  name="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className={`${styles.errorMessage}`}>
                    <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.email}
                  </span>
                )}
              </div>
              <div>
                <label>Phone Number:</label>
                <input
                  className={`${styles.inputSmall} ${errors.phone ? styles.errorInput : ''}`}
                  type="tel"
                  name="phone"
                  placeholder="11-Digit Number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="11"
                />
                {errors.phone && (
                  <span className={`${styles.errorMessage}`}>
                    <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.phone}
                  </span>
                )}
              </div>
            </div>

            <hr className={styles.sectionDivider} />

            {/* Address Information */}
            <h5 className={styles.sectionTitle}>Address Information</h5>
            <div className={styles.row}>
              <div>
                <label>Address:</label>
                <textarea
                  className={`${styles.inputSmall} ${errors.address ? styles.errorInput : ''}`}
                  name="address"
                  placeholder="House No., Street, Barangay, etc."
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && (
                  <span className={`${styles.errorMessage}`}>
                    <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.address}
                  </span>
                )}
              </div>
              <div>
                <label>Postal Code:</label>
                <input
                  className={`${styles.inputSmall} ${errors.postalCode ? styles.errorInput : ''}`}
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
                {errors.postalCode && (
                  <span className={`${styles.errorMessage}`}>
                    <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.postalCode}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <label>Label:</label>
                <select
                  className={`${styles.inputSmall} ${errors.label ? styles.errorInput : ''}`}
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                >
                  <option value="">Select Label (Home/Work)</option>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                </select>
                {errors.label && (
                  <span className={`${styles.errorMessage}`}>
                    <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.label}
                  </span>
                )}
              </div>
            </div>
            <button type="submit" className={styles.registerButton}>
                  Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookPass;
