"use client";

import { useState } from "react";
import styles from "./shop.module.scss";
import Image from "next/image";
import logo from "@/assets/images/logo2.png";
import heroImage from "@/assets/images/header.jpg";
import { Navbar } from "@/components/shared/Navbar";

const ShopPage = () => {
  const [cartCount, setCartCount] = useState(0);
  const [filters, setFilters] = useState({ price: "" });

  return (
    <div className={styles.shopContainer}>
      <Navbar logo={logo} basketCount={cartCount} />
      
      <div className={styles.heroSection}>
        <Image src={heroImage} alt="Shop Hero" layout="fill" objectFit="cover" className={styles.heroImage} />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroText}>فروشگاه درخت</h1>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;