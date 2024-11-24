import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/accInfo.module.css";
import "../styles/global.css";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaChevronLeft, FaChevronUp, FaChevronDown } from "react-icons/fa";

const AccInfo = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isMonthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [activeLabel, setActiveLabel] = useState(null);
  const [errors, setErrors] = useState({});

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const nextStep = () => setStep(2);
  const previousStep = () => setStep(1);

  const toggleDropdown = () => setMonthDropdownOpen(!isMonthDropdownOpen);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setDob((prev) => ({ ...prev, month }));
    setMonthDropdownOpen(false);
  };

  const handleLabelClick = (label) => setActiveLabel(label);

  const handleValidation = () => {
    const newErrors = {};

    if (!password) newErrors.password = "Please enter your password";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!email) newErrors.email = "Please enter your email";
    if (!name) newErrors.name = "Please enter your name";
    if (!phone) newErrors.phone = "Please enter your phone number";
    if (!gender) newErrors.gender = "Please select your gender";
    if (!dob.day || !dob.month || !dob.year)
      newErrors.dob = "Please enter your complete date of birth";

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
          password,
          name,
          phone,
          gender,
          dob: JSON.stringify(dob),
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
  
  

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={require("../assets/main-logo.png")} alt="Childhood" />
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={step >= 1 ? styles.activeProgress : styles.inactiveProgress}
        />
        <div
          className={step === 2 ? styles.activeProgress : styles.inactiveProgress}
        />
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <Link to="/signUp">
              <FaChevronLeft className={styles.back} />
            </Link>
            <div className={styles.stepDetails}>
              <div className={styles.stepTitle}>Step 1 of 2</div>
              <div className={styles.stepDescription}>Account Information</div>
            </div>
          </div>
          <form>
            <label>Password</label>
            <div className={styles.inputContainer}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
              />
            </div>
            {errors.password && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.password}
              </p>
            )}

            <label>Confirm Password</label>
            <div className={styles.inputContainer}>
              <input
                type="password"
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
              />
            </div>
            {errors.confirmPassword && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.confirmPassword}
              </p>
            )}
            <label>Email</label>
            <div className={styles.inputContainer}>
            <input
              type="email"
              value={email} // Controlled input
              onChange={(e) => setEmail(e.target.value)} // Update state
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
                className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
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
                className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
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
                  value={selectedMonth || dob.month} // Use selectedMonth or dob.month
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

          </form>
          <button onClick={() => {
            if (handleValidation()) nextStep();
          }} className={styles.nextBtn}> Next </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <button onClick={previousStep}>
              <FaChevronLeft className={styles.back} />
            </button>
            <div className={styles.stepDetails}>
              <div className={styles.stepTitle}>Step 2 of 2</div>
              <div className={styles.stepDescription}>Account Address</div>
            </div>
          </div>

          <form>
            <label>Postal Code</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={styles.input}
              />
            </div>
            <label>Street Name, Building, House No</label>
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
            <label>Label</label>
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
          <Link to='/home'>
            <button onClick={handleSubmit} className={styles.signUpBtn}>Sign up</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AccInfo;
