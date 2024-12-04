import React from 'react';
import '../styles/global.css';
import { FaHeart } from "react-icons/fa";

import mylittleDinosaur from '../assets/book-photos/babbies-toddlers/BEDTIME STORIES.png';

const MyWishlist = () => {
    const products = [
        {
            title: 'My Little Dinosaur (Hardcover)',
            price: '₱640.00',
            originalPrice: '₱800.00',
            discount: '-20%',
            label: 'Best Seller',
            image: mylittleDinosaur,
            saleType: 'Sale',
        },
        {
            title: 'My Little Dinosaur (Hardcover)',
            price: '₱640.00',
            originalPrice: '₱800.00',
            discount: '-20%',
            label: 'Best Seller',
            image: mylittleDinosaur,
            saleType: 'Sale',
        },
        {
            title: 'My Little Dinosaur (Hardcover)',
            price: '₱640.00',
            originalPrice: '₱800.00',
            discount: '-20%',
            label: 'Best Seller',
            image: mylittleDinosaur,
            saleType: 'Sale',
        },
        {
            title: 'My Little Dinosaur (Hardcover)',
            price: '₱640.00',
            originalPrice: '₱800.00',
            discount: '-20%',
            label: 'Best Seller',
            image: mylittleDinosaur,
            saleType: 'Sale',
        },
    ];

    const styles = {
        header: {
            textAlign: 'center',
            fontFamily: 'Rethink Sans',
            fontSize: '50px',
            fontWeight: '800',
            marginBottom: '20px',
        },
        productCardWrapper: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            gap: '70px',
        },
        productCard: {
            margin: 0,
            flexShrink: 0,
            width: '300px',
            height: '500px',
            maxWidth: '300px',
            border: '1px solid #757575',
            padding: '45px 30px 20px 30px',
            textAlign: 'left',
            backgroundColor: '#fff',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            boxSizing: 'border-box',
            transition: 'border 0.3s ease, box-shadow 0.3s ease',
        },
        labels: {
            position: 'absolute',
            fontFamily: 'Rethink Sans',
            top: '10px',
            left: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: '2',
        },
        saleLabel: {
            backgroundColor: '#920000',
            textTransform: 'uppercase',
            textAlign: 'left',
            color: '#fff',
            fontFamily: 'Rethink Sans',
            fontSize: '1rem',
            fontWeight: 'bold',
            padding: '5px 0 5px 15px',
            width: '75px',
            marginLeft: '-10px',
        },
        badgeLabel: {
            textTransform: 'uppercase',
            color: '#fff',
            fontFamily: 'Rethink Sans',
            fontSize: '1rem',
            fontWeight: 'bold',
            padding: '5px 20px 5px 15px',
            marginLeft: '-10px',
        },
        heartWrapper: {
            position: 'absolute',
            top: '10px',
            right: '-150px',
            cursor: 'pointer',
        },
        wishlistIcon: {
            fontSize: '15px',
            color: '#000',
        },
        productImage: {
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            border: '2px solid #000',
        },
        title: {
            fontSize: '1rem',
            fontWeight: 'bold',
            fontFamily: 'Rethink Sans',
            margin: '10px 0 5px',
        },
        productAuthor: {
            fontSize: '0.9rem',
            fontFamiliy: 'Rethink Sans',
            color: '#757575',
            marginBottom: '10px',
        },
        productPrice: {
            fontSize: '1rem',
            fontFamily: 'Rethink Sans',
        },
        currentPrice: {
            fontWeight: 'bold',
            fontFamily: 'Rethink Sans',
            color: '#000',
            marginRight: '5px',
        },
        originalPrice: {
            fontFamily: 'Rethink Sans',
            fontSize: '13px',
            color: '#9e9e9e',
            textDecoration: 'line-through',
            marginRight: '5px',
        },
        discount: {
            fontFamily: 'Rethink Sans',
            fontSize: '13px',
            color: '#d32f2f',
            fontWeight: 'bold',
            marginLeft: '10px',
        },
    };

    return (
        <div>
        <div style={styles.header}>YOUR WISHLIST</div>
            <div style={styles.productCardWrapper}>
            {products.map((product, index) => (
                <div key={index} style={styles.productCard}>
                    <div style={styles.labels}>
                        <span style={styles.saleLabel}>{product.saleType}</span>
                        <span
                            style={{
                                ...styles.badgeLabel,
                                backgroundColor: product.label === 'Preloved' ? '#FF4F7D' : '#FC4902',
                            }}
                        >
                            {product.label}
                        </span>
                        <div style={styles.heartWrapper}>
                            <FaHeart style={styles.wishlistIcon} />
                        </div>
                    </div>
                    <img src={product.image} alt={product.title} style={styles.productImage} />
                    <div>
                        <h3>{product.title}</h3>
                        <p style={styles.productAuthor}>Kenpachi</p>
                        <p style={styles.productPrice}>
                            <span style={styles.currentPrice}>{product.price}</span>
                            <span style={styles.originalPrice}>{product.originalPrice}</span>
                            <span style={styles.discount}>{product.discount}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default MyWishlist;
