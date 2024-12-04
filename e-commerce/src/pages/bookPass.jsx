import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import styles from '../styles/bookPass.module.css';
import '../styles/global.css';
import { FaChevronLeft } from 'react-icons/fa6';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

const BookPass = () => {
  const [bookPassID, setBookPassID] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ bookPassID: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');  // State for backend error messages
  const navigate = useNavigate();  // To navigate after successful login

  // Function to auto-format the Book Pass ID as XXX-XXX-XXX and convert to uppercase
  const formatBookPassID = (value) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    value = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    // Format the string in groups of 3 characters
    if (value.length > 9) value = value.substring(0, 9); // Limit to 9 characters
    return value.replace(/([A-Za-z0-9]{3})(?=[A-Za-z0-9])/g, '$1-');
  };

  const handleBookPassIDChange = (e) => {
    const formattedID = formatBookPassID(e.target.value);
    setBookPassID(formattedID);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let idError = '';
    let passwordError = '';

    if (!bookPassID) idError = 'Please enter your book pass id.';
    if (!password) passwordError = 'Please enter your password.';

    setErrors({ bookPassID: idError, password: passwordError });

    if (!idError && !passwordError) {
      try {
        // Send request to backend for login authentication
        const response = await fetch('http://localhost:8000/loginbybookpass.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookPassID, password }), // Send data as JSON
        });

        const data = await response.json();  // Parse the JSON response

        if (response.ok && data.status === 'success') {
          // Redirect to dashboard or any other page on successful login
          navigate('/home');
        } else {
          // Show error message from backend if login fails
          setErrorMessage(data.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setErrorMessage('There was an error processing your login.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/login">
        <FaChevronLeft className={styles.back} />
      </Link>
      <div className={styles.logo}>
        <img src={require('../assets/main-logo.png')} alt="Childhood Logo" />
      </div>
      <h1 className={styles.title}>
        Spark your child's imagination.<br />
        Get your Book Pass now.
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <h5>Book Pass ID</h5>
          <input
            type="text"
            name="bookPassID"
            placeholder="Book Pass ID: XXX-XXX-XXX"
            value={bookPassID}
            onChange={handleBookPassIDChange}
            className={`${styles.input} ${errors.bookPassID ? styles.errorInput : ''}`}
          />
          {errors.bookPassID && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.bookPassID}
            </p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <h5>Password</h5>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
          />
          {errors.password && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.password}
            </p>
          )}
        </div>

        {errorMessage && (
          <p className={styles.errorMessage}>
            <AiOutlineExclamationCircle className={styles.errorIcon} /> {errorMessage}
          </p>
        )}

        <button type="submit" className={styles.loginButton}>
          Log in
        </button>

        <Link>Log in using RFID?</Link>
      </form>
    </div>
  );
};

export default BookPass;
