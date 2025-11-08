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
import ProductCard from "@/components/ProductCard";

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
  const videoRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState({});

  const product = products.find((p) => p._id === productId) || {};

  // Get images for the current variant

  const handlePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      // sabhi dusre videos pause karo
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) v.pause();
      });

      video.play();
      setIsPlaying((prev) => ({ ...prev, [index]: true }));
    } else {
      video.pause();
      setIsPlaying((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleSlideChange = () => {
    console.log(isPlaying);
    // slide change hone par sabhi videos pause
    videoRefs.current.forEach((video, index) => {
      if (video && !video.paused) {
        handlePlayPause(index); // update isPlaying state
      }
    });
  };

  const productCategoryIds =
    product.categoryData?.map((c) => c.categoryId) || [];
  const currentImages = product.images?.[currentVariant] || [];

  const recommendedProducts = products
    .filter((p) => {
      if (p._id === productId) return false; // skip same product
      if (!p.categoryData) return false;

      // check if there is any overlap in categoryIds
      return p.categoryData.some((c) =>
        productCategoryIds.includes(c.categoryId)
      );
    })
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
            loop={currentImages.length > 1}
            className="gallery-container"
            style={{ maxWidth: "100%", height: "540px" }}
            ref={swiperRef}
            onSlideChange={(swiper) => {
              handleSlideChange();
              setSelectedImageIndex(swiper.realIndex);
            }}
          >
            {currentImages.map((media, index) => {
              const isVideo = media.type === "video/mp4";
              return (
                <SwiperSlide key={index} className="gallery-slide">
                  {isVideo ? (
                    <div className="video-player">
                      <video
                        src={media.image}
                        controls={false}
                        width={600}
                        ref={(el) => (videoRefs.current[index] = el)}
                        height={540}
                        className="gallery-video"
                        style={{ objectFit: "cover" }}
                      />
                      <div
                        className="play-icon-overlay-large"
                        onClick={() => handlePlayPause(index)}
                      >
                        {!isPlaying[index] ? (
                          <svg
                            height="40px"
                            width="40px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"
                                fill="#454549"
                              ></path>
                            </g>
                          </svg>
                        ) : (
                          <svg
                            width="40px"
                            height="40px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M2 6C2 4.11438 2 3.17157 2.58579 2.58579C3.17157 2 4.11438 2 6 2C7.88562 2 8.82843 2 9.41421 2.58579C10 3.17157 10 4.11438 10 6V18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18V6Z"
                                fill="#454549"
                              ></path>
                              <path
                                d="M14 6C14 4.11438 14 3.17157 14.5858 2.58579C15.1716 2 16.1144 2 18 2C19.8856 2 20.8284 2 21.4142 2.58579C22 3.17157 22 4.11438 22 6V18C22 19.8856 22 20.8284 21.4142 21.4142C20.8284 22 19.8856 22 18 22C16.1144 22 15.1716 22 14.5858 21.4142C14 20.8284 14 19.8856 14 18V6Z"
                                fill="#454549"
                              ></path>
                            </g>
                          </svg>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={media.image}
                      alt={`${
                        product.title || "Product"
                      } - ${currentVariant} Media ${index + 1}`}
                      width={600}
                      height={540}
                      className="gallery-image"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className="gallery-thumbnails">
            {currentImages.map((media, index) => {
              const isVideo = media.type === "video/mp4";
              return (
                <div
                  key={index}
                  className={`thumbnail ${
                    selectedImageIndex === index ? "selected" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  {isVideo ? (
                    <div className="thumbnail-video-wrapper">
                      <video
                        src={media.image}
                        width={100}
                        height={100}
                        muted
                        className="thumbnail-video"
                        preload="metadata"
                      />
                      <div className="play-icon-overlay">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="white"
                          viewBox="0 0 24 24"
                          stroke="none"
                          width="28"
                          height="28"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={media.image}
                      alt={`Thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      className="thumbnail-image"
                    />
                  )}
                </div>
              );
            })}
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
          {product.images && Object.keys(product.images).length > 1 && (
            <div className="color-variants">
              {Object.keys(product.images || {})
                .filter((item) => item !== "maincolor")
                .map((key) => (
                  <div
                    key={key}
                    className={`color-option ${
                      currentVariant === key ? "selected" : ""
                    }`}
                    data-color={`variant-${key}`}
                    onClick={() => handleVariantChange(key)}
                  >
                    <Image
                      src={
                        key === "maincolor"
                          ? product.images.main[0].image
                          : product.images[key][0].image
                      }
                      alt={`Variant ${key}`}
                      width={80}
                      height={80}
                      className="color-option-image"
                    />
                    <div className="color-option-label text-center text-sm my-2.5">
                      {key !== "main"
                        ? key
                        : product.images.maincolor || "Main Color Name"}
                    </div>
                  </div>
                ))}
            </div>
          )}

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
            <h1 className="desc-heading">Description</h1>
            <div
              className="dynamic-desc"
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
            <ProductCard key={rec._id} product={rec} showUserActions={true} />
          ))}
        </div>
      </motion.section>
    </motion.section>
  );
};

export default Page;
