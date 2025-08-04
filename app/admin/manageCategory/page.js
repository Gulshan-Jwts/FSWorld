"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/DataContext";
import '@/stylesheets/admin/categories.css'
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  const { products, categories, reload } = useData();
  const [openCategory, setOpenCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const [subcategoryForms, setSubcategoryForms] = useState({});

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (categoryInput.trim() && subcategoryInput.trim()) {
      try {
        const response = await fetch("/api/admin/category/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryName: categoryInput.trim(),
            subcategoryName: subcategoryInput.trim(),
          }),
        });
        if (response.ok) {
          toast.success("Category added successfully! Reloading Categories");
          reload("categories");
          setCategoryInput("");
          setSubcategoryInput("");
        } else {
          throw new Error("Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error("Failed to add category. Please try again.");
      }
    } else {
      toast.info("Both category name and subcategory name are required.");
    }
  };

  const handleAddSubcategory = async (categoryName, subcategoryName) => {
    if (subcategoryName?.trim()) {
      try {
        const response = await fetch("/api/admin/category/subcategory/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryName: categoryName.trim(),
            subcategoryName: subcategoryName.trim(),
          }),
        });
        if (response.ok) {
          toast.success("Subcategory added successfully! Reloading categories...");
          reload("categories");
          setSubcategoryForms({ ...subcategoryForms, [categoryName]: "" });
        } else {
          throw new Error("Failed to add subcategory");
        }
      } catch (error) {
        console.error("Error adding subcategory:", error);
        toast.error("Failed to add subcategory. Please try again.");
      }
    } else {
      toast.info("Subcategory name is required.");
    }
  };

const handleDeleteCategory = async (categoryName) => {
  try {
    const hasProducts = products.some((product) => product.category === categoryName);
    if (hasProducts) {
      toast.error(`can't delete subcategory having products, change there subcategory to delete`);
      return;
    }

    const response = await fetch("/api/admin/category/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryName: categoryName}),
    });
    if (response.ok) {
      toast.success("Category deleted successfully! Reloading categories...");
      reload("categories");
      if (openCategory === categoryName) setOpenCategory(null);
    } else {
      throw new Error("Failed to delete category");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.error("Failed to delete category. Please try again.");
  }
};

const handleDeleteSubcategory = async (categoryName, subcategoryName) => {
  try {
    const hasProducts = products.some(
      (product) => product.category === categoryName && product.subcategory === subcategoryName
    );
    if (hasProducts) {
      toast.error(`cant delete subcategory having products, change there subcategory to delete`);
      return;
    }

    const response = await fetch("/api/admin/category/subcategory/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryName: categoryName.trim(),
        subcategoryName: subcategoryName.trim(),
      }),
    });
    if (response.ok) {
      toast.success("Subcategory deleted successfully! Reloading categories...");
      reload("categories");
    } else {
      throw new Error("Failed to delete subcategory");
    }
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    toast.error("Failed to delete subcategory. Please try again.");
  }
};

  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const handleSubcategoryInputChange = (categoryId, value) => {
    setSubcategoryForms({ ...subcategoryForms, [categoryId]: value });
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const contentVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <motion.main
      className="main-content"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
        <ToastContainer position="top-right" autoClose={3000} />
      <div className="category-form">
        <input
          type="text"
          placeholder="Enter category name..."
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter sub-category name..."
          value={subcategoryInput}
          onChange={(e) => setSubcategoryInput(e.target.value)}
        />
        <button className="add-category-btn" onClick={handleAddCategory}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      <div className="category-accordion">
        {categories.map((category) => (
          <div key={category._id} className="category-item">
            <div className="category-header" onClick={() => toggleCategory(category._id)}>
              <h2>{category.name}</h2>
              <div className="category-actions">
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.name);
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <svg
                  className={`toggle-icon ${openCategory === category._id ? "open" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <AnimatePresence>
              {openCategory === category._id && (
                <motion.div
                  className="category-content"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={contentVariants}
                >
                  <div className="subcategory-form">
                    <input
                      type="text"
                      placeholder="Enter sub-category name..."
                      value={subcategoryForms[category._id] || ""}
                      onChange={(e) => handleSubcategoryInputChange(category._id, e.target.value)}
                    />
                    <button
                      className="add-subcategory-btn"
                      onClick={() => handleAddSubcategory(category.name, subcategoryForms[category._id])}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </button>
                  </div>
                  <div className="subcategory-list">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory} className="subcategory-item">
                        <p>{subcategory}</p>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteSubcategory(category.name, subcategory)}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="product-cards">
                    {products
                      .filter((p) => p.category === category.name && category.subcategories.includes(p.subcategory))
                      .map((product) => (
                        <div key={product._id} className="product-card">
                          <Image
                            src={product.images?.main[0] || "/images/placeholder.jpg"}
                            alt={product.title || "Product"}
                            width={200}
                            height={200}
                            className="product-card-image"
                          />
                          <div className="product-card-content">
                            <h3>{product.title || "Product"}</h3>
                            <p>Sub-Category: {product.subcategory || "Unknown"}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.main>
  );
};

export default Page;