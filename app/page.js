"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/stylesheets/user/home.css";
import { useData } from "@/components/DataContext";

const HomePage = () => {
  const { products, categories } = useData();

  // Define categories for display, using dynamic category names
  const categoryData =
    categories?.map((cat) => ({
      name: cat.name,
      image:
        products.find((p) => p.category === cat.name)?.images.main[0] ||
        "/images/placeholder.jpg",
      subtitle:
        cat.name === "Kids"
          ? "Fun and stylish looks for kids"
          : cat.name === "Womens Wear"
          ? "Elegant outfits for every occasion"
          : cat.name === "Mens Wear"
          ? "Timeless styles for the modern man"
          : "Explore our latest collection",
    })) || [];

  // Filter products for Featured Clothing (mix of tags)
  const featuredProducts = products
    .filter((p) => ["New Arrival", "Sale", "Best Seller"].includes(p.tag))
    .slice(0, 4);

  // Filter products for New Arrivals (only New Arrival tag)
  const newArrivals = products
    .filter((p) => p.category === "Mens Wear")
    .slice(0, 4);

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <video className="hero-video" autoPlay muted loop>
          <source src="/heroVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Elevate Your Wardrobe</h1>
          <p className="hero-subtitle">Discover premium clothing with TFW</p>
          <Link href="#products" className="hero-cta">
            Shop Collection
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </Link>
        </div>
      </motion.section>

      {/* Categories Section with Swiper.js */}
      <motion.section
        className="categories"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={3}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              640: { slidesPerView: 2, spaceBetween: 15 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            
            style={{ maxWidth: "90%", overflow: "hidden" }}
            className="categories-slider"
          >
            {categoryData.map((category, index) => (
              <SwiperSlide
                key={index}
                style={{
                  width: "80vw",
                }}
              >
                <div className="category-card">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={300}
                    height={400}
                    className="category-image"
                  />
                  <div className="category-overlay">
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-subtitle">{category.subtitle}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.section
        className="products"
        id="products"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="container">
          <h2 className="section-title">Featured Clothing</h2>
          <div className="product-grid">
            <AnimatePresence>
              {featuredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/user/item/details/${product._id}`}
                    className="product-card"
                  >
                    <div className="product-image">
                      <Image
                        src={product.images.main[0]}
                        alt={product.title}
                        width={250}
                        height={300}
                        className="product-image"
                      />
                      <div
                        className={`product-badge ${
                          product.shiningEffect ? "shine" : ""
                        }`}
                      >
                        {product.tag}
                      </div>
                    </div>
                    <div className="product-info">
                      <p className="product-brand">TFW</p>
                      <h3 className="product-title">{product.title}</h3>
                      <div className="product-price">
                        <span className="price-current">
                          ₹{product.currentPrice}
                        </span>
                        <span className="price-original">
                          ₹{product.oldPrice}
                        </span>
                      </div>
                      <button className="add-to-cart">
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Banner Section */}
      <motion.section
        className="banner"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="container">
          <Image
            src="/Images/banner.jpg"
            alt="Promotional Banner"
            width={1200}
            height={300}
            className="banner-image"
          />
        </div>
      </motion.section>

      {/* New Arrivals Section */}
      <motion.section
        className="products"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="container">
          <h2 className="section-title">Mens Wear</h2>
          <div className="product-grid">
            <AnimatePresence>
              {newArrivals.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/user/item/details/${product._id}`}
                    className="product-card"
                  >
                    <div className="product-image">
                      <Image
                        src={product.images.main[0]}
                        alt={product.title}
                        width={250}
                        height={300}
                        className="product-image"
                      />
                      <div
                        className={`product-badge ${
                          product.shiningEffect ? "shine" : ""
                        }`}
                      >
                        {product.tag}
                      </div>
                    </div>
                    <div className="product-info">
                      <p className="product-brand">TFW</p>
                      <h3 className="product-title">{product.title}</h3>
                      <div className="product-price">
                        <span className="price-current">
                          ₹{product.currentPrice}
                        </span>
                        <span className="price-original">
                          ₹{product.oldPrice}
                        </span>
                      </div>
                      <button className="add-to-cart">
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default HomePage;
