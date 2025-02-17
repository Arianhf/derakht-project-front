"use client";

import { useState } from "react";
import styles from "./shop.module.scss";
import Image from "next/image";
import logo from "@/assets/images/logo2.png";
import { FaShoppingBasket } from "react-icons/fa";
import { Navbar } from "@/components/shared/Navbar";

const ShopPage = () => {
  const [cartCount, setCartCount] = useState(0);
  const [filters, setFilters] = useState({ price: "" });

  return (
    <div className={styles.shopContainer}>
      <Navbar logo={logo} />
    </div>
  );
};

export default ShopPage;