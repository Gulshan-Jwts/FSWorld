"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useData } from "@/components/DataContext";
import "@/stylesheets/admin/dashboard.css";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  const { products, reload } = useData();

  const DeleteItem = async (productId) => {
    const confirmation = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmation) {
      return;
    }
    try {
      const response = await fetch("/api/admin/items/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        toast.success("Product deleted successfully!");
        reload("products");
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.main
      className="adminDashboard"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="overview-grid">
        <motion.div className="overview-card" variants={cardVariants}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3>Total Sales</h3>
          <p>&#8377;0</p>
        </motion.div>
        <motion.div className="overview-card" variants={cardVariants}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3>Total Orders</h3>
          <p>00</p>
        </motion.div>
        <motion.div className="overview-card" variants={cardVariants}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          <h3>Products</h3>
          <p>{products.length}</p>
        </motion.div>
        <motion.div className="overview-card" variants={cardVariants}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3>Visitors</h3>
          <p>3,500</p>
        </motion.div>
        <motion.div className="overview-card" variants={cardVariants}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
          <h3>Total Clicks</h3>
          <p>10,000</p>
        </motion.div>
      </div>

      <div className="graphs-section">
        <div className="graph-card">
          <h3>Revenue Over Time (Last 12 Months)</h3>
          <div className="graph-placeholder">
            <svg viewBox="0 0 600 220">
              <rect
                x="20"
                y="100"
                width="40"
                height="120"
                fill="var(--accent-cyan)"
                fillOpacity="0.8"
              />
              <rect
                x="70"
                y="80"
                width="40"
                height="140"
                fill="var(--accent-cyan)"
                fillOpacity="0.8"
              />
              <rect
                x="120"
                y="120"
                width="40"
                height="100"
                fill="var(--accent-cyan)"
                fillOpacity="0.8"
              />
              <rect
                x="170"
                y="60"
                width="40"
                height="160"
                fill="var(--accent-cyan)"
                fillOpacity="0.8"
              />
              <rect
                x="220"
                y="90"
                width="40"
                height="130"
                fill="var(--accent-cyan)"
                fillOpacity="0.8"
              />
              <rect
                x="270"
                y="50"
                width="40"
                height="170"
                fill="var(--accent-cyan)"
                fillOpacity="0.8"
              />
              <rect
                x="320"
                y="110"
                width="40"
                height="110"
                fill="var(--accent-purple)"
                fillOpacity="0.6"
              />
              <rect
                x="370"
                y="70"
                width="40"
                height="150"
                fill="var(--accent-purple)"
                fillOpacity="0.6"
              />
              <rect
                x="420"
                y="100"
                width="40"
                height="120"
                fill="var(--accent-purple)"
                fillOpacity="0.6"
              />
              <rect
                x="470"
                y="80"
                width="40"
                height="140"
                fill="var(--accent-purple)"
                fillOpacity="0.6"
              />
              <rect
                x="520"
                y="60"
                width="40"
                height="160"
                fill="var(--accent-purple)"
                fillOpacity="0.6"
              />
              <rect
                x="570"
                y="90"
                width="40"
                height="130"
                fill="var(--accent-purple)"
                fillOpacity="0.6"
              />
            </svg>
          </div>
        </div>
        <div className="graph-card">
          <h3>Sales by Category</h3>
          <div className="graph-placeholder pie-graph-placeholder">
            <svg viewBox="0 0 200 200">
              <path
                d="M100,100 L100,50 A50,50 0 0,1 150,100 Z"
                fill="var(--accent-cyan)"
                fillOpacity="0.7"
              />
              <path
                d="M100,100 L150,100 A50,50 0 0,1 100,150 Z"
                fill="var(--accent-purple)"
                fillOpacity="0.7"
              />
              <path
                d="M100,100 L100,150 A50,50 0 0,1 50,100 Z"
                fill="var(--accent-gold)"
                fillOpacity="0.7"
              />
              <path
                d="M100,100 L50,100 A50,50 0 0,1 100,50 Z"
                fill="#22c55e"
                fillOpacity="0.7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="products-section">
        <div className="products-section-header">
          <h2>Products</h2>
          <div className="products-section-actions">
            <Link href="/admin/addItem" className="add-product-btn mx-7">
              Add New Product
            </Link>
            <Link href="/admin/manageCategory" className="add-product-btn">
              Add Category
            </Link>
          </div>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <motion.div
              key={product._id}
              className="product-card"
              data-id={product._id}
              variants={cardVariants}
              onClick={() => {}}
            >
              <Link href={`/user/item/details/${product._id}`}>
                <Image
                  src={product.images?.main[0] || "/images/placeholder.jpg"}
                  alt={product.title || "Product"}
                  width={200}
                  height={200}
                  className="product-card-image"
                />
                <div className="product-card-content">
                  <h3>{product.title || "Product"}</h3>
                  <div className="category">
                    Category:{" "}
                    {product.categoryData.map((item) => (
                      <div
                        className="bg-slate-200 inline-block p-1 m-2.5 rounded-xl border-slate-500 border-2 text-slate-500"
                        key={item.categoryId + item.subcategory}
                      >
                        {item.categoryName}&mdash;&gt;{item.subcategory}
                      </div>
                    )) || "Unknown"}
                    {product.subcategory ? ` / ${product.subcategory}` : ""}
                  </div>
                  <p className="price">&#8377;{product.currentPrice || "0"}</p>
                  <p
                    className={`stock ${
                      product.inStock ? "in-stock" : "out-stock"
                    }`}
                  >
                    {product.inStock ? `In Stock` : "Out of Stock"}
                  </p>
                  <div className="colors">
                    {Object.keys(product.images || {})
                      .filter((key) => key !== "maincolor")
                      .map((color) => (
                        <span key={color} className="chip">
                          {color !== "main"
                            ? color
                            : product.images.maincolor || "Main Color"}
                        </span>
                      ))}
                  </div>
                  <div className="sizes">
                    {(product.sizes || []).map((size) => (
                      <span key={size} className="chip">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <div className="product-card-actions">
                <button
                  className="action-btn delete"
                  onClick={() => DeleteItem(product._id)}
                >
                  Delete
                </button>
                <button className="action-btn edit">
                  <Link href={`/admin/editItem/${product._id}`}>Edit</Link>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.main>
  );
};

export default Page;
