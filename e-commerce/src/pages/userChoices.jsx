import React, { useState } from 'react';
import styles from '../styles/userChoices.module.css';
import '../styles/global.css';
import Header from '../components/header';
import Footer from '../components/footer';

import { FaUserCircle, FaRegCalendarAlt, FaHeart } from "react-icons/fa";
import { BiSolidLocationPlus } from "react-icons/bi";
import { FaTag } from "react-icons/fa6";

import MyAddresses from '../components/MyAddresses'; 
import Information from  '../components/Information';
import MyOrder from '../components/MyOrder';
import MyWishlist from '../components/MyWishlist';
import MyVouchers from '../components/MyVouchers';

const UserChoices = () => {
  const [activeSection, setActiveSection] = useState(''); 

  const renderSection = () => {
    switch (activeSection) {
      case 'myAddresses':
        return <MyAddresses />;
      case 'information':
        return <Information />;
      case 'myOrder':
        return <MyOrder />;
      case 'myWishlist':
        return <MyWishlist />;
      case 'myVouchers':
        return <MyVouchers />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header /> {/* Display Header */}
      <div className={styles.banner}>
        <div className={styles.navbar}>
          <button
            onClick={() => setActiveSection('information')}
            className={`${styles.navItem} ${
              activeSection === 'information' ? styles.active : ''
            }`}
          >
            <FaUserCircle /> INFORMATION
          </button>
          <button
            onClick={() => setActiveSection('myAddresses')}
            className={`${styles.navItem} ${
              activeSection === 'myAddresses' ? styles.active : ''
            }`}
          >
            <BiSolidLocationPlus />MY ADDRESSES
          </button>
          <button
            onClick={() => setActiveSection('myOrder')}
            className={`${styles.navItem} ${
              activeSection === 'myOrder' ? styles.active : ''
            }`}
          >
            <FaRegCalendarAlt /> MY ORDER
          </button>
          <button
            onClick={() => setActiveSection('myWishlist')}
            className={`${styles.navItem} ${
              activeSection === 'myWishlist' ? styles.active : ''
            }`}
          >
            <FaHeart /> MY WISHLIST
          </button>
          <button
            onClick={() => setActiveSection('myVouchers')}
            className={`${styles.navItem} ${
              activeSection === 'myVouchers' ? styles.active : ''
            }`}
          >
            <FaTag /> MY VOUCHERS
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {renderSection()} {/* Dynamically renders the selected section */}
      </div>
      <Footer className={styles.footer} />
    </div>
  );
};

export default UserChoices;
