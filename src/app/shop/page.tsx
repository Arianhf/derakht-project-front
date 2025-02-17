"use client";

import { useState } from "react";
import styles from "./shop.module.scss";
import Image from "next/image";
import logo from "@/assets/images/logo2.png";
import heroImage from "@/assets/images/header1.jpg";
import { Navbar } from "@/components/shared/Navbar";

const ShopPage = () => {
  const [cartCount, setCartCount] = useState(0);
  const [filters, setFilters] = useState({ price: "", category: "", brand: "" });

  return (
    <div className={styles.shopContainer}>
      <Navbar logo={logo} basketCount={cartCount} />

      <div className={styles.heroSection}>
        <Image src={heroImage} alt="Shop Hero" layout="fill" objectFit="cover" className={styles.heroImage} />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroText}>فروشگاه درخت</h1>
        </div>
      </div>

      <div className={styles.filtersContainer}>
        <select className={styles.filterDropdown} value={filters.price} onChange={(e) => setFilters({ ...filters, price: e.target.value })}>
          <option value="">قیمت</option>
          <option value="low">کمترین قیمت</option>
          <option value="high">بیشترین قیمت</option>
        </select>

        <select className={styles.filterDropdown} value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">دسته‌بندی</option>
          <option value="electronics">لوازم الکترونیکی</option>
          <option value="clothing">پوشاک</option>
          <option value="home">لوازم خانگی</option>
        </select>
      </div>
    </div>
  );
};

export default ShopPage;