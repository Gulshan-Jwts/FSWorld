"use client";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/stylesheets/user/detail-page.css";
import { useData } from "@/components/DataContext";

const Page = () => {
  const { productId } = useParams();
  const searchParams = useSearchParams();
  const affilatorId = searchParams.get("affilator");
  const { products } = useData();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentVariant, setCurrentVariant] = useState("main");
  const swiperRef = useRef(null);

  const product = products.find((p) => p._id === productId) || {};

  // Get images for the current variant
  const currentImages = product.images?.[currentVariant] || [];

  const recommendedProducts = products
    .filter((p) => p.category === product.category && p._id !== productId)
    .slice(0, 4);

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < 10) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  const handleVariantChange = (variant) => {
    setCurrentVariant(variant);
    setSelectedImageIndex(0);
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(0); // Reset slider to first image
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="product-details"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <div className="product-container">
        {/* Image Gallery */}
        <div className="product-gallery">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={currentImages.length > 1} // Only loop if multiple images
            className="gallery-container"
            style={{ maxWidth: "100%", height: "540px" }}
            ref={swiperRef}
            onSlideChange={(swiper) => setSelectedImageIndex(swiper.realIndex)}
          >
            {currentImages.map((img, index) => (
              <SwiperSlide key={index} className="gallery-slide">
                <Image
                  src={img}
                  alt={`${
                    product.title || "Product"
                  } - ${currentVariant} Image ${index + 1}`}
                  width={600}
                  height={540}
                  className="gallery-image"
                  style={{ objectFit: "cover" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="gallery-thumbnails">
            {currentImages.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${
                  selectedImageIndex === index ? "selected" : ""
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="thumbnail-image"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <p className="product-brand">TFW</p>
          <h1 className="product-title">
            {product.title || "Premium Silk Saree"}
          </h1>
          <div className="product-price">
            <span className="price-current">
              &#8377;{product.currentPrice || "5,999"}
            </span>
            <span className="price-original">
              &#8377;{product.oldPrice || "7,999"}
            </span>
          </div>

          {/* Color Variants */}
          <div className="color-variants">
            {Object.keys(product.images || {}).map((key) => (
              <div
                key={key}
                className={`color-option ${
                  currentVariant === key ? "selected" : ""
                }`}
                data-color={`variant-${key}`}
                onClick={() => handleVariantChange(key)}
              >
                <Image
                  src={product.images[key][0]}
                  alt={`Variant ${key}`}
                  width={80}
                  height={80}
                  className="color-option-image"
                />
              </div>
            ))}
          </div>

          {/* Size Selector */}
          <div className="size-selector">
            <label htmlFor="size">Select Size</label>
            <div className="size-options">
              {["S", "M", "L"].map((size) => (
                <button
                  key={size}
                  className={`size-option ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  data-size={size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity</label>
            <div className="quantity-controls" data-quantity={quantity}>
              <button
                className="quantity-btn"
                data-action="decrease"
                onClick={() => handleQuantityChange("decrease")}
              >
                -
              </button>
              <input
                type="text"
                className="quantity-input"
                value={quantity}
                readOnly
              />
              <button
                className="quantity-btn"
                data-action="increase"
                onClick={() => handleQuantityChange("increase")}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {!affilatorId && (
              <button className="add-to-cart" data-action="add-to-cart">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
            )}
            <button className="buy-now" data-action="buy-now">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Buy Now
            </button>
            <button className="share-btn" data-share="toggle">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>
          </div>

          {/* Product Description */}
          <div className="product-description">
            <h3>Description</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: product.description || "No description available.",
              }}
            />
          </div>

        </div>
      </div>

      {/* Product Recommendations */}
      <motion.section
        className="product-recommendations"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <h2>You May Also Like</h2>
        <div className="recommendations-grid">
          {recommendedProducts.map((rec) => (
            <div key={rec._id} className="recommendation-card">
              <Link href={`/user/item/details/${rec._id}`}>
                <Image
                  src={rec.images?.main[0] || "/images/placeholder.jpg"}
                  alt={rec.title || "Recommended Product"}
                  width={300}
                  height={200}
                  className="recommendation-image"
                />
                <div className="recommendation-card-content">
                  <h3>{rec.title || "Recommended Product"}</h3>
                  <div className="recommendation-card-price">
                    &#8377;{rec.currentPrice || "4,999"}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.section>
  );
};

export default Page;
