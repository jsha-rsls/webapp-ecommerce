  import React, { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { AiOutlineExclamationCircle, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Import eye icons
  import styles from '../styles/login.module.css';
  import '../styles/global.css';
  import { jwtDecode } from 'jwt-decode';
  import Modal from "../components/modal"; // Import the Modal component

  const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [backendError, setBackendError] = useState('');
    const navigate = useNavigate();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');
    
    // State for password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);

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

                  navigate("/acc-info", {
                    state: {
                      email: googleUser.email,
                      name: googleUser.name,
                    },
                  });
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
    }, [navigate]);
    
    const handleGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.prompt();
      } else {
        console.error('Google Sign-In is not initialized.');
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    
      let newErrors = {};
    
      // Updated email validation regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
      // Validate email/username
      if (!emailOrUsername) {
        newErrors.emailOrUsername = 'Please Enter Your Childhood Email or Username.';
      } else if (!emailRegex.test(emailOrUsername)) {
        newErrors.emailOrUsername = 'Please Enter a Valid Email Address.';
      }
    
      // Validate password
      if (!password) {
        newErrors.password = 'Please Enter Your Password.';
      }
    
      setErrors(newErrors);
    
      if (Object.keys(newErrors).length === 0) {
        // No validation errors, proceed to login
        loginUser(emailOrUsername, password);
      }
    };

    const loginUser = async (emailOrUsername, password) => {
      try {
        const response = await fetch('http://localhost:8000/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            email: emailOrUsername, // Send email or username to backend
            password: password,
          }),
        });
    
        const data = await response.json();
    
        if (data.success) {
          // Save user details in sessionStorage (can consider using localStorage for persistent login)
          sessionStorage.setItem('userEmail', data.email); // Save email as userEmail
          sessionStorage.setItem('user', JSON.stringify(data.user)); // Store user data
    
          // Show success message
          setModalType('success');
          setModalMessage('Login successful!');
          setModalVisible(true);
    
          // Redirect after a short delay to home page
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        } else {
          const error = data.error || 'Invalid login credentials.';
          setBackendError(error);
          setModalType('error');
          setModalMessage(error);
          setModalVisible(true);
        }
      } catch (error) {
        console.error('Login failed', error);
        setModalType('error');
        setModalMessage('An error occurred. Please try again.');
        setModalVisible(true);
      }
    };

    const renderErrorMessage = (field) => {
      if (errors[field]) {
        return (
          <p className={styles.errorMessage}>
            <AiOutlineExclamationCircle className={styles.errorIcon} /> {errors[field]}
          </p>
        );
      } else if (field === 'emailOrUsername' && backendError) {
        return (
          <p className={styles.errorMessage}>
            <AiOutlineExclamationCircle className={styles.errorIcon} /> {backendError}
          </p>
        );
      }
      return null;
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

        <Modal
          isVisible={modalVisible}
          message={modalMessage}
          type={modalType}
          onClose={() => setModalVisible(false)}
        />

        <div className={styles.divider}></div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <h5>Email or Username</h5>
            <input
              type="text"
              name="username/email"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className={`${styles.input} ${errors.emailOrUsername ? styles.errorInput : ''}`}
            />
            {renderErrorMessage('emailOrUsername')}
          </div>

          <div className={styles.inputGroup}>
            <h5>Password</h5>
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
            {renderErrorMessage('password')}
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
