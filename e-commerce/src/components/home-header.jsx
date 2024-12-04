import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { IoClose } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { TiSocialInstagramCircular } from "react-icons/ti";
import { AiFillTwitterCircle } from "react-icons/ai";

// Import images upfront for better performance and readability
import carouselIcon from '../assets/icons/Carousel.png';
import carouselActiveIcon from '../assets/icons/Carousel-Active.png';
import openBookIcon from '../assets/icons/Open-Book.png';
import openBookActiveIcon from '../assets/icons/Open-Book-Active.png';
import searchIcon from '../assets/icons/Search.png';
import userIcon from '../assets/icons/User.png';
import userActiveIcon from '../assets/icons/User-Active.png';
import shoppingBagIcon from '../assets/icons/Shopping-Bag.png';
import logo from '../assets/home-logo.png';
import mobilePayment from '../assets/icons/Mobile Shop Payment.png';
import footerImg from '../assets/content-images/Group 69.png';
import bToddlers from "../assets/icons/reader-icons/Rattle.png";
import emergentReader from "../assets/icons/reader-icons/ABC Block.png";
import independentReader from "../assets/icons/reader-icons/Reading.png";
import avidReader from "../assets/icons/reader-icons/Book Shelf.png";
import holidaysCeleb from "../assets/icons/genre-icons/Snow Globe.png";
import fiction from "../assets/icons/genre-icons/Wizard.png";
import emotionFeeling from "../assets/icons/genre-icons/Bipolar Disorder.png";
import environmentRespo from "../assets/icons/genre-icons/Potted Plant.png";
import bedtimeStories from "../assets/icons/genre-icons/Lullaby.png";
import specialEduc from "../assets/icons/genre-icons/Star.png";
import familyLife from "../assets/icons/genre-icons/Old-Fashioned Family Photo.png";
import religious from "../assets/icons/genre-icons/Christian Cross.png";
import historical from "../assets/icons/genre-icons/Historical.png";


