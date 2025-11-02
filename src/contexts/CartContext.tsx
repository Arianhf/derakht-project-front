// 1. Update your CartContext.tsx to handle anonymous carts

import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartDetails } from '@/types/shop';
import { shopService } from '@/services/shopService';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { useUser } from './UserContext';

interface CartContextType {
  cartDetails: CartDetails | null;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  clearCart: (refreshCart: boolean) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartDetails, setCartDetails] = useState<CartDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Generate or retrieve anonymous cart ID
  useEffect(() => {
    // Check if we already have an anonymous cart ID
    let anonymousCartId = Cookies.get('anonymous_cart_id');

    // If not, create one and store it
    if (!anonymousCartId) {
      anonymousCartId = uuidv4();
      Cookies.set('anonymous_cart_id', anonymousCartId, { expires: 30 }); // Expires in 30 days
    }
  }, []);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const data = await shopService.getCartDetails();
      setCartDetails(data);
    } catch (error) {
      // Error fetching cart - silently handle in production
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]); // Refresh cart when user changes (login/logout)

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      setLoading(true);
      await shopService.addToCart(productId, quantity);
      await refreshCart();
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (error: unknown) {
      // Extract error message from API response
      let errorMessage = 'خطا در افزودن محصول به سبد خرید';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string; detail?: string } } };
        errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.detail || errorMessage;
      }
      toast.error(errorMessage);
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
    } catch (error: unknown) {
      let errorMessage = 'خطا در حذف محصول از سبد خرید';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string; detail?: string } } };
        errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.detail || errorMessage;
      }
      toast.error(errorMessage);
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
    } catch (error: unknown) {
      let errorMessage = 'خطا در افزایش تعداد محصول';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string; detail?: string } } };
        errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.detail || errorMessage;
      }
      toast.error(errorMessage);
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
    } catch (error: unknown) {
      let errorMessage = 'خطا در کاهش تعداد محصول';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string; detail?: string } } };
        errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.detail || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (skipRefresh = false) => {
    try {
      setLoading(true);
      await shopService.clearCart();
      if (!skipRefresh) {
        await refreshCart();
      } else {
        setCartDetails(null);
      }
      toast.success('سبد خرید خالی شد');
    } catch (error) {
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