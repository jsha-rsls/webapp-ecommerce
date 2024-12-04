import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/forgotPass.module.css";
import "../styles/global.css";
import { FaChevronLeft } from "react-icons/fa6";
import { IoArrowForwardCircle } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const ForgotPass = () => {
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error states
  const [errors, setErrors] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    successMessage: "",
  });

  // Track if the code input should be enabled
  const [isCodeEnabled, setIsCodeEnabled] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(null); // null = not checked, true = verified, false = invalid

  const [emailSuccessMessage, setEmailSuccessMessage] = useState("");
  const [codeSuccessMessage, setCodeSuccessMessage] = useState("");

  // Send code to the email entered
  const sendCode = async () => {
    let emailError = "";

    // Validate email format
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      emailError =
        "This email is invalid. Make sure it's written like example@email.com";
    }

    setErrors({ ...errors, email: emailError });

    // Proceed only if email is valid
    if (!emailError) {
      try {
        // Send POST request to the server
        const response = await fetch("http://localhost:8000/send-code.php", {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        });

        const rawText = await response.text();
        console.log("Raw response:", rawText); // For debugging purposes

        let data;

        try {
          data = JSON.parse(rawText);
        } catch (e) {
          console.error("Invalid JSON received:", rawText);
          setErrors({
            ...errors,
            email: "Unexpected response from the server. Please try again.",
          });
          return;
        }

        // Handle server response
        if (data.success) {
          setIsCodeEnabled(true); // Enable the code input field after successful code send
          setEmailSuccessMessage(data.success); // Success for email step
          setErrors({ ...errors, email: "" }); // Clear email error
          setStep(1); // Stay on step 1 until the code is verified
        } else if (data.error) {
          setErrors({
            ...errors,
            email: data.error, // Show error message if the email is not registered
          });
        }
      } catch (error) {
        console.error("Error sending code:", error);
        setErrors({
          ...errors,
          email:
            "There was an error connecting to the server. Please try again later.",
        });
      }
    }
  };

  const handleCodeChange = async (e) => {
    const enteredCode = e.target.value;
    setCode(enteredCode);

    // Validate code format (if needed)
    if (!enteredCode.match(/^\d{6}$/)) {
      setIsCodeVerified(false);
      setErrors({ ...errors, code: "Please enter a valid 6-digit code." });
      return;
    }

    // Check if the code is valid (dynamically, after every change)
    try {
      const response = await fetch("http://localhost:8000/verify-code.php", {
        method: "POST",
        body: JSON.stringify({ email, code: enteredCode }),
        headers: { "Content-Type": "application/json" },
      });

      const rawText = await response.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("Invalid JSON received:", rawText);
        setErrors({
          ...errors,
          code: "Unexpected response from the server. Please try again.",
        });
        setIsCodeVerified(false);
        return;
      }

      if (data.success) {
        setCodeSuccessMessage(data.success); // Success for code verification step
        setErrors({ ...errors, code: "" }); // Clear code error
        setIsCodeVerified(true); // Set verified if the server returns success
      } else if (data.error) {
        setErrors({ ...errors, code: data.error });
        setIsCodeVerified(false); // Set false if verification fails
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setErrors({
        ...errors,
        code: "There was an error verifying the code. Please try again later.",
      });
      setIsCodeVerified(false);
    }
  };

  // Verify code entered by user
  const verifyCode = async () => {
    let codeError = "";

    if (!code.match(/^\d{6}$/)) {
      codeError = "Please enter your 6-digit code.";
      setIsCodeVerified(false); // Set to false if code format is invalid
    }

    setErrors({ ...errors, code: codeError });

    if (!codeError) {
      try {
        const response = await fetch("http://localhost:8000/verify-code.php", {
          method: "POST",
          body: JSON.stringify({ email, code }), // Include both email and code
          headers: { "Content-Type": "application/json" },
        });

        const rawText = await response.text();
        let data;

        try {
          data = JSON.parse(rawText);
        } catch (e) {
          console.error("Invalid JSON received:", rawText);
          setErrors({
            ...errors,
            code: "Unexpected response from the server. Please try again.",
          });
          setIsCodeVerified(false);
          return;
        }

        if (data.success) {
          setErrors({ ...errors, successMessage: data.success });
          setStep(2); // Proceed to the password reset step
          setIsCodeVerified(true); // Set to true if verification is successful
        } else if (data.error) {
          setErrors({ ...errors, code: data.error });
          setIsCodeVerified(false); // Set to false if verification fails
        }
      } catch (error) {
        console.error("Error verifying code:", error);
        setErrors({
          ...errors,
          code: "There was an error verifying the code. Please try again later.",
        });
        setIsCodeVerified(false);
      }
    }
  };

  const previousStep = () => setStep(1);

  const handleUpdatePassword = async () => {
    let passwordError = "";
    let confirmPasswordError = "";

    if (!password) {
        passwordError = "Please enter your password.";
    }

    if (!confirmPassword || confirmPassword !== password) {
        confirmPasswordError = "Password and Confirm Password do not match.";
    }

    setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
    });

    if (!passwordError && !confirmPasswordError) {
        const response = await fetch("http://localhost:8000/change-password.php", {
            method: "POST",
            body: JSON.stringify({
                email, // Pass the email to the backend
                code,
                newPassword: password,
                confirmPassword,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (data.error) {
            setErrors({ ...errors, ...data });
        } else {
            console.log("Password updated successfully!");
        }
    }
};

  return (
    <div className={styles.fpassContainer}>
      <div className={styles.logo}>
        <img src={require("../assets/main-logo.png")} alt="Childhood" />
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={
            step >= 1 ? styles.activeProgress : styles.inactiveProgress
          }
        />
        <div
          className={
            step === 2 ? styles.activeProgress : styles.inactiveProgress
          }
        />
      </div>

      {/* Step 1: Confirm Email */}
      {step === 1 && (
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <Link to="/login">
              <FaChevronLeft className={styles.back} />
            </Link>
            <div className={styles.stepDetails}>
              <div className={styles.stepTitle}>Step 1 of 2</div>
              <div className={styles.stepDescription}>Confirm Email</div>
            </div>
          </div>
          <form>
            <label>Email</label>
            <div
              className={`${styles.inputContainer} ${
                errors.email ? styles.errorInputContainer : ""
              }`}
            >
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.input} ${
                  errors.email ? styles.errorInput : ""
                }`}
              />
              <button
                type="button"
                onClick={sendCode}
                className={styles.inputIconButton}
              >
                <IoArrowForwardCircle className={styles.inputIcon} />
              </button>
            </div>
            {errors.email && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} />{" "}
                {errors.email}
              </p>
            )}

            {emailSuccessMessage && (
              <p className={styles.successMessage}>
                <AiOutlineExclamationCircle className={styles.successIcon} />{" "}
                {emailSuccessMessage}
              </p>
            )}

            <label>Code</label>
            <div
              className={`${styles.inputContainer} ${
                isCodeVerified === false ? styles.errorInputContainer : "" // Red border if not verified
              } ${isCodeVerified === true ? styles.successInputContainer : ""}`} // Green border if verified
            >
              <input
                type="text"
                placeholder="XXXXXX"
                value={code}
                onChange={handleCodeChange} // Trigger verification on each change
                className={`${styles.input} ${
                  isCodeVerified === false ? styles.errorInput : ""
                } ${isCodeVerified === true ? styles.successInput : ""}`}
                disabled={!isCodeEnabled} // Disable until the code is sent
              />
            </div>

            {errors.code && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} />{" "}
                {errors.code}
              </p>
            )}

            {/* Display success message under the code field */}
            {codeSuccessMessage && (
              <p className={styles.successMessage}>
                <AiOutlineExclamationCircle className={styles.successIcon} />{" "}
                {codeSuccessMessage}
              </p>
            )}
          </form>
          <button onClick={verifyCode} className={styles.nextBtn}>
            Next
          </button>
        </div>
      )}

      {/* Step 2: Change Password */}
      {step === 2 && (
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <button onClick={previousStep}>
              <FaChevronLeft className={styles.back} />
            </button>
            <div className={styles.stepDetails}>
              <div className={styles.stepTitle}>Step 2 of 2</div>
              <div className={styles.stepDescription}>Changing Password</div>
            </div>
          </div>
          <form>
            {/* Password Input */}
            <label>Password</label>
            <div
              className={`${styles.inputContainer} ${
                errors.password || errors.confirmPassword
                  ? styles.errorInputContainer
                  : ""
              }`}
            >
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${
                  errors.password || errors.confirmPassword
                    ? styles.errorInput
                    : ""
                }`}
              />
            </div>
            {/* Error Message for Password */}
            {errors.password && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} />{" "}
                {errors.password}
              </p>
            )}

            {/* Confirm Password Input */}
            <label>Confirm Password</label>
            <div
              className={`${styles.inputContainer} ${
                errors.confirmPassword || errors.password
                  ? styles.errorInputContainer
                  : ""
              }`}
            >
              <input
                type="password"
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${
                  errors.confirmPassword || errors.password
                    ? styles.errorInput
                    : ""
                }`}
              />
            </div>
            {/* Error Message for Confirm Password */}
            {errors.confirmPassword && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} />{" "}
                {errors.confirmPassword}
              </p>
            )}
          </form>
          <button onClick={handleUpdatePassword} className={styles.upPassBtn}>
            Update Password
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPass;
