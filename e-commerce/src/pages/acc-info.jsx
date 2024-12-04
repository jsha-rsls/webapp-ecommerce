import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/accInfo.module.css";
import "../styles/global.css";
import { AiOutlineExclamationCircle, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaChevronLeft, FaChevronUp, FaChevronDown } from "react-icons/fa";
import Modal from "../components/modal.jsx";
import MapContainer from "../components/map.jsx";


const AccInfo = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate here
  const [email, setEmail] = useState(location.state?.email || "");
  const [username, setUsername] = useState(location.state?.name || "");   // Auto-fill name if provided
  
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isMonthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [activeLabel, setActiveLabel] = useState(null);
  const [errors, setErrors] = useState({});

    // Add state for password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState(""); // "success" or "error"
    const [isFadingOut, setIsFadingOut] = useState(false);


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
  
    // Step 1 validation
    if (step === 1) {
      // Ensure password and confirmPassword are not empty and match
      if (!password) {
        newErrors.password = "Please enter your password";
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"; // Direct comparison without trim
      }
      

      // Ensure all values for date of birth are filled
      if (!dob?.day || !dob?.month || !dob?.year) {
        newErrors.dob = "Please enter your complete date of birth";
      }
  
      // Ensure other fields are not empty
      if (!email) newErrors.email = "Please enter your email";
      if (!username) newErrors.name = "Please enter your username";
      if (!phone) newErrors.phone = "Please enter your phone number";
      if (!gender) newErrors.gender = "Please select your gender";
    }
  
    // Step 2 validation
    if (step === 2) {
      // Validate region, province, city, and barangay selection
      if (!selectedRegion) newErrors.region = "Please select a region";
      if (!selectedProvince) newErrors.province = "Please select a province";
      if (!selectedCity) newErrors.city = "Please select a city";
      if (!selectedBarangay) newErrors.barangay = "Please select a barangay";
      if (!postalCode) newErrors.postalCode = "Please enter your postal code";
      if (!address) newErrors.address = "Please enter your street address";
    }
  
    setErrors(newErrors);
    
    // Return true if no errors, otherwise return false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate before proceeding
    if (!handleValidation()) return;
  
    try {
      // Prepare data for the backend submission
      const formData = {
        email,
        password,
        confirmPassword, // Add confirmPassword to formData
        username,
        phone,
        gender,
        dob: JSON.stringify(dob),  // Ensure dob is a JSON string
        postalCode,
        address,
        label: activeLabel,
        region: selectedRegion?.name, // Region from Step 2
        province: selectedProvince?.name,  // Province from Step 2
        city: selectedCity?.name,  // City from Step 2
        barangay: selectedBarangay?.name, // Barangay from Step 2
      };
  
      // Send data to backend
      const response = await fetch("http://localhost:8000/submit_account.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData), // Convert formData to x-www-form-urlencoded format
      });
  
      const textResponse = await response.text();
      console.log("Raw response:", textResponse);  // Log for debugging
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response and handle success/error
      try {
        const data = JSON.parse(textResponse);  // Try to parse the response
        if (data.success) {
          setModalMessage("Account created successfully!");
          setModalType("success");
        } else {
          setModalMessage("Account creation failed. Please try again.");
          setModalType("error");
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError, textResponse);
        setModalMessage("An error occurred. Please try again.");
        setModalType("error");
      }
    } catch (error) {
      console.error("Error submitting account information:", error);
      setModalMessage("An error occurred. Please try again.");
      setModalType("error");
    }
  
    setModalVisible(true); // Show modal
  };

  const handleModalClose = () => {
    // Trigger fade-out effect
    setIsFadingOut(true);
  
    // Wait for the fade-out animation to complete before navigating
    setTimeout(() => {
      setModalVisible(false); // Hide the modal
      navigate('/login'); // Navigate to the login page
    }, 300); // Match this duration with the CSS transition (0.3s)
  };

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeHeader, setActiveHeader] = useState("Region");

  // Fetch Regions on Load
  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/regions/")
      .then((response) => response.json())
      .then((data) => setRegions(data))
      .catch((error) => console.error("Error fetching regions:", error));
  }, []);

  const fetchProvinces = (regionCode) => {
    fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`)
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error fetching provinces:", error));
  };

  const fetchCities = (provinceCode) => {
    fetch(
      `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`
    )
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  };

  const fetchBarangays = (cityCode) => {
    fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`
    )
      .then((response) => response.json())
      .then((data) => setBarangays(data))
      .catch((error) => console.error("Error fetching barangays:", error));
  };

  const handleHeaderClick = (header) => {
    setActiveHeader(header);
  };

  const handleSelectItem = (item) => {
    if (activeHeader === "Region") {
      setSelectedRegion(item);
      setProvinces([]); // Reset dependent dropdowns
      setCities([]);
      setBarangays([]);
      setSelectedProvince(null);
      setSelectedCity(null);
      setSelectedBarangay(null);
      fetchProvinces(item.code);
    } else if (activeHeader === "Province") {
      setSelectedProvince(item);
      setCities([]);
      setBarangays([]);
      setSelectedCity(null);
      setSelectedBarangay(null);
      fetchCities(item.code);
    } else if (activeHeader === "City") {
      setSelectedCity(item);
      setBarangays([]);
      setSelectedBarangay(null);
      fetchBarangays(item.code);
    } else if (activeHeader === "Barangay") {
      setSelectedBarangay(item);
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

      {/* Modal Component */}
      <Modal
        isVisible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={handleModalClose}
        isFadingOut={isFadingOut} // Pass the fade-out state
      />

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
            <div className={styles.passwordWrapper}>
              <input
                type={passwordVisible ? 'text' : 'password'} // Toggle the input type
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
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
            <div className={styles.passwordWrapper}>
              <input
                type={passwordVisible ? 'text' : 'password'} // Toggle the input type
                name="confirmPassword"
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
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

            <label>Username</label>
            <p>This username will appear on your profile</p>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <label>Region, Province, City, Barangay</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder={
                  `${selectedRegion?.name || "Region"}, ` +
                  `${selectedProvince?.name || "Province"}, ` +
                  `${selectedCity?.name || "City"}, ` +
                  `${selectedBarangay?.name || "Barangay"}`
                }
                className={styles.input}
                readOnly
              />
              <span
                className={styles.icon}
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
              >
                {isDropdownVisible ? <FaChevronDown /> : <FaChevronUp />}
              </span>
            </div>

            {isDropdownVisible && (
              <div className={styles.dropdown}>
                <table>
                  <thead>
                    <tr>
                      {["Region", "Province", "City", "Barangay"].map(
                        (header) => (
                          <th
                            key={header}
                            onClick={() => handleHeaderClick(header)}
                            className={
                              activeHeader === header ? "active-header" : ""
                            }
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(activeHeader === "Region"
                      ? regions
                      : activeHeader === "Province"
                      ? provinces
                      : activeHeader === "City"
                      ? cities
                      : barangays
                    )?.map((item) => (
                      <tr
                        key={item.code}
                        onClick={() => handleSelectItem(item)}
                      >
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          {item.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
          <div className={styles.googleMap}>
              <MapContainer />
            </div>
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

            <button onClick={handleSubmit} className={styles.signUpBtn}>Sign up</button>

        </div>
      )}
    </div>
  );
};

export default AccInfo;
