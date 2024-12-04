import React, { useState } from 'react';
import EditAddressModal from './EditAddressModal'; // Import the modal component
import '../styles/global.css';

const MyAddresses = () => {
  const [hover, setHover] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const styles = {
    addContainer: {
      padding: '20px',
      fontFamily: 'Rethink Sans',
    },
    h2: {
      fontSize: '50px',
      fontWeight: 800,
      marginBottom: '40px',
      textAlign: 'center',
    },
    addressBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '30%',
      margin: '0 auto',
      padding: '15px',
      border: '2px solid #000',
      borderRadius: '5px',
      marginBottom: '10px',
    },
    labelname: {
      fontSize: '17px',
      paddingRight: '120px',
      marginLeft: '30px',
    },
    editButton: {
      padding: '5px 10px',
      marginLeft: '40px',
      backgroundColor: 'transparent',
      color: '#000',
      fontWeight: 'bold',
      fontSize: '16px',
      fontFamily: 'Rethink Sans',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '5px 10px',
      backgroundColor: 'transparent',
      color: '#000',
      fontWeight: 'bold',
      fontSize: '16px',
      fontFamily: 'Rethink Sans',
      border: 'none',
      cursor: 'pointer',
    },
    addButton: {
      padding: '13px 15px',
      fontSize: '18px',
      fontWeight: 'bold',
      fontFamily: 'Rethink Sans',
      backgroundColor: '#000',
      opacity: hover ? 0.8 : 1,
      transform: hover ? 'scale(1.05)' : 'scale(1)',
      color: '#fff',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      marginTop: '30px',
      width: '30%',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
    },
    checkbox: {
      marginLeft: '10px',
      cursor: 'pointer',
      width: '20px',
      height: '20px',
      accentColor: '#000',
    },
  };

  return (
    <div style={styles.addContainer}>
      <h2 style={styles.h2}>YOUR ADDRESS</h2>
      <div style={styles.addressBox}>
        <input type="checkbox" id="address1" style={styles.checkbox} />
        <label htmlFor="address1" style={styles.labelname}>Kenpachi</label>
        <button style={styles.editButton}>Edit</button>
        <button style={styles.deleteButton}>Delete</button>
      </div>
      <button
        style={styles.addButton}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setModalOpen(true)} // Open the modal
      >
        ADD NEW ADDRESS
      </button>
      {/* Include the Modal */}
      <EditAddressModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default MyAddresses;
