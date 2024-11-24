// src/pages/home.js
import React from 'react';
import styles from '../styles/home.module.css';
import '../styles/global.css';
import HomeHeader from '../components/home-header';

const Home = () => {
  return (
    <div>
        <HomeHeader /> {/* Display HomeHeader */}
      <div className={styles.banner}></div>
    </div>
  );
};

export default Home;
