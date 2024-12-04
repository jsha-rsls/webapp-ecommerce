import React, { useState } from 'react';
import '../styles/global.css';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../styles/viewBucket.module.css'; // Import styles
import { HiCheckBadge } from "react-icons/hi2";
import { BiMoney, BiSolidCar } from "react-icons/bi";

const ViewBucket = () => {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Ang Maligayang Kapaskuhan (Hardcover)",
      author: "Kenpachi",
      price: 500.4,
      quantity: 1,
    },
    {
      id: 2,
      title: "Ang Maligayang Kapaskuhan (Hardcover)",
      author: "Kenpachi",
      price: 500.4,
      quantity: 2,
    },
  ]);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1>Your Bucket</h1>
        {/* Progress Bar */}
        <div className={`${styles.progressBar} ${styles[`active-${activeStep}`]}`}>
          <div className={styles.stepContainer}>
            <div
              className={`${styles.step} ${activeStep === 1 ? styles.active : ''}`}
              onClick={() => handleStepClick(1)}
            >
              <HiCheckBadge className={styles.icon} />
            </div>
            <p className={styles.label}>BUCKET CHECKING</p>
          </div>

          <div className={styles.stepContainer}>
            <div
              className={`${styles.step} ${activeStep === 2 ? styles.active : ''}`}
              onClick={() => handleStepClick(2)}
            >
              <BiMoney className={styles.icon} />
            </div>
            <p className={styles.label}>PAYMENT</p>
          </div>

          <div className={styles.stepContainer}>
            <div
              className={`${styles.step} ${activeStep === 3 ? styles.active : ''}`}
              onClick={() => handleStepClick(3)}
            >
              <BiSolidCar className={styles.icon} />
            </div>
            <p className={styles.label}>TO SHIP</p>
          </div>
        </div>

        {/* Content Below Progress Bar */}
        <div className={styles.content}>
          {activeStep === 1 && 
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemImage}></div>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.author}</p>
                      </div>
                    </div>
                  </td>
                  <td>₱{item.price.toFixed(2)}</td>
                  <td>
                    <div className={styles.quantityControls}>
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => removeItem(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          }

          {activeStep === 2 && <p>This is the PAYMENT content.</p>}

          {activeStep === 3 && <p>This is the TO SHIP content.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewBucket;
