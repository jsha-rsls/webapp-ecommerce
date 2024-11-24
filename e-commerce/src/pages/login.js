import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineExclamationCircle } from 'react-icons/ai'; 
import styles from '../styles/login.module.css';
import '../styles/global.css';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // Use useNavigate for navigation

  // Dynamically load Google API script
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client"; // Updated API
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: "721590458157-itmi52dge12bt55v4k063g7im2kra6sr.apps.googleusercontent.com", // Use your Google client ID here
            callback: (response) => {
              if (response.credential) {
                const googleUser = jwtDecode(response.credential); // Decode the JWT token to extract user info
                console.log("Google User Info:", googleUser);
    
                // Store the user's Google email and details in sessionStorage
                sessionStorage.setItem("email", googleUser.email);
                sessionStorage.setItem("user", JSON.stringify({ name: googleUser.name, email: googleUser.email }));
    
                // Redirect to home page
                navigate("/home");
              } else {
                console.error("Google login failed");
              }
            },
          });
        } else {
          console.error("Google API not loaded properly.");
        }
      };
    
      script.onerror = (error) => {
        console.error("Error loading Google API script:", error);
      };
    };
    

    loadGoogleScript();
  }, [navigate]); // Include navigate to avoid warning about missing dependencies

  const handleGoogleSignIn = () => {
    // Ensure the Google object is loaded before calling the prompt
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      console.error('Google Sign-In is not initialized.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let emailError = '';
    let passwordError = '';

    if (!email) emailError = 'Please enter your Childhood email or username.';
    if (!password) passwordError = 'Please enter your password.';

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      // Perform login logic here
      loginUser(email, password);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save the user details and email in sessionStorage
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to a protected route
        navigate('/home');
      } else {
        // Show error message if login fails
        setErrors({ ...errors, password: data.error });
      }
    } catch (error) {
      console.error('Login failed', error);
      setErrors({ ...errors, email: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={require('../assets/main-logo.png')} alt="Childhood Logo" />
      </div>
      <h1 className={styles.title}>Log in to Childhood</h1>

      <div className={styles.authButtons}>
        <button className={styles.googleButton} onClick={handleGoogleSignIn}>
          <img src={require('../assets/icons/Google.png')} alt="Google" /> Continue with Google
        </button>
        <Link to="/bookPass">
          <button className={styles.bookPassButton}>
            <img src={require('../assets/icons/Password Book.png')} alt="Book Pass" /> Continue with Book Pass
          </button>
        </Link>
      </div>

      <div className={styles.divider}></div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <h5>Email or username</h5>
          <input
            type="text"
            name="username"
            placeholder="Email or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
          />
          {errors.email && (
            <p className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors.email}
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

        <button type="submit" className={styles.loginButton}>Log in</button>
      </form>

      <div className={styles.extraOptions}>
        <Link to="/forgotPass" className={styles.forgotPassword}>Forgot your password?</Link>
        <p>
          Don’t have an account?{' '}
          <Link to="/signUp" className={styles.signUp}>Sign up for Childhood</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
