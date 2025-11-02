import { useMemo } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/shop';
import { toast } from 'react-hot-toast';

/**
 * Custom hook to manage product quantity in cart
 * Provides methods and state for cart interactions
 *
 * @param product - The product to manage in the cart
 * @returns An object with cart-related methods and state
 */
export const useProductQuantity = (product: Product) => {
    const {
        cartDetails,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity
    } = useCart();

    // Memoized quantity calculation
    const quantity = useMemo(() => {
        // If no product or no cart details, return 0
        if (!product || !cartDetails) return 0;

        // Find the item in the cart
        const cartItem = cartDetails.items.find(
            item => item.product.id === product.id
        );

        // Return quantity or 0 if not found
        return cartItem ? cartItem.quantity : 0;
    }, [cartDetails, product]);

    // Check if product is in cart
    const isInCart = quantity > 0;

    // Add to cart handler
    const handleAddToCart = async () => {
        if (product && product.is_available) {
            await addToCart(product.id);
        } else {
            toast.error('این محصول در حال حاضر موجود نیست');
        }
    };

    // Increase quantity handler
    const handleIncreaseQuantity = async () => {
        if (product && product.is_available) {
            await increaseQuantity(product.id);
        }
    };

    // Decrease quantity handler
    const handleDecreaseQuantity = async () => {
        if (!product) return;

        if (quantity === 1) {
            await removeFromCart(product.id);
        } else {
            await decreaseQuantity(product.id);
        }
    };

    // Return an object with all the methods and state
    return {
        // Quantity of the product in cart
        quantity,

        // Whether the product is in cart
        isInCart,

        // Methods to interact with cart
        handleAddToCart,
        handleIncreaseQuantity,
        handleDecreaseQuantity
    };
};