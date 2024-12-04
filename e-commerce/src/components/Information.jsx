import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/infrormation.module.css";
import "../styles/global.css";
import { AiOutlineExclamationCircle, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const Information = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isMonthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [changePassword, setChangePassword] = useState(false); // Checkbox state
  const [errors, setErrors] = useState({});

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const toggleDropdown = () => setMonthDropdownOpen(!isMonthDropdownOpen);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setDob((prev) => ({ ...prev, month }));
    setMonthDropdownOpen(false);
  };

    // Add state for password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);

  const handleValidation = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Please enter your email";
    if (!name) newErrors.name = "Please enter your name";
    if (!phone) newErrors.phone = "Please enter your phone number";
    if (!gender) newErrors.gender = "Please select your gender";
    if (!dob.day || !dob.month || !dob.year)
      newErrors.dob = "Please enter your complete date of birth";

    if (changePassword) {
      if (!currentPassword) newErrors.currentPassword = "Please enter your current password";
      if (!newPassword) newErrors.password = "Please enter your new password";
      if (!confirmPassword) newErrors.confirmPassword = "Please confirm your new password";
      if (newPassword && confirmPassword && confirmPassword && newPassword !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

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
          email,
          password: changePassword ? newPassword : "", // Send password only if checkbox is checked
          currentPassword: changePassword ? currentPassword : "", // Include current password if changing
          name,
          phone,
          gender,
          dob: JSON.stringify(dob),
        }),
      });

      const textResponse = await response.text();
      console.log("Raw response:", textResponse);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = JSON.parse(textResponse);
      if (data.success) {
        console.log("Account created successfully!");
      } else {
        console.error("Errors:", data.errors || data.message);
      }
    } catch (error) {
      console.error("Error submitting account information:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1
        style={{
          textAlign: "center",
          fontFamily: "Rethink Sans",
          marginTop: 20,
          marginBottom: 20,
          marginLeft: -180,
          fontSize: 40,
          fontWeight: 800,
          width: "200%",
        }}
      >
        YOUR PERSONAL INFORMATION
      </h1>

      <div className={styles.stepContent}>
        <form>
          <label>Email</label>
          <div className={styles.inputContainer}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
          {errors.email && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.email}
            </p>
          )}

          <label>Name</label>
          <p>This name will appear on your profile</p>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} ${errors.name ? styles.errorInput : ""}`}
            />
          </div>
          {errors.name && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.name}
            </p>
          )}

          <label>Phone Number</label>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${styles.input} ${errors.phone ? styles.errorInput : ""}`}
            />
          </div>
          {errors.phone && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.phone}
            </p>
          )}

          <label>Gender</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                className={styles.radioInput}
                checked={gender === "Male"}
                onChange={() => setGender("Male")}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                className={styles.radioInput}
                checked={gender === "Female"}
                onChange={() => setGender("Female")}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                className={styles.radioInput}
                checked={gender === "Other"}
                onChange={() => setGender("Other")}
              />
              Other
            </label>
          </div>
          {errors.gender && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.gender}
            </p>
          )}

          <label>Date of Birth</label>
          <div className={styles.dobGroup}>
            <input
              type="text"
              placeholder="dd"
              maxLength={2}
              value={dob.day}
              onChange={(e) => setDob({ ...dob, day: e.target.value })}
            />
            <div className={styles.monthInputWrapper}>
              <input
                type="text"
                placeholder="Month"
                readOnly
                value={selectedMonth || dob.month}
                onClick={toggleDropdown}
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
                      onClick={() => handleMonthSelect(month)}
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
              placeholder="yyyy"
              maxLength={4}
              value={dob.year}
              onChange={(e) => setDob({ ...dob, year: e.target.value })}
            />
          </div>
          {errors.dob && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.dob}
            </p>
          )}

          <div className={styles.changeCurrentpass}>
            <input
              type="checkbox"
              id="changePass"
              className={styles.checkbox}
              checked={changePassword}
              onChange={() => setChangePassword(!changePassword)}
            />
            <label htmlFor="changePass">
              Do you want to change your current password?
            </label>
          </div>

          {changePassword && (
            <>
              <label>Current Password</label>
              <div className={styles.inputContainer}>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name="currentPassword"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`${styles.input} ${errors.currentPassword ? styles.errorInput : ""}`}
                />
                <span
                className={styles.eyeIcon}
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
              >
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
              </div>
              {errors.currentPassword && (
                <p className={styles.errorMessage}>
                  <AiOutlineExclamationCircle className={styles.errorIcon} />{" "}
                  {errors.currentPassword}
                </p>
              )}

              <label>New Password</label>
              <div className={styles.inputContainer}>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${styles.input} ${errors.password ? styles.errorInput : ""}`}
                />
                <span
                className={styles.eyeIcon}
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
              >
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
              </div>
              {errors.password && (
                <p className={styles.errorMessage}>
                  <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.password}
                </p>
              )}

              <label>Confirm Password</label>
              <div className={styles.inputContainer}>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ""}`}
                />
                <span
                className={styles.eyeIcon}
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
              >
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
              </div>
              {errors.confirmPassword && (
                <p className={styles.errorMessage}>
                  <AiOutlineExclamationCircle className={styles.errorIcon} />{" "}
                  {errors.confirmPassword}
                </p>
              )}
            </>
          )}
        </form>

        <Link to="">
          <button onClick={handleSubmit} className={styles.savedBtn}>
            SAVED
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Information;
