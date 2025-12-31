import { renderHook, act, waitFor } from '@testing-library/react'
import { useCart, CartProvider } from '@/contexts/CartContext'
import { useUser } from '@/contexts/UserContext'
import { shopService } from '@/services/shopService'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { createMockUser } from '../utils/mockData'

// Mock dependencies
jest.mock('@/contexts/UserContext')
jest.mock('@/services/shopService', () => ({
  shopService: {
    getCart: jest.fn(),
    addCartItem: jest.fn(),
    removeCartItem: jest.fn(),
    increaseCartItemQuantity: jest.fn(),
    decreaseCartItemQuantity: jest.fn(),
    clearCart: jest.fn(),
  },
}))
jest.mock('react-hot-toast')
jest.mock('js-cookie')
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}))

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>
const mockShopService = shopService as jest.Mocked<typeof shopService>
const mockCookies = Cookies as jest.Mocked<typeof Cookies>

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    mockUseUser.mockReturnValue({
      user: null,
      loading: false,
      isStaff: false,
      fetchUser: jest.fn(),
      updateProfile: jest.fn(),
      updateAddress: jest.fn(),
      updateProfileImage: jest.fn(),
      deleteProfileImage: jest.fn(),
      logout: jest.fn(),
    })

    mockCookies.get.mockReturnValue(undefined)
    mockCookies.set.mockImplementation(() => {})
  })

  describe('useCart hook', () => {
    it('throws error when used outside CartProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useCart())
      }).toThrow('useCart must be used within a CartProvider')

      consoleError.mockRestore()
    })

    it('can be used within CartProvider', () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      expect(result.current).toBeDefined()
      expect(result.current.addToCart).toBeInstanceOf(Function)
      expect(result.current.cartDetails).toBeDefined()
    })
  })

  describe('initial state', () => {
    it('starts with loading true', () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      expect(result.current.loading).toBe(true)
    })

    it('fetches cart on mount', async () => {
      const mockCart = {
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              title: 'محصول تست',
              price: '100000',
              image: null,
              slug: 'test-product',
            },
            quantity: 2,
            total_price: '200000',
          },
        ],
        total_price: '200000',
        total_items: 1,
      }

      mockShopService.getCart.mockResolvedValue(mockCart)

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.cartDetails).toEqual(mockCart)
      expect(mockShopService.getCart).toHaveBeenCalled()
    })

    it('handles empty cart on mount', async () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.cartDetails?.items).toHaveLength(0)
      expect(result.current.cartDetails?.total_items).toBe(0)
    })

    it('handles cart fetch error silently', async () => {
      mockShopService.getCart.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Error handled silently, cart remains null
      expect(result.current.cartDetails).toBeNull()
      expect(toast.error).not.toHaveBeenCalled()
    })
  })

  describe('anonymous cart ID', () => {
    it('generates anonymous cart ID if not exists', async () => {
      mockCookies.get.mockReturnValue(undefined)
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(mockCookies.set).toHaveBeenCalledWith(
          'anonymous_cart_id',
          expect.any(String),
          { expires: 30 }
        )
      })
    })

    it('uses existing anonymous cart ID if present', async () => {
      const existingId = 'existing-cart-id-123'
      mockCookies.get.mockReturnValue(existingId)
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(mockCookies.set).not.toHaveBeenCalled()
      })
    })

    it('does not generate anonymous ID when user is logged in', async () => {
      mockUseUser.mockReturnValue({
        user: createMockUser(),
        loading: false,
        isStaff: false,
        fetchUser: jest.fn(),
        updateProfile: jest.fn(),
        updateAddress: jest.fn(),
        updateProfileImage: jest.fn(),
        deleteProfileImage: jest.fn(),
        logout: jest.fn(),
      })

      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(mockShopService.getCart).toHaveBeenCalled()
      })

      // Should not set cookie for authenticated users
      expect(mockCookies.set).not.toHaveBeenCalled()
    })
  })

  describe('addToCart', () => {
    it('adds item to cart successfully', async () => {
      const initialCart = {
        items: [],
        total_price: '0',
        total_items: 0,
      }

      const updatedCart = {
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              title: 'محصول جدید',
              price: '150000',
              image: null,
              slug: 'new-product',
            },
            quantity: 1,
            total_price: '150000',
          },
        ],
        total_price: '150000',
        total_items: 1,
      }

      mockShopService.getCart.mockResolvedValue(initialCart)
      mockShopService.addCartItem.mockResolvedValue(updatedCart)

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.addToCart('p1', 1)
      })

      expect(mockShopService.addCartItem).toHaveBeenCalledWith('p1', 1)
      expect(result.current.cartDetails).toEqual(updatedCart)
      expect(toast.success).toHaveBeenCalledWith('محصول به سبد خرید اضافه شد')
    })

    it('uses default quantity of 1', async () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })
      mockShopService.addCartItem.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.addToCart('p1')
      })

      expect(mockShopService.addCartItem).toHaveBeenCalledWith('p1', 1)
    })

    it('handles add to cart error', async () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })
      mockShopService.addCartItem.mockRejectedValue({
        message: 'محصول موجود نیست',
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.addToCart('p1')
      })

      expect(toast.error).toHaveBeenCalledWith('محصول موجود نیست')
    })
  })

  describe('removeFromCart', () => {
    it('removes item from cart successfully', async () => {
      const initialCart = {
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              title: 'محصول',
              price: '100000',
              image: null,
              slug: 'product',
            },
            quantity: 1,
            total_price: '100000',
          },
        ],
        total_price: '100000',
        total_items: 1,
      }

      const updatedCart = {
        items: [],
        total_price: '0',
        total_items: 0,
      }

      mockShopService.getCart.mockResolvedValue(initialCart)
      mockShopService.removeCartItem.mockResolvedValue(updatedCart)

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.cartDetails?.items).toHaveLength(1)
      })

      await act(async () => {
        await result.current.removeFromCart('p1')
      })

      expect(mockShopService.removeCartItem).toHaveBeenCalledWith('p1')
      expect(result.current.cartDetails?.items).toHaveLength(0)
      expect(toast.success).toHaveBeenCalledWith('محصول از سبد خرید حذف شد')
    })

    it('handles remove from cart error', async () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })
      mockShopService.removeCartItem.mockRejectedValue({
        message: 'خطا در حذف محصول',
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.removeFromCart('p1')
      })

      expect(toast.error).toHaveBeenCalledWith('خطا در حذف محصول')
    })
  })

  describe('increaseQuantity', () => {
    it('increases item quantity successfully', async () => {
      const initialCart = {
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              title: 'محصول',
              price: '100000',
              image: null,
              slug: 'product',
            },
            quantity: 1,
            total_price: '100000',
          },
        ],
        total_price: '100000',
        total_items: 1,
      }

      const updatedCart = {
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              title: 'محصول',
              price: '100000',
              image: null,
              slug: 'product',
            },
            quantity: 2,
            total_price: '200000',
          },
        ],
        total_price: '200000',
        total_items: 1,
      }

      mockShopService.getCart.mockResolvedValue(initialCart)
      mockShopService.increaseCartItemQuantity.mockResolvedValue(updatedCart)

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.cartDetails?.items[0].quantity).toBe(1)
      })

      await act(async () => {
        await result.current.increaseQuantity('p1')
      })

      expect(mockShopService.increaseCartItemQuantity).toHaveBeenCalledWith('p1')
      expect(result.current.cartDetails?.items[0].quantity).toBe(2)
    })

    it('handles increase quantity error', async () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })
      mockShopService.increaseCartItemQuantity.mockRejectedValue({
        message: 'موجودی کافی نیست',
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.increaseQuantity('p1')
      })

      expect(toast.error).toHaveBeenCalledWith('موجودی کافی نیست')
    })
  })

  describe('decreaseQuantity', () => {
    it('decreases item quantity successfully', async () => {
      const initialCart = {
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              title: 'محصول',
              price: '100000',
              image: null,
              slug: 'product',
            },
            quantity: 2,
            total_price: '200000',
          },
        ],
        total_price: '200000',
        total_items: 1,
      }

      const updatedCart = {
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              title: 'محصول',
              price: '100000',
              image: null,
              slug: 'product',
            },
            quantity: 1,
            total_price: '100000',
          },
        ],
        total_price: '100000',
        total_items: 1,
      }

      mockShopService.getCart.mockResolvedValue(initialCart)
      mockShopService.decreaseCartItemQuantity.mockResolvedValue(updatedCart)

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.cartDetails?.items[0].quantity).toBe(2)
      })

      await act(async () => {
        await result.current.decreaseQuantity('p1')
      })

      expect(mockShopService.decreaseCartItemQuantity).toHaveBeenCalledWith('p1')
      expect(result.current.cartDetails?.items[0].quantity).toBe(1)
    })

    it('handles decrease quantity error', async () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })
      mockShopService.decreaseCartItemQuantity.mockRejectedValue({
        message: 'خطا در کاهش تعداد',
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.decreaseQuantity('p1')
      })

      expect(toast.error).toHaveBeenCalledWith('خطا در کاهش تعداد')
    })
  })

  describe('clearCart', () => {
    it('clears cart successfully', async () => {
      const initialCart = {
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              title: 'محصول',
              price: '100000',
              image: null,
              slug: 'product',
            },
            quantity: 1,
            total_price: '100000',
          },
        ],
        total_price: '100000',
        total_items: 1,
      }

      const emptyCart = {
        items: [],
        total_price: '0',
        total_items: 0,
      }

      mockShopService.getCart.mockResolvedValue(initialCart)
      mockShopService.clearCart.mockResolvedValue(emptyCart)

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.cartDetails?.items).toHaveLength(1)
      })

      await act(async () => {
        await result.current.clearCart()
      })

      expect(mockShopService.clearCart).toHaveBeenCalled()
      expect(result.current.cartDetails?.items).toHaveLength(0)
      expect(toast.success).toHaveBeenCalledWith('سبد خرید خالی شد')
    })

    it('refreshes cart after clearing if shouldRefresh is true', async () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })
      mockShopService.clearCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Clear initial call count
      mockShopService.getCart.mockClear()

      await act(async () => {
        await result.current.clearCart(true)
      })

      // Should call getCart again to refresh
      expect(mockShopService.getCart).toHaveBeenCalled()
    })

    it('handles clear cart error', async () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })
      mockShopService.clearCart.mockRejectedValue({
        message: 'خطا در خالی کردن سبد',
      })

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.clearCart()
      })

      expect(toast.error).toHaveBeenCalledWith('خطا در خالی کردن سبد')
    })
  })

  describe('refreshCart', () => {
    it('refreshes cart successfully', async () => {
      const initialCart = {
        items: [],
        total_price: '0',
        total_items: 0,
      }

      const updatedCart = {
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              title: 'محصول جدید',
              price: '100000',
              image: null,
              slug: 'new-product',
            },
            quantity: 1,
            total_price: '100000',
          },
        ],
        total_price: '100000',
        total_items: 1,
      }

      mockShopService.getCart
        .mockResolvedValueOnce(initialCart)
        .mockResolvedValueOnce(updatedCart)

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(result.current.cartDetails?.items).toHaveLength(0)
      })

      await act(async () => {
        await result.current.refreshCart()
      })

      expect(result.current.cartDetails?.items).toHaveLength(1)
      expect(mockShopService.getCart).toHaveBeenCalledTimes(2)
    })
  })

  describe('user state changes', () => {
    it('refreshes cart when user logs in', async () => {
      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      // Start with no user
      const { rerender } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(mockShopService.getCart).toHaveBeenCalledTimes(1)
      })

      // Simulate user login
      mockUseUser.mockReturnValue({
        user: createMockUser(),
        loading: false,
        isStaff: false,
        fetchUser: jest.fn(),
        updateProfile: jest.fn(),
        updateAddress: jest.fn(),
        updateProfileImage: jest.fn(),
        deleteProfileImage: jest.fn(),
        logout: jest.fn(),
      })

      rerender()

      await waitFor(() => {
        // Cart should refresh when user changes
        expect(mockShopService.getCart).toHaveBeenCalledTimes(2)
      })
    })

    it('refreshes cart when user logs out', async () => {
      // Start with logged in user
      mockUseUser.mockReturnValue({
        user: createMockUser(),
        loading: false,
        isStaff: false,
        fetchUser: jest.fn(),
        updateProfile: jest.fn(),
        updateAddress: jest.fn(),
        updateProfileImage: jest.fn(),
        deleteProfileImage: jest.fn(),
        logout: jest.fn(),
      })

      mockShopService.getCart.mockResolvedValue({
        items: [],
        total_price: '0',
        total_items: 0,
      })

      const { rerender } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      await waitFor(() => {
        expect(mockShopService.getCart).toHaveBeenCalledTimes(1)
      })

      // Simulate user logout
      mockUseUser.mockReturnValue({
        user: null,
        loading: false,
        isStaff: false,
        fetchUser: jest.fn(),
        updateProfile: jest.fn(),
        updateAddress: jest.fn(),
        updateProfileImage: jest.fn(),
        deleteProfileImage: jest.fn(),
        logout: jest.fn(),
      })

      rerender()

      await waitFor(() => {
        // Cart should refresh when user changes
        expect(mockShopService.getCart).toHaveBeenCalledTimes(2)
      })
    })
  })
})
