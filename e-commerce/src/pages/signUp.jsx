import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import styles from '../styles/signUp.module.css';
import '../styles/global.css';
import { AiOutlineExclamationCircle } from "react-icons/ai";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("This email is invalid. Make sure it's written like example@email.com");
      return;
    }
  
    // Clear errors and navigate to /acc-info with the email
    setError('');
    navigate('/acc-info', { state: { email } }); // Pass email as state
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={require('../assets/main-logo.png')} alt="Childhood Logo"></img>
      </div>
      <h1 className={styles.title}>Sign up to <br /> start shopping</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h5>Email</h5>
        <div className={`${styles.inputContainer} ${error ? styles.errorInputContainer : ''}`}>
          <input
            type="email"
            name="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${styles.input} ${error ? styles.errorInput : ''}`}
          />
        </div>
        {error && (
          <p className={styles.errorMessage}>
            <AiOutlineExclamationCircle className={styles.errorIcon} /> {error}
          </p>
        )}
        <button type="submit" className={styles.nextButton}>Next</button>
      </form>

      <div className={styles.dividerLeft}></div>
      <p className={styles.or}>or</p>
      <div className={styles.dividerRight}></div>

      <div className={styles.authButtons}>
        <button className={styles.googleButton}>
          <img src={require('../assets/icons/Google.png')} alt="Google"></img> Continue with Google
        </button>
      </div>

      <div className={styles.policy}>
        <p>By signing up, you agree to Childhood’s <br /> 
          <span>Terms of Service</span> & <span>Privacy Policy</span>
        </p>
      </div>  

      <div className={styles.extraOptions}>
        <p>
          Already have an account? <Link to="/login" className={styles.loginHere}>Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
