import React from 'react';
import '../styles/global.css';
import consumer from '../assets/content-images/consumer.png';

const MyVouchers = () => {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        header: {
            textAlign: 'center',
            fontFamily: 'Rethink Sans',
            fontSize: '50px',
            fontWeight: '800',
            marginBottom: '50px',
        },
        greenBg: {
            width: '350px',
            height: '400px',
            backgroundColor: '#26AA99',
            
            marginLeft: '-900px',
            position: 'absolute',
        },
        borderbox: {
            border: '4px solid #000',
            width: '350px',
            height: '370px',
            marginLeft: '-830px',
            marginTop: '-180px',
            position: 'absolute',
        },
        imageContainer: {
            position: 'relative',
        },
        image: {
            width: '700px',
            height: '700px',
            marginLeft: '-700px',
            marginTop: '-20px',
        },
    }




  return (
    <div style={styles.container}>
        <h2 style={styles.header}>YOUR VOUCHERS</h2>
        <div style={styles.greenBg}></div>
        <div style={styles.borderbox}></div>
        <div style={styles.imageContainer}><img src={consumer} alt="consumer" style={styles.image} /></div>
    </div>
  );
};

export default MyVouchers;