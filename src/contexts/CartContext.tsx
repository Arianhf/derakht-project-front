'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartDetails } from '@/types/shop';
import { shopService } from '@/services/shopService';
import { toast } from 'react-hot-toast';

interface CartContextType {
  cartDetails: CartDetails | null;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartDetails, setCartDetails] = useState<CartDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const data = await shopService.getCartDetails();
      setCartDetails(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      setLoading(true);
      await shopService.addToCart(productId, quantity);
      await refreshCart();
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('خطا در افزودن محصول به سبد خرید');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      await shopService.removeFromCart(productId);
      await refreshCart();
      toast.success('محصول از سبد خرید حذف شد');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('خطا در حذف محصول از سبد خرید');
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (productId: string) => {
    try {
      setLoading(true);
      const item = cartDetails?.items.find(item => item.product.id === productId);
      if (item) {
        await shopService.updateCartItemQuantity(productId, item.quantity + 1);
        await refreshCart();
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
      toast.error('خطا در افزایش تعداد محصول');
    } finally {
      setLoading(false);
    }
  };

  const decreaseQuantity = async (productId: string) => {
    try {
      setLoading(true);
      const item = cartDetails?.items.find(item => item.product.id === productId);
      if (item && item.quantity > 1) {
        await shopService.updateCartItemQuantity(productId, item.quantity - 1);
        await refreshCart();
      } else if (item && item.quantity === 1) {
        await removeFromCart(productId);
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      toast.error('خطا در کاهش تعداد محصول');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await shopService.clearCart();
      await refreshCart();
      toast.success('سبد خرید خالی شد');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('خطا در خالی کردن سبد خرید');
    } finally {
      setLoading(false);
    }
  };

  return (
      <CartContext.Provider
          value={{
            cartDetails,
            loading,
            addToCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            clearCart,
            refreshCart
          }}
      >
        {children}
      </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};