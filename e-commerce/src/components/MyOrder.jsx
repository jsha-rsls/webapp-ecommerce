import React from 'react';
import '../styles/global.css';

const MyOrder = () => {
    const products = [
        { 
            image: 'path_to_image', // Replace with actual image URL
            name: 'Kenpachi',
            address: 'Kasiglahan Village, Rodriguez, Rizal', 
        },
        { 
            image: 'path_to_image', 
            name: 'Kenpachi',
            address: 'Kasiglahan Village, Rodriguez, Rizal', 
        },
        { 
            image: 'path_to_image', 
            name: 'Kenpachi',
            address: 'Kasiglahan Village, Rodriguez, Rizal', 
        }
    ];

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'auto',
            width: '100%',
        },
        header: {
            textAlign: 'center',
            fontFamily: 'Rethink Sans',
            fontSize: '50px',
            fontWeight: 800,
            marginBottom: '20px',
        },
        orderContainer: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            padding: '20px',
            gap: '50px',
        },
        orderCard: {
            backgroundColor: 'white',
            width: '250px',
            height: '400px',
            borderRadius: '5px',
            border: '1px solid #000',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
        },
        orderImg: {
            width: '200px',
            height: '200px',
            backgroundColor: 'black',
            marginBottom: '20px',
        },
        orderDetails: {
            textAlign: 'left',
            fontSize: '14px',
            fontFamily: 'Rethink Sans',
            fontWeight: 700,
            marginBottom: '30px',
            paddingLeft: '10px',
            
        },
        button: {
            padding: '10px 60px',
            backgroundColor: '#000',
            fontSize: '15px',
            fontFamily: 'Rethink Sans',
            fontWeight: 700,
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            textTransform: 'uppercase',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>YOUR ORDERS</div>
            <div style={styles.orderContainer}>
                {products.map((product, index) => (
                    <div key={index} style={styles.orderCard}>
                        <div style={styles.orderImg}></div> {/* Placeholder for image */}
                        <div style={styles.orderDetails}>
                            <p style={{paddingBottom: '5px'}}>{product.name}</p>
                            <p>{product.address}</p>
                        </div>
                        <button style={styles.button}>DETAILS</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrder;
