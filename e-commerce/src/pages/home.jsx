import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Autoplay styles

import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Swiper modules in v11+
import styles from '../styles/home.module.css';
import '../styles/global.css';
import HomeHeader from '../components/home-header';
import Footer from '../components/footer';
import B1 from '../assets/banners/1.png';
import B2 from '../assets/banners/2.png';
import B3 from '../assets/banners/3.png';
import bookwormImg from '../assets/content-images/Transhumans New Beginnings.png';
import mylittleDinosaur from '../assets/book-photos/babbies-toddlers/BEDTIME STORIES.png';
import wickedPrincess from '../assets/book-photos/avid/Wicked Princess.png';
import enchantedGarden from '../assets/book-photos/emergent/ENVIRONMENTALRESPONSIBILITY.png';
import indepentImg from '../assets/content-images/Transhumans Growth.png';
import emergentImg from '../assets/content-images/Transhumans Pacheco.png';
import avidImg from '../assets/content-images/Transhumans Late for Class.png';
import toddlersImg from '../assets/content-images/bxs-baby-carriage.svg.png';

const Home = () => {
  const [hoveredHeart, setHoveredHeart] = useState(null);
  const [clickedHeart, setClickedHeart] = useState(null);

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
      title: 'Wicked Princess (Paperback)',
      price: '₱984.00',
      originalPrice: '₱1,230.00',
      discount: '-20%',
      label: 'Best Seller',
      image: wickedPrincess,
      saleType: 'Sale',
    },
    {
      title: 'The Enchanted Garden Adventures (Paperback)',
      price: '₱560.24',
      originalPrice: '₱700.30',
      discount: '-20%',
      label: 'Preloved',
      image: enchantedGarden,
      saleType: 'Sale',
    },
    {
      title: 'The Enchanted Garden Adventures (Paperback)',
      price: '₱560.24',
      originalPrice: '₱700.30',
      discount: '-20%',
      label: 'Preloved',
      image: enchantedGarden,
      saleType: 'Sale',
    },
    // Add more products as needed
  ];

  return (
    <div style={{background: '#FFF'}}>
      <header style={{ position: 'fixed', width: '100%', zIndex: 1000, backgroundColor: 'white' }}>
        <HomeHeader />
      </header>

      <main style={{paddingTop: '70px', marginBottom: '70px',       }}>
          {/* Banner */}
          <div className={styles.banner}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop
            >
              <SwiperSlide>
                <img src={B1} alt="Banner 1" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={B2} alt="Banner 2" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={B3} alt="Banner 3" />
              </SwiperSlide>
            </Swiper>
          </div>

        <div className={styles.bookworm}>
          <h1>Book for Certified Bookworm</h1>
          <p>Are you a little bookworm? Let's go on a reading adventure! Our books are filled with 
            exciting stories. Every page is a new world to explore. Let's read together!</p>
            <div className={styles.bwshopBtn}>
              <Link to = ''>
                <button>Shop Now</button>
              </Link>
            </div>

            <div className={styles.redbg}>
              <div className={styles.linebox}></div>
              <div className={styles.girlImg}>
                  <img src={bookwormImg} alt="" />
                </div>
            </div>
        </div>

        <div style={{ padding: '20px', marginTop: '1150px' }}>
          <h2 className={styles.title}>Christmas Super Sale</h2>
          <div className={styles.productSwiperWrapper}>
            <Swiper
              modules={[Navigation]}
              navigation
              slidesPerView="auto"
              spaceBetween={10}
              centeredSlides={true} // Centers the active slides
              loop={true}
              className={styles.productSwiper}
            >
              {products.map((product, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.productCardWrapper}>
                    <div className={styles.productCard}>
                      <div className={styles.labels}>
                        <span className={styles.saleLabel}>{product.saleType}</span>
                        <span className={styles.badgeLabel}
                          style={{
                            backgroundColor: product.label === 'Preloved' ? '#FF4F7D' : '#FC4902', 
                          }}
                        >
                          {product.label}</span>

                        <div className={styles.heartWrapper}
                          onMouseEnter={() => setHoveredHeart(index)} 
                          onMouseLeave={() => setHoveredHeart(null)} 
                          onClick={() => setClickedHeart(index)}
                        >
                          {clickedHeart === index || hoveredHeart === index ? (
                            <FaHeart className={styles.heartIconActive} />
                          ) : (
                            <FaRegHeart className={styles.heartIcon} />
                          )}
                        </div>
                      </div>
                      <img src={product.image} alt={product.title} className={styles.productImage} />
                      <div className={styles.productInfo}>
                        <h3>{product.title}</h3>
                        <p className={styles.productAuthor}>Kenpachi</p>
                        <p className={styles.productPrice}>
                          <span className={styles.currentPrice}>{product.price}</span>
                          <span className={styles.originalPrice}>{product.originalPrice}</span>
                          <span className={styles.discount}>{product.discount}</span>
                        </p>
                      </div>
                    </div>
                    <div className={styles.addToBucket}>ADD TO BUCKET</div> {/* Add to Bucket button */}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div style={{marginTop: '20px'}}>
          <h3 className={styles.title2}>Childhood dreams, brought to life, one page at a time.</h3>
            <div className={styles.booksIndependent}>
              <div className={styles.orangebox}></div>
              <div className={styles.boxIndependent}>
                <h4>Books for Independent Readers</h4>
                <p>Empower young minds with books that ignite curiosity and foster independence. Explore captivating stories 
                  that encourage self-discovery and adventure. Perfect for independent readers ready to explore the world through words!</p>
                <Link to=''>
                  <button>Shop Now</button>
                </Link>
              </div>
              <img src={indepentImg} alt="Independent" />
            </div>

            <div className={styles.booksEmergent}>
              <div className={styles.boxEmergent}>
                <img src={emergentImg} alt="Emergent" />
                <h3>Emergent</h3><span>Readers</span>
              </div>
            </div>

            <div className={styles.booksAvid}>
              <div className={styles.boxAvid}>
              <h3>Avid</h3><span>Readers</span>
                <img src={avidImg} alt="Avid" />
              </div>
            </div>

            <div className={styles.booksToddlers}>
              <div className={styles.boxToddlers}>
                <h4>Books for <br /> Babbies and Toddlers</h4>
                <p>Bright, colorful books for your little one's first stories. Simple tales to spark imagination and early learning.
                  A perfect way to bond and grow together through reading!</p>

              </div>
              <div className={styles.bluebg}>
                <img src={toddlersImg} alt="" />
              </div>
            </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
