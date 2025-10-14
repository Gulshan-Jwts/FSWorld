"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { DataContext } from "./DataContext";

const DataWrapper = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [affilators, setAffilators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);

  const reload = (key) => {
    if (key === "dbUser") {
      fetchUserData();
    } else if (key === "products") {
      fetchProducts();
    } else if (key === "affilators") {
      fetchAffilators();
    } else if (key === "categories") {
      fetchCategories();
    }
  };

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  const fetchUserData = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const res = await fetch("/api/user/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    }
  }, [session?.user]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/user/getProducts");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Products fetch failed:", err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/user/getCategories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Products fetch failed:", err);
    }
  }, []);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch("/api/user/getBanners");
      const data = await res.json();
      setBanners(data.banners || []);
      
    } catch (err) {
      console.error("Bannes fetch failed:", err);
    }
  }, []);

  const fetchAffilators = useCallback(async () => {
    if (isAdmin) {
      try {
        const res = await fetch("/api/admin/affilator/getAll");
        const data = await res.json();
        setAffilators(data.affilators || []);
      } catch (err) {
        console.error("Affilators fetch failed:", err);
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    const isAdminUser = async () => {
      const res = await fetch("/api/admin/verify");
      const data = await res.json();
      setisAdmin(data.isAdmin);
    };

    isAdminUser();

    if (status === "authenticated") {
      fetchUserData();
      setIsLogedIn(true);
    } else {
      setUser(null);
      setIsLogedIn(false);
    }
  }, [status, session?.user, fetchUserData]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchAffilators();
  }, [isAdmin, fetchAffilators]);

  useEffect(() => {
    if (!isLogedIn || (products && (user || !isLogedIn))) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [products, user, isLogedIn]);

  return (
    <DataContext.Provider
      value={{
        dbUser: user,
        products,
        categories,
        affilators,
        banners,
        isAdmin,
        isLoading,
        reload,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataWrapper;
