import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

// Import images upfront for better performance and readability
import carouselIcon from '../assets/icons/Carousel.png';
import carouselActiveIcon from '../assets/icons/Carousel-Active.png';
import openBookIcon from '../assets/icons/Open-Book.png';
import openBookActiveIcon from '../assets/icons/Open-Book-Active.png';
import searchIcon from '../assets/icons/Search.png';
import userIcon from '../assets/icons/User.png';
import userActiveIcon from '../assets/icons/User-Active.png';
import shoppingBagIcon from '../assets/icons/Shopping-Bag.png';
import logo from '../assets/logo.png';

const Header = () => {
  const [activeNav, setActiveNav] = useState(''); // Track active nav
  const [cartCount] = useState(0); // Static cart count (replace with dynamic value if needed)
  const [isSearchActive, setIsSearchActive] = useState(false); // Track search bar activation
  const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false);
  const [isReadingAgeMenuVisible, setIsReadingAgeMenuVisible] = useState(false);
  const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);
  const [isBurgerClicked, setIsBurgerClicked] = useState(false);

  const [userName, setUserName] = useState("Guest");  // Default to Guest

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = sessionStorage.getItem("email");
  
      if (email) {
        console.log("Email found in sessionStorage:", email); // Debugging line
        try {
          const response = await fetch(`http://localhost:8000/getUserDetails.php?email=${email}`);
  
          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }
  
          const data = await response.json();
          console.log("Fetched user details:", data); // Debugging line
  
          // Check if firstName and lastName exist in the response
          if (data.firstName || data.lastName) {
            setUserName(`${data.firstName} ${data.lastName}`.trim());
          } else {
            setUserName("Guest");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          setUserName("Guest");
        }
      } else {
        console.log("No email found in sessionStorage");
      }
    };
  
    fetchUserDetails();
  }, []); // Run only once when the component mounts
  
  
  // Toggle burger menu visibility and state
  const toggleBurgerMenu = () => {
    if (isBurgerClicked) {
      // Deactivate the burger menu
      setIsBurgerClicked(false);
      setIsBurgerMenuVisible(false);
      setActiveNav(''); // Reset active nav
    } else {
      // Activate the burger menu
      setIsBurgerClicked(true);
      setIsBurgerMenuVisible(true);
      setActiveNav('burger'); // Optionally set 'burger' as active nav
      setIsReadingAgeMenuVisible(false);
      setIsCategoryMenuVisible(false);
    }
  };

  const toggleReadingAgeMenu = () => {
    setIsReadingAgeMenuVisible(!isReadingAgeMenuVisible);
    setIsBurgerMenuVisible(false);
    setIsBurgerClicked(false);
    setIsCategoryMenuVisible(false);
};

const toggleCategoryMenu = () => {
    setIsCategoryMenuVisible(!isCategoryMenuVisible);
    setIsBurgerMenuVisible(false);
    setIsBurgerClicked(false);
    setIsReadingAgeMenuVisible(false);
};

  // Handle navigation item click
  const handleNavClick = (navItem) => {
    if (activeNav === navItem) {
      setActiveNav(''); // Deactivate if it's already active
    } else {
      setActiveNav(navItem); // Activate the clicked item
    }
  };

  // Handle search bar activation toggle
  const handleSearchClick = () => {
    setIsSearchActive(!isSearchActive); // Toggle search bar activation
  };

  return (
    <header>
      <div className="top-header">
        <div className="top-content">
          <span className="bookpass-text">
            Get your book pass now to take advantage of our amazing deals!{' '}
            <Link to="#" className="details-link">See more details.</Link>
          </span>
          <div className="user-info">
            {userName === "Guest" ? (
              <span className="guest-text">
                Hi! <span className="guest-name">{userName}</span>{' '}
                <Link to="/login" className="login-link">Log in</Link>
              </span>
            ) : (
              <span className="login-text">
                Welcome back, <span className="user-name">{userName}</span>!
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="navbar">

          <div  className={`burger-container ${isBurgerClicked ? 'active' : ''}`} 
  onClick={toggleBurgerMenu}>
            <div className="burger-menu">
              <div className={`burger-bar ${isBurgerClicked ? 'clicked' : 'unclicked'}`}></div>
              <div className={`burger-bar ${isBurgerClicked ? 'clicked' : 'unclicked'}`}></div>
              <div className={`burger-bar ${isBurgerClicked ? 'clicked' : 'unclicked'}`}></div>
            </div>
          </div>

        {/* Navbar Links */}
        <div className='shop-nav'>
          <ul>
            <li className='r-age' onClick={toggleReadingAgeMenu}>
              <Link to="#" onClick={() => handleNavClick('reading-age')}
                className={activeNav === 'reading-age' ? 'active' : ''}>
                <img
                  src={activeNav === 'reading-age' ? carouselActiveIcon : carouselIcon}
                  alt='Shop by Reader'
                />
                Shop by Reading Age
              </Link>
            </li>
            <li className='b-genre' onClick={toggleCategoryMenu}>
              <Link to="#" onClick={() => handleNavClick('book-genre')}
                className={activeNav === 'book-genre' ? 'active' : ''}>
                <img
                  src={activeNav === 'book-genre' ? openBookActiveIcon : openBookIcon}
                  alt='Shop by Book Genre'
                />
                Shop by Book Genre
              </Link>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <div className='logo-girl'>
          <Link className="logo-image" to="/home"><img src={logo} alt='Childhood Logo'/></Link>
        </div>

        {/* Icons and Cart */}
        <div className='icons'>
          <div className={`icon2 ${activeNav === 'search' ? 'active-icon' : ''}`}>
            <Link to="#" onClick={handleSearchClick}>
              <img src={searchIcon} alt='Search'/>
            </Link>
            {/* Search bar */}
            <div className={`search-bar ${isSearchActive ? 'active' : ''}`}>
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className='icon2'>
            <Link to="/login" onClick={() => handleNavClick('user')}>
              <img
                src={activeNav === 'user' ? userActiveIcon : userIcon}
                alt='User'
              />
            </Link>
          </div>
          <div className={`icon2 cart-icon ${activeNav === 'cart' ? 'icon-active' : ''}`} onClick={() => handleNavClick('cart')}>
            <img src={shoppingBagIcon} alt='Shopping Bag'/>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>
        </div>
      </div>

              {/* Burger Menu */}
              <div className={`menu ${isBurgerMenuVisible ? "visible" : "hidden"}`}>
            <div className="menu-section">
                <h3>Childhood</h3>
                <ul>
                    <li>About Us</li>
                    <li>Our Impact</li>
                    <li>Sustainability</li>
                    <li>Our Inspiration</li>
                    <li>Ingredients Glossary</li>
                </ul>
            </div>
        </div>

                    {/* Shop by Reading Age Menu */}
                    <div className={`menu ${isReadingAgeMenuVisible ? "visible" : "hidden"}`}>
                <div className="menu-section">
                    <h3>Shop by Reading Age</h3>
                    <ul>
                        <li>0-2 Years</li>
                        <li>3-5 Years</li>
                        <li>6-8 Years</li>
                        <li>9-12 Years</li>
                        <li>Teens</li>
                    </ul>
                </div>
            </div>

            {/* Shop by Category Menu */}
            <div className={`menu ${isCategoryMenuVisible ? "visible" : "hidden"}`}>
                <div className="menu-section">
                    <h3>Shop by Category</h3>
                    <ul>
                        <li>Books</li>
                        <li>Toys</li>
                        <li>Games</li>
                        <li>Clothing</li>
                        <li>Accessories</li>
                    </ul>
                </div>
            </div>
    </header>
  );
};

export default Header;
