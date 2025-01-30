import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockProducts } from "../data/mockProducts";
import { FaShoppingBasket, FaPlus, FaMinus } from "react-icons/fa";

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [basket, setBasket] = useState<{ id: number; title: string; quantity: number }[]>([]);

  // Handle adding items to the basket
  const addToBasket = (product: { id: number; title: string }) => {
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

  // Handle removing items from the basket
  const removeFromBasket = (productId: number) => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === productId);
      if (existingItem?.quantity === 1) {
        return prevBasket.filter((item) => item.id !== productId); // Remove item if quantity is 0
      }
      return prevBasket.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // Get the quantity of a product in the basket
  const getProductQuantity = (productId: number) => {
    const productInBasket = basket.find((item) => item.id === productId);
    return productInBasket ? productInBasket.quantity : 0;
  };

  // Calculate total basket items
  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ height: "100%" }}>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          fontFamily: "Yekan, sans-serif",
          color: "#fff",
          direction: "rtl",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#345BC0",
          }}
          onClick={() => navigate("/")}
        >
          فروشگاه درخت
        </div>

        {/* Basket Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: "10px",
          }}
          onClick={() => navigate("/basket")}
        >
          <FaShoppingBasket size={24} color="#345BC0" />
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#345BC0" }}>{totalItems}</span>
        </div>
      </nav>

      {/* Products Section */}
      <div
        style={{
          direction: "rtl",
          textAlign: "right",
          margin: "0 auto",
          maxWidth: "1400px",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>فروشگاه</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {mockProducts.map((product) => {
            const quantity = getProductQuantity(product.id);

            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  position: "relative",
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                  onClick={() => navigate(`/shop/product/${product.id}`)}
                />
                <div
                  style={{
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "60px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "0",
                      color: "#333",
                    }}
                  >
                    {product.title}
                  </h3>
                  <p style={{ fontSize: "18px", fontWeight: "bold", color: "#233A48", marginBottom: "0" }}>
                    {product.price.toLocaleString()} تومان
                  </p>
                </div>

                {/* Add/Remove Buttons */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    backgroundColor: "#345BC0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px 0",
                    borderRadius: "0 0 10px 10px",
                  }}
                >
                  {quantity > 0 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <button
                        onClick={() => removeFromBasket(product.id)}
                        style={{
                          backgroundColor: "#fff",
                          color: "#345BC0",
                          border: "none",
                          padding: "10px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          fontSize: "16px",
                          width: "32px",
                          height: "32px",
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
                        onClick={() => addToBasket(product)}
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
                      onClick={() => addToBasket(product)}
                      style={{
                        backgroundColor: "#345BC0",
                        color: "#fff",
                        border: "none",
                        padding: "10px 10px",
                        borderRadius: "0 0 10px 10px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontFamily: "shoor-Medium",
                        width: "100%",
                      }}
                    >
                      افزودن به سبد
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
