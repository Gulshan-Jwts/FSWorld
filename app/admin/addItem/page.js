"use client";
import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { UploadButton, UploadDropzone } from "@uploadthing/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/stylesheets/admin/addItem.css";
import "@/stylesheets/admin/richtext.css";
import {
  RiH2,
  RiH3,
  RiBold,
  RiItalic,
  RiUnderline,
  RiListUnordered,
  RiListOrdered,
  RiTableLine,
  RiInsertRowBottom,
  RiInsertRowTop,
  RiInsertColumnLeft,
  RiInsertColumnRight,
  RiDeleteRow,
  RiDeleteColumn,
  RiCloseLine,
  RiDeleteBinLine,
  RiLoader2Line,
} from "@remixicon/react";
import { useData } from "@/components/DataContext";

const Page = () => {
  const { categories } = useData();
  const subcategories = {};

  categories.forEach((cat) => {
    const name = cat;
    subcategories[name.name] = cat.subcategories.map((sub) => sub);
  });

  const [formData, setFormData] = useState({
    title: "",
    oldPrice: "",
    currentPrice: "",
    description: "",
    sizes: ["S", "M", "L"],
    category: categories[0]?.name || "Womens Wear",
    subcategory: categories[0]?.subcategories[0] || "Saree",
    tag: "New Arrival",
    shiningEffect: false,
    searchable: [],
    inStock: true,
  });
  const [images, setImages] = useState({
    main: [],
  });
  const [newColor, setNewColor] = useState("");
  const [editorData, setEditorData] = useState("");
  const [uploading, setUploading] = useState({});
  const [searchable, setsearchable] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category: categories[0]?.name || "Womens Wear",
      subcategory: categories[0]?.subcategories[0] || "Saree",
    }));
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: editorData,
    onUpdate: ({ editor }) => {
      setEditorData(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, description: editorData }));
  }, [editorData]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category,
      subcategory: subcategories[category][0],
    }));
  };

  const handlesearchableChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setsearchable(value);
    setFormData((prev) => ({
      ...prev,
      searchable: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const selectTag = (tag) => {
    setFormData((prev) => {
      return { ...prev, tag };
    });
  };

  const addColor = () => {
    if (newColor && !Object.keys(images).includes(newColor)) {
      setImages((prev) => ({
        ...prev,
        [newColor]: [],
      }));
      setNewColor("");
      toast.success(`Color "${newColor}" added!`);
    } else if (!newColor) {
      toast.error("Please enter a color name.");
    } else {
      toast.error("Color already exists.");
    }
  };

  const removeColor = (color) => {
    setImages((prev) => {
      const newImages = { ...prev };
      delete newImages[color];
      return newImages;
    });
    toast.success(`Color "${color}" removed!`);
  };

  const removeImage = (color, index) => {
    setImages((prev) => ({
      ...prev,
      [color]: prev[color].filter((_, i) => i !== index),
    }));
    toast.success("Image removed!");
  };

  const handleImageUpload = (color, res) => {
    setUploading((prev) => ({ ...prev, [color]: false }));
    const newImageUrl = res[0].ufsUrl;
    setImages((prev) => ({
      ...prev,
      [color]: [...prev[color], newImageUrl],
    }));
    toast.success("Image uploaded successfully!");
  };

  const validateForm = () => {
    if (!formData.title) return "Title is required.";
    if (!formData.oldPrice) return "Old price is required.";
    if (!formData.currentPrice) return "Current price is required.";
    if (!formData.description) return "Description is required.";
    if (!images.main || images.main.length === 0)
      return "At least one main image is required.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      console.log(
        JSON.stringify({
          ...formData,
          images,
        })
      );
      toast.loading("Uploading product...");
      const res = await fetch("/api/admin/items/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.dismiss();
        toast.success("Product added successfully!");
        // setFormData({
        //   title: "",
        //   oldPrice: "",
        //   currentPrice: "",
        //   description: "",
        //   sizes: ["S", "M", "L"],
        //   category: "Womens Wear",
        //   subcategory: "Saree",
        //   tag: "New Arrival",
        //   shiningEffect: false,
        //   inStock: true,
        // });
      } else {
        toast.dismiss();
        toast.error(data.message || "Failed to add product.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong!");
      console.error(err);
    }
  };

  return (
    <main className="adminAddItem">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={onSubmit}>
        <div className="form-section">
          <h2>Product Title</h2>
          <input
            type="text"
            name="title"
            className="title-input"
            placeholder="Enter product title..."
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-section">
          <h2>Price</h2>
          <div className="price-fields">
            <input
              type="number"
              name="oldPrice"
              className="price-input"
              placeholder="Enter old price (e.g., &#8377;5999)"
              value={formData.oldPrice}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="currentPrice"
              className="price-input"
              placeholder="Enter current price (e.g., &#8377;4999)"
              value={formData.currentPrice}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-section">
          <label htmlFor="trip-description-input">Details</label>
          {editor && (
            <div className="editor-container">
              <div className="editor-toolbar">
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 }) ? "active" : ""
                  }
                  title="Heading 2"
                >
                  <RiH2 />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 3 }) ? "active" : ""
                  }
                  title="Heading 3"
                >
                  <RiH3 />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "active" : ""}
                  title="Bold"
                >
                  <RiBold />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "active" : ""}
                  title="Italic"
                >
                  <RiItalic />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={editor.isActive("underline") ? "active" : ""}
                  title="Underline"
                >
                  <RiUnderline />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={editor.isActive("bulletList") ? "active" : ""}
                  title="Bullet List"
                >
                  <RiListUnordered />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={editor.isActive("orderedList") ? "active" : ""}
                  title="Ordered List"
                >
                  <RiListOrdered />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                  className={editor.isActive("table") ? "active" : ""}
                  title="Insert Table"
                >
                  <RiTableLine />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className=""
                  title="Add Row Before"
                  disabled={!editor || !editor.can().addRowBefore()}
                >
                  <RiInsertRowTop />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className=""
                  title="Add Row After"
                  disabled={!editor || !editor.can().addRowAfter()}
                >
                  <RiInsertRowBottom />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className=""
                  title="Add Column Before"
                  disabled={!editor || !editor.can().addColumnBefore()}
                >
                  <RiInsertColumnLeft />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className=""
                  title="Add Column After"
                  disabled={!editor || !editor.can().addColumnAfter()}
                >
                  <RiInsertColumnRight />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className=""
                  title="Delete Row"
                  disabled={!editor || !editor.can().deleteRow()}
                >
                  <RiDeleteRow />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className=""
                  title="Delete Column"
                  disabled={!editor || !editor.can().deleteColumn()}
                >
                  <RiDeleteColumn />
                </button>
              </div>
              <EditorContent editor={editor} className="editor-content" />
            </div>
          )}
        </div>
        <div className="form-section">
          <h2>Product Sizes</h2>
          <div className="size-selection">
            {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
              <div key={size} className="size-box">
                <button
                  type="button"
                  className={`tag-btn ${
                    formData.sizes.includes(size) ? "selected" : ""
                  }`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="form-section">
          <h2>Product Colors</h2>
          <div className="image-gallery">
            {images.main.map((image, i) => (
              <div className="image-box" key={i}>
                <img src={image} alt={`Main Image ${i + 1}`} />
                <span
                  className="remove-btn"
                  onClick={() => removeImage("main", i)}
                >
                  <RiCloseLine />
                </span>
              </div>
            ))}
            <div className="image-box add-image">
              <UploadButton
                endpoint="imageUploader"
                onUploadBegin={() => {
                  setUploading((prev) => ({
                    ...prev,
                    main: true,
                  }));
                  toast.info("Uploading image...");
                }}
                appearance={{
                  label: "custom-dropzone-label",
                  button: "custom-dropzone-button",
                }}
                onClientUploadComplete={(res) => handleImageUpload("main", res)}
                onUploadError={(error) => {
                  setUploading((prev) => ({
                    ...prev,
                    main: false,
                  }));
                  toast.error(`Upload failed: ${error.message}`);
                }}
                content={{
                  button({ ready }) {
                    return uploading.main ? (
                      <div className="uploading-loader">
                        <RiLoader2Line />
                      </div>
                    ) : (
                      ready && (
                        <div className="add-image-content">
                          <svg
                            className="singleSvg"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                      )
                    );
                  },
                }}
                className="custom-upload-btn"
              />
            </div>
          </div>
          <div className="color-selection">
            {Object.keys(images).map(
              (color, index) =>
                color !== "main" && (
                  <div key={index} className="color-section">
                    <div className="color-header">
                      <h2>{color}</h2>
                      <button
                        type="button"
                        className="delete-color-btn"
                        onClick={() => removeColor(color)}
                        title={`Remove ${color}`}
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                    <div className="image-gallery">
                      {images[color].map((image, index) => (
                        <div className="image-box" key={index}>
                          <img
                            src={image}
                            alt={`${color} Image ${index + 1}`}
                          />
                          <span
                            className="remove-btn"
                            onClick={() => removeImage(color, index)}
                          >
                            <RiCloseLine />
                          </span>
                        </div>
                      ))}
                      <div className="image-box add-image">
                        <UploadButton
                          endpoint="imageUploader"
                          autoUpload={true}
                          onUploadBegin={() => {
                            setUploading((prev) => ({
                              ...prev,
                              [color]: true,
                            }));
                            toast.info("Uploading image...");
                          }}
                          appearance={{
                            label: "custom-dropzone-label",
                            button: "custom-dropzone-button",
                          }}
                          onClientUploadComplete={(res) => {
                            handleImageUpload(color, res);
                          }}
                          onUploadError={(error) => {
                            setUploading((prev) => ({
                              ...prev,
                              [color]: false,
                            }));
                            toast.error(`Upload failed: ${error.message}`);
                          }}
                          content={{
                            button({ ready }) {
                              return uploading[color] ? (
                                <div className="uploading-loader">
                                  <RiLoader2Line />
                                </div>
                              ) : (
                                ready && (
                                  <div className="add-image-content">
                                    <svg
                                      className="singleSvg"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                  </div>
                                )
                              );
                            },
                          }}
                          className="custom-upload-btn"
                        />
                      </div>
                    </div>
                  </div>
                )
            )}
            <div className="color-input">
              <input
                type="text"
                placeholder="Enter color name..."
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <button
                type="button"
                className="add-color-btn"
                onClick={addColor}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Color
              </button>
            </div>
          </div>
        </div>
        <div className="form-section">
          <h2>Category</h2>
          <div className="category-selection">
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="category-select"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <h2>Subcategory</h2>
          <div className="subcategory-selection">
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="category-select"
            >
              {Object.keys(subcategories).length !== 0 &&
                subcategories[formData.category] &&
                subcategories[formData.category].map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="form-section">
          <h2>Tags</h2>
          <div className="tags-selection">
            {["New Arrival", "Popular", "Best Selling", "None"].map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-btn ${formData.tag === tag ? "selected" : ""}`}
                data-tag={tag.toLowerCase()}
                onClick={() => selectTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="form-section">
          <h2>searchable keywords</h2>
          <input
            type="text"
            name="title"
            className="title-input"
            placeholder="separate by commas e.g. saree, silk saree, designer saree"
            value={searchable}
            onChange={handlesearchableChange}
            required
          />
        </div>
        <div className="form-section">
          <h2>Shining Effect</h2>
          <div className="shining-toggle">
            <span className="toggle-label">Shining Effect</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="shiningEffect"
                checked={formData.shiningEffect}
                onChange={handleInputChange}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div className="form-section">
          <h2>Stock Status</h2>
          <div className="stock-toggle">
            <span className="toggle-label">In Stock</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div className="form-section">
          <button type="submit" className="submit-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Add Product
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
