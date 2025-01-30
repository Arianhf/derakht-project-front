import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockProducts } from "../data/mockProducts";
import { FaShoppingBasket, FaPlus, FaMinus, FaArrowRight } from "react-icons/fa";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = id ? mockProducts.find((p) => p.id === parseInt(id)) : null;

  // Basket State
  const [basket, setBasket] = useState<{ id: number; title: string; quantity: number }[]>([]);

  if (!product) {
    return <p>محصول یافت نشد!</p>;
  }

  // Add item to basket
  const addToBasket = () => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === product.id);
      if (existingItem) {
        return prevBasket.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevBasket, { id: product.id, title: product.title, quantity: 1 }];
      }
    });
  };

  // Remove item from basket
  const removeFromBasket = () => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === product.id);
      if (existingItem?.quantity === 1) {
        return prevBasket.filter((item) => item.id !== product.id);
      }
      return prevBasket.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // Get current quantity in basket
  const getProductQuantity = () => {
    const productInBasket = basket.find((item) => item.id === product.id);
    return productInBasket ? productInBasket.quantity : 0;
  };

  const quantity = getProductQuantity();

  return (
    <div
      style={{
        fontFamily: "Yekan, sans-serif",
        direction: "rtl",
        textAlign: "right",
        margin: "0 auto",
        maxWidth: "1200px",
        padding: "20px",
      }}
    >
      {/* Back Button */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-start" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#345BC0",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            fontFamily: 'shoor-Medium'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2a4a90";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#345BC0";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FaArrowRight size={18} />
          بازگشت
        </button>
      </div>

      {/* Product Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", alignItems: "center", fontFamily: 'shoor-Medium' }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "100%", height: "auto", borderRadius: "10px", objectFit: "cover" }}
        />
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#345BC0" }}>{product.title}</h1>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#233A48" }}>
            {product.price.toLocaleString()} تومان
          </p>
          <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#555" }}>{product.description}</p>

          {/* Add/Remove Buttons */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#345BC0",
              padding: "10px 0",
              borderRadius: "10px",
              width: "100%",
            }}
          >
            {quantity > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <button
                  onClick={removeFromBasket}
                  style={{
                    backgroundColor: "#fff",
                    color: "#345BC0",
                    border: "none",
                    padding: "10px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "16px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  <FaMinus />
                </button>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>{quantity}</span>
                <button
                  onClick={addToBasket}
                  style={{
                    backgroundColor: "#fff",
                    color: "#345BC0",
                    border: "none",
                    padding: "10px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "16px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  <FaPlus />
                </button>
              </div>
            ) : (
              <button
                onClick={addToBasket}
                style={{
                  backgroundColor: "#345BC0",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontFamily: "Yekan",
                  width: "100%",
                }}
              >
                افزودن به سبد
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
