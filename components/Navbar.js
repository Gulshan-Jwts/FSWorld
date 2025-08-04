"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useData } from "./DataContext";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/stylesheets/navbar.css";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { dbUser, products, isAdmin, categories } = useData();
  const cartLength = dbUser?.cartList?.filter((id) =>
    products.some((product) => product._id === id)
  ).length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    open: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };
  useEffect(() => {
    const check = isMenuOpen || window.innerWidth > 500;
    setIsMenuOpen(check);
  }, [isMenuOpen]);

  return (
    <header className="header">
      <nav className="nav-container">
        <Link href="/" className="logo">
          <Image
            width={150}
            height={80}
            src="/images/logo.png"
            alt="TFW Logo"
          />
        </Link>

        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <AnimatePresence>
          {isMenuOpen && (
              <motion.ul
                className="nav-links flex flex-col px-5 md:w-auto absolute top-16 left-0 w-full bg-white md:bg-transparent p-4 md:flex md:flex-row md:static md:p-0"
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
              >
                <li>
                  <Link href="#" className="active">
                    Home
                  </Link>
                </li>
                {categories?.map((category, index) => {
                  return (
                    index < 4 && (
                      <li key={category._id}>
                        <Link
                          href={`#${category.name
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    )
                  );
                })}
              </motion.ul>
            )}
        </AnimatePresence>

        <div className="nav-actions">
          {status === "loading" ? (
            <p>Loading...</p>
          ) : !session ? (
            <Link href="/user/login" className="icon-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#666"
              >
                <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
              </svg>
            </Link>
          ) : (
            <>
              <Link href="/user/search" className="icon-btn">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="22px"
                  height="22px"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Link>
              <Link href="/user/profile" className="icon-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="22px"
                  viewBox="0 -960 960 960"
                  width="22px"
                  fill="#666"
                >
                  <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                </svg>
              </Link>
              <Link href="/user/cart" className="icon-btn relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartLength > 0 && (
                  <span className="cart-count absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {cartLength}
                  </span>
                )}
              </Link>
              {isAdmin && (
                <Link href="/admin/dashboard" className="icon-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="22px"
                    viewBox="0 -960 960 960"
                    width="22px"
                    fill="#666"
                  >
                    <path d="M680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm0-80q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm-560 0h480v-720H120v720Zm80-640h320v560H200v-560Zm280 280Z" />
                  </svg>
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