const Header = () => {
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [activeNav, setActiveNav] = useState(''); // Track active nav
  const [cartCount] = useState(0); // Static cart count (replace with dynamic value if needed)
  const [isSearchActive, setIsSearchActive] = useState(false); // Track search bar activation
  const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false);
  const [isReadingAgeMenuVisible, setIsReadingAgeMenuVisible] = useState(false);
  const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);
  const [isBurgerClicked, setIsBurgerClicked] = useState(false);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false); // Track visibility of user dropdown
  const toggleUserMenu = () => {
    setIsUserMenuVisible(!isUserMenuVisible); // Toggle visibility of the user dropdown
  };

  const [userName, setUserName] = useState("Guest");  // Default to Guest

  // Function to fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = sessionStorage.getItem('userEmail'); // Get email from sessionStorage

      if (email) {
        try {
          const response = await fetch(`http://localhost:8000/getUserDetails.php?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }

          const data = await response.json();

          if (data.username) {
            setUserName(data.username);
          } else {
            setUserName('Guest');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setUserName('Guest');
        }
      } else {
        console.log('No user email found in sessionStorage');
        setUserName('Guest');
      }
    };

    fetchUserDetails();
  }, []); // Empty dependency array to run only once when the component mounts  
  
  
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

// Function to toggle menu visibility
const closeMenu = () => {
  setIsReadingAgeMenuVisible(false); // Hides the menu when called
  setIsCategoryMenuVisible(false);
  setActiveNav(null); // Resets the active navbar state
};

const [showAllHover, setShowAllHover] = useState(false);
const [isAllGenreActive, setIsAllGenreActive] = useState(false);

const handleAllGenreClick = () => {
  setShowAllHover((prevState) => !prevState);
  setIsAllGenreActive((prevState) => !prevState); // Toggle between active and inactive
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

  const handleLogout = () => {
    sessionStorage.removeItem('userEmail'); // Remove email from sessionStorage
    sessionStorage.removeItem('user'); // Optional: Remove other user-related data
    navigate('/login'); // Redirect to login page
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
        <div className='home-logo'>
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
  <Link to="#" onClick={toggleUserMenu}>
    <img
      src={activeNav === 'user' ? userActiveIcon : userIcon}
      alt='User'
    />
  </Link>
  
  {/* User dropdown menu */}
  {isUserMenuVisible && (
    <div className="user-dropdown">
      <ul>
        <li>My Profile</li>
        <li>My Addresses</li>
        <li>My Orders</li>
        <li>My Wishlist</li>
        <li>My Vouchers</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  )}
</div>
          <div className={`icon2 cart-icon ${activeNav === 'cart' ? 'icon-active' : ''}`} onClick={() => handleNavClick('cart')}>
            <img src={shoppingBagIcon} alt='Shopping Bag'/>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>
        </div>
      </div>

        {/* Burger Menu */}
        <div className={`menu close ${isBurgerMenuVisible ? "visible" : "hidden"}`}>
          <div className="menu-container">
            <div className="menu-section">
              <h3>Discover Childhood: Children’s Book Store</h3>
                <ul>
                  <Link to=''><li>About Us</li></Link>
                  <Link to=''><li>Book Pass</li></Link>
                  <Link to=''><li>Prelove Books</li></Link>
                  <Link to=''><li>Terms and Agreement</li></Link>
                </ul>
            </div>
            <div className="option-container">
              <div className="payment-section">
                <h3>Payment Methods</h3>
                  <img src={mobilePayment} alt="" /><p>Digital Wallets (Paypal)</p>
              </div>
              <div className="social-media">
                <h3>Follow our social media</h3>
                <div className="media-platform">
                  <FaFacebook size={20} style={{marginRight: 10, marginBottom: 10}}/>
                  <TiSocialInstagramCircular size={25} style={{marginRight: 10, marginBottom: 10}}/>
                  <AiFillTwitterCircle size={22} style={{marginBottom: 9}}/>
                </div>
              </div>
            </div>
            <div className="footerImg">
              <div className="footer-linebox"></div>
              <img src={footerImg} alt="" />
            </div>
          </div>
        </div>

        {/* Shop by Reading Age Menu */}
        <div className={`menu ${isReadingAgeMenuVisible ? "visible" : "hidden"}`}>
          <div className="shop-by-reader">
            <div className="reader-wrapper">
              <div className="reader-category toddlers">
                <div className="reader-image">
                  <img src={bToddlers} alt="Babbies & Toddlers"/>
                </div>
                <div className="hover-text">Babbies and Toddlers</div>
              </div>
            </div>

            <div className="reader-wrapper">
              <div className="reader-category emergent">
                <div className="reader-image">
                  <img src={emergentReader} alt="Emergent Readers"/>
                </div>
                <div className="hover-text">Emergent Readers</div>
              </div>
              
            </div>

            <div className="reader-wrapper">
              <div className="reader-category independent">
                <div className="reader-image">
                  <img src={independentReader} alt="Independent Readers"/>
                </div>
                <div className="hover-text">Independent Readers</div>
              </div>
              
            </div>

            <div className="reader-wrapper">
              <div className="reader-category avid">
                <div className="reader-image">
                  <img src={avidReader} alt="Avid Readers"/>
                </div>
                <div className="hover-text">Avid Readers</div>
              </div>
            </div>

            <div className="close" onClick={closeMenu}>
              <span>
                Close <IoClose className="close-icon" size={20} />
              </span>
            </div>
          </div>
        </div>

          {/* Shop by Category Menu */}
        <div className={`menu category ${isCategoryMenuVisible ? "visible" : "hidden"}`}>
          <div className="shop-by-category">
            <div className="category-wrapper">
              <div className={`genre-category allGenre ${isAllGenreActive ? "active" : ""}`}
                    onClick={handleAllGenreClick}>
                <div className="category-image">
                  <p>All <br />Genre</p>
                </div>
                <div className="hover-text-genre">All <br />Genre</div>
              </div>
            </div>

            <div className="category-wrapper">
              <div className={`genre-category ${showAllHover ? "global-hover" : ""} holidays`}>
                <div className="category-image">
                  <img src={holidaysCeleb} alt="Holidays & Celebrations"/>
                </div>
                <div className="hover-text-genre">Holidays & Celebrations</div>
              </div>
            </div>
            
            <div className="category-wrapper">
              <div className={`genre-category ${showAllHover ? "global-hover" : ""} fiction`}>
                <div className="category-image">
                  <img src={fiction} alt="Fiction"/>
                </div>
                <div className="hover-text-genre">Fiction</div>
              </div>
            </div>

            <div className="category-wrapper">
              <div className={`genre-category ${showAllHover ? "global-hover" : ""} emotion`}>
                <div className="category-image">
                  <img src={emotionFeeling} alt="Emotions & Feelings"/>
                </div>
                <div className="hover-text-genre">Emotions & Feelings</div>
              </div>
            </div>

            <div className="category-wrapper">
              <div className={`genre-category ${showAllHover ? "global-hover" : ""} envi`}>
                <div className="category-image">
                  <img src={environmentRespo} alt="Environmental Responsibility"/>
                </div>
                <div className="hover-text-genre">Environmental Responsibility</div>
              </div>
            </div>

            <div className="category-wrapper">
              <div className={`genre-category ${showAllHover ? "global-hover" : ""} bedtime`}>
                <div className="category-image">
                  <img src={bedtimeStories} alt="Bedtime Stories"/>
                </div>
                <div className="hover-text-genre">Bedtime Stories</div>
              </div>
            </div>

            <div className="category-wrapper">
              <div className={`genre-category ${showAllHover ? "global-hover" : ""} educ`}>
                <div className="category-image">
                  <img src={specialEduc} alt="Special Educational Needs"/>
                </div>
                <div className="hover-text-genre">Special Educational Needs</div>
              </div>
            </div>
            
            <div className="category-wrapper">
              <div className={`genre-category ${showAllHover ? "global-hover" : ""} famlife`}>
                <div className="category-image">
                  <img src={familyLife} alt="Family Life"/>
                </div>
                <div className="hover-text-genre">Family Life</div>
              </div>
            </div>

            <div className="category-wrapper">
              <div className={`genre-category ${showAllHover ? "global-hover" : ""} religious`}>
                <div className="category-image">
                  <img src={religious} alt="Religious Themes"/>
                </div>
                <div className="hover-text-genre">Religious Themes</div>
              </div>
            </div>

            <div className="category-wrapper">
              <div className={`genre-category ${showAllHover ? "global-hover" : ""} historical`}>
                <div className="category-image">
                  <img src={historical} alt="Historical Events"/>
                </div>
                <div className="hover-text-genre">Historical Events</div>
              </div>
            </div>

            <div className="close" onClick={closeMenu}>
              <span>
                Close <IoClose className="close-icon" size={20} />
              </span>
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header;
