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
  });

  // Step navigation
  const nextStep = () => {
    let emailError = "";
    let codeError = "";

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      emailError = "This email is invalid. Make sure it's written like example@email.com";
    }

    if (!code.match(/^\d{6}$/)) {
      codeError = "Please enter your 6 digit code.";
    }

    setErrors({ ...errors, email: emailError, code: codeError });

    if (!emailError && !codeError) setStep(2);
  };

  const previousStep = () => setStep(1);

  const handleUpdatePassword = () => {
    let passwordError = "";
    let confirmPasswordError = "";
  
    if (!password) {
      passwordError = "Please enter your password.";
    }
  
    if (!confirmPassword || confirmPassword !== password) {
      confirmPasswordError = "Password and Confirm Password does not match.";
    }
  
    // Update error state
    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });
  
    if (!passwordError && !confirmPasswordError) {
      console.log("Password updated successfully!");
      // Implement update password logic here
    }
  };
  

  return (
    <div className={styles.fpassContainer}>
      <div className={styles.logo}>
        <img src={require("../assets/main-logo.png")} alt="Childhood" />
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={step >= 1 ? styles.activeProgress : styles.inactiveProgress} />
        <div className={step === 2 ? styles.activeProgress : styles.inactiveProgress} />
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
                className={`${styles.input} ${errors.email ? styles.errorInput : ""}`}
              />
              <IoArrowForwardCircle className={styles.inputIcon} />
            </div>
            {errors.email && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.email}
              </p>
            )}

            <label>Code</label>
            <div
              className={`${styles.inputContainer} ${
                errors.code ? styles.errorInputContainer : ""
              }`}
            >
              <input
                type="text"
                placeholder="xxxxxx"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`${styles.input} ${errors.code ? styles.errorInput : ""}`}
              />
            </div>
            {errors.code && (
              <p className={styles.errorMessage}>
                <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.code}
              </p>
            )}
          </form>
          <button onClick={nextStep} className={styles.nextBtn}>
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
              errors.password || errors.confirmPassword ? styles.errorInputContainer : ""
            }`}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${
                errors.password || errors.confirmPassword ? styles.errorInput : ""
              }`}
            />
          </div>
          {/* Error Message for Password */}
          {errors.password && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.password}
            </p>
          )}
      
          {/* Confirm Password Input */}
          <label>Confirm Password</label>
          <div
            className={`${styles.inputContainer} ${
              errors.confirmPassword || errors.password ? styles.errorInputContainer : ""
            }`}
          >
            <input
              type="password"
              placeholder="Re-type password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${styles.input} ${
                errors.confirmPassword || errors.password ? styles.errorInput : ""
              }`}
            />
          </div>
          {/* Error Message for Confirm Password */}
          {errors.confirmPassword && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.confirmPassword}
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
