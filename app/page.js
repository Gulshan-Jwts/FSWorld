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
import ProductCard from "@/components/ProductCard";
import { ToastContainer } from "react-toastify";

const HomePage = () => {
  const { products, categories, banners } = useData();

  // Filter products for Featured Clothing (mix of tags)
  const featuredProducts = products.filter(
    (p) =>
      !["none"].includes(p.tag) && !["None"].includes(p.tag) && p.tag.length > 0
  );
  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      <ToastContainer />
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

      <motion.section
        className="banner"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="container">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 300000, // 3 seconds
              disableOnInteraction: false,
            }}
            loop={true}
            className="banner-slider"
          >
            {banners.map((banner) => (
              <SwiperSlide className="slide" key={banner.id}>
                <Image
                  src={banner.image}
                  alt={banner.text}
                  width={1100}
                  height={350}
                  className="banner-image w-full object-cover"
                  priority
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.section>

      <motion.section
        className="categories"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <section className="categories">
          <div className="container">
            <h1 className="section-title">Browse Categories</h1>
            <div className="categories-slider">
              {categories.map(
                (cat) =>
                  !cat.hidden && (
                    <Link href="#kids" key={cat._id} className="category-card">
                      <div className="category-image">
                        <Image
                          width={100}
                          height={100}
                          src={cat.image}
                          alt="Kids' Clothing"
                        />
                      </div>
                      <h3 className="category-title">{cat.name}</h3>
                    </Link>
                  )
              )}
            </div>
          </div>
        </section>
      </motion.section>

      <motion.section
        className="products"
        id="products"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <h1 className="section-title">Featured Clothing</h1>
        <div className="product-grid">
          <AnimatePresence>
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="product-motion-wrapper"
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {categories.map(
        (cat) =>
          !cat.hidden && (
            <motion.section
              className="products"
              initial="hidden"
              animate="visible"
              key={cat._id}
              variants={sectionVariants}
            >
              <h1 className="section-title">{cat.name}</h1>
              <div className="product-grid">
                <AnimatePresence>
                  {products
                    .filter((product) =>
                      product.categoryData.some(
                        (catData) => catData.categoryName === cat.name
                      )
                    )
                    .map((product) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="product-motion-wrapper"
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )
      )}
    </>
  );
};

export default HomePage;
