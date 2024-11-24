// src/pages/landingshop.js
import React from 'react';
import styles from '../styles/landingshop.module.css';
import '../styles/global.css';
import Header from '../components/header';

const LandingShop = () => {
  return (
    <div>
      <Header /> {/* Display Header */}
      <div className={styles.banner}></div>
    </div>
  );
};

export default LandingShop;
