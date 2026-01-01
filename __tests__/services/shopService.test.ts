import { shopService } from '@/services/shopService'
import api from '@/services/api'
import Cookies from 'js-cookie'

// Mock dependencies
jest.mock('@/services/api')
jest.mock('js-cookie')

const mockApi = api as jest.Mocked<typeof api>
const mockCookies = Cookies as jest.Mocked<typeof Cookies>

describe('shopService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('getAnonymousCartId', () => {
    it('retrieves anonymous cart ID from cookies', () => {
      mockCookies.get.mockReturnValue('test-cart-id-123')

      const result = shopService.getAnonymousCartId()

      expect(mockCookies.get).toHaveBeenCalledWith('anonymous_cart_id')
      expect(result).toBe('test-cart-id-123')
    })

    it('returns undefined when no cart ID exists', () => {
      mockCookies.get.mockReturnValue(undefined)

      const result = shopService.getAnonymousCartId()

      expect(result).toBeUndefined()
    })
  })

  describe('getProducts', () => {
    it('fetches products without filters', async () => {
      const mockProducts = {
        results: [
          {
            id: 'prod-1',
            title: 'محصول ۱',
            price: '100000',
            slug: 'product-1',
          },
        ],
      }

      mockApi.get.mockResolvedValue({ data: mockProducts })

      const result = await shopService.getProducts()

      expect(mockApi.get).toHaveBeenCalledWith('/shop/products/')
      expect(result).toEqual(mockProducts)
    })

    it('fetches products with search filter', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProducts({ searchTerm: 'کتاب' })

      expect(mockApi.get).toHaveBeenCalledWith('/shop/products/?search=%DA%A9%D8%AA%D8%A7%D8%A8')
    })

    it('fetches products with category filter', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProducts({ category: 'books' })

      expect(mockApi.get).toHaveBeenCalledWith('/shop/products/?category=books')
    })

    it('fetches products with price range filter', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProducts({
        price: {
          min: 10000,
          max: 50000,
        },
      })

      expect(mockApi.get).toHaveBeenCalledWith(
        '/shop/products/?min_price=10000&max_price=50000'
      )
    })

    it('fetches products sorted by price low to high', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProducts({ sort: 'price_low' })

      expect(mockApi.get).toHaveBeenCalledWith('/shop/products/?ordering=price')
    })

    it('fetches products sorted by price high to low', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProducts({ sort: 'price_high' })

      expect(mockApi.get).toHaveBeenCalledWith('/shop/products/?ordering=-price')
    })

    it('fetches products sorted by newest', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProducts({ sort: 'newest' })

      expect(mockApi.get).toHaveBeenCalledWith('/shop/products/?ordering=-created_at')
    })

    it('fetches products with combined filters', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProducts({
        searchTerm: 'کتاب',
        category: 'education',
        price: { min: 20000, max: 100000 },
        sort: 'popular',
      })

      const call = mockApi.get.mock.calls[0][0]
      expect(call).toContain('search=')
      expect(call).toContain('category=education')
      expect(call).toContain('min_price=20000')
      expect(call).toContain('max_price=100000')
      expect(call).toContain('ordering=-popularity')
    })
  })

  describe('getProductBySlug', () => {
    it('fetches product by slug successfully', async () => {
      const mockProduct = {
        id: 'prod-1',
        title: 'کتاب آموزشی',
        slug: 'educational-book',
        price: '50000',
      }

      mockApi.get.mockResolvedValue({ data: mockProduct })

      const result = await shopService.getProductBySlug('educational-book')

      expect(mockApi.get).toHaveBeenCalledWith('/shop/products/educational-book/')
      expect(result).toEqual(mockProduct)
    })
  })

  describe('getProductsByCategory', () => {
    it('fetches products by category slug', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProductsByCategory('books')

      expect(mockApi.get).toHaveBeenCalledWith('/shop/products/by_category_slug/books/')
    })

    it('fetches products by category with filters', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProductsByCategory('books', {
        price: { min: 10000 },
        sort: 'price_low',
      })

      const call = mockApi.get.mock.calls[0][0]
      expect(call).toContain('/shop/products/by_category_slug/books/')
      expect(call).toContain('min_price=10000')
      expect(call).toContain('ordering=price')
    })
  })

  describe('getCartDetails', () => {
    it('fetches cart without anonymous cart ID', async () => {
      mockCookies.get.mockReturnValue(undefined)
      const mockCart = {
        items: [],
        total_price: '0',
        total_items: 0,
      }

      mockApi.get.mockResolvedValue({ data: mockCart })

      const result = await shopService.getCartDetails()

      expect(mockApi.get).toHaveBeenCalledWith('/shop/cart/details/')
      expect(result).toEqual(mockCart)
    })

    it('fetches cart with anonymous cart ID', async () => {
      mockCookies.get.mockReturnValue('anon-cart-123')

      mockApi.get.mockResolvedValue({
        data: {
          items: [{ id: '1', quantity: 2 }],
          total_price: '100000',
          total_items: 1,
        },
      })

      await shopService.getCartDetails()

      expect(mockApi.get).toHaveBeenCalledWith(
        '/shop/cart/details/?cart_id=anon-cart-123'
      )
    })
  })

  describe('addToCart', () => {
    it('adds item to cart with default quantity', async () => {
      mockCookies.get.mockReturnValue(undefined)
      const mockResponse = {
        items: [{ product_id: 'prod-1', quantity: 1 }],
      }

      mockApi.post.mockResolvedValue({ data: mockResponse })

      const result = await shopService.addToCart('prod-1')

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/add_item/', {
        product_id: 'prod-1',
        quantity: 1,
        anonymous_cart_id: undefined,
      })
      expect(result).toEqual(mockResponse)
    })

    it('adds item to cart with custom quantity', async () => {
      mockCookies.get.mockReturnValue('anon-123')

      mockApi.post.mockResolvedValue({ data: {} })

      await shopService.addToCart('prod-1', 3)

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/add_item/', {
        product_id: 'prod-1',
        quantity: 3,
        anonymous_cart_id: 'anon-123',
      })
    })
  })

  describe('updateCartItemQuantity', () => {
    it('updates cart item quantity', async () => {
      mockCookies.get.mockReturnValue('anon-123')

      mockApi.post.mockResolvedValue({ data: {} })

      await shopService.updateCartItemQuantity('prod-1', 5)

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/update_quantity/', {
        product_id: 'prod-1',
        quantity: 5,
        anonymous_cart_id: 'anon-123',
      })
    })
  })

  describe('removeFromCart', () => {
    it('removes item from cart', async () => {
      mockCookies.get.mockReturnValue(undefined)

      mockApi.post.mockResolvedValue({ data: {} })

      await shopService.removeFromCart('prod-1')

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/remove_item/', {
        product_id: 'prod-1',
        anonymous_cart_id: undefined,
      })
    })
  })

  describe('clearCart', () => {
    it('clears cart without anonymous cart ID', async () => {
      mockCookies.get.mockReturnValue(undefined)

      mockApi.post.mockResolvedValue({ data: {} })

      await shopService.clearCart()

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/clear/')
    })

    it('clears cart with anonymous cart ID', async () => {
      mockCookies.get.mockReturnValue('anon-456')

      mockApi.post.mockResolvedValue({ data: {} })

      await shopService.clearCart()

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/clear/?cart_id=anon-456')
    })
  })

  describe('getShippingEstimate', () => {
    it('gets shipping estimate without cart ID', async () => {
      mockCookies.get.mockReturnValue(undefined)
      const mockEstimate = {
        shipping_cost: '30000',
        estimated_delivery: '3-5 روز کاری',
      }

      mockApi.post.mockResolvedValue({ data: mockEstimate })

      const result = await shopService.getShippingEstimate('تهران', 'تهران')

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/shipping-estimate/', {
        province: 'تهران',
        city: 'تهران',
      })
      expect(result).toEqual(mockEstimate)
    })

    it('gets shipping estimate with cart ID', async () => {
      mockCookies.get.mockReturnValue('anon-789')

      mockApi.post.mockResolvedValue({ data: { shipping_cost: '40000' } })

      await shopService.getShippingEstimate('اصفهان', 'اصفهان')

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/shipping-estimate/', {
        province: 'اصفهان',
        city: 'اصفهان',
        cart_id: 'anon-789',
      })
    })
  })

  describe('mergeAnonymousCart', () => {
    it('merges cart when anonymous cart has items', async () => {
      mockCookies.get.mockReturnValue('anon-cart-123')

      const mockCart = {
        items: [{ id: 'item-1' }],
      }

      mockApi.get.mockResolvedValue({ data: mockCart })
      mockApi.post.mockResolvedValue({ data: { success: true } })

      await shopService.mergeAnonymousCart()

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/merge/', {
        anonymous_cart_id: 'anon-cart-123',
      })
      expect(mockCookies.remove).toHaveBeenCalledWith('anonymous_cart_id')
    })

    it('does not merge when cart is empty', async () => {
      mockCookies.get.mockReturnValue('anon-cart-456')

      mockApi.get.mockResolvedValue({ data: { items: [] } })

      await shopService.mergeAnonymousCart()

      expect(mockApi.post).not.toHaveBeenCalled()
      expect(mockCookies.remove).toHaveBeenCalledWith('anonymous_cart_id')
    })

    it('does nothing when no anonymous cart ID exists', async () => {
      mockCookies.get.mockReturnValue(undefined)

      await shopService.mergeAnonymousCart()

      expect(mockApi.get).not.toHaveBeenCalled()
      expect(mockApi.post).not.toHaveBeenCalled()
      expect(mockCookies.remove).not.toHaveBeenCalled()
    })

    it('removes cookie even when merge fails', async () => {
      mockCookies.get.mockReturnValue('anon-cart-789')

      mockApi.get.mockResolvedValue({ data: { items: [{ id: '1' }] } })
      mockApi.post.mockRejectedValue(new Error('Merge failed'))

      // Should not throw error
      await shopService.mergeAnonymousCart()

      // Cookie should still be removed
      expect(mockCookies.remove).toHaveBeenCalledWith('anonymous_cart_id')
    })
  })

  describe('checkout', () => {
    it('creates checkout with shipping info', async () => {
      mockCookies.get.mockReturnValue(undefined)

      const shippingInfo = {
        full_name: 'علی محمدی',
        phone_number: '09121234567',
        province: 'تهران',
        city: 'تهران',
        postal_code: '1234567890',
        address: 'خیابان ولیعصر',
      }

      const mockOrder = {
        id: 'order-1',
        status: 'pending',
        total_price: '150000',
      }

      mockApi.post.mockResolvedValue({ data: mockOrder })

      const result = await shopService.checkout(shippingInfo)

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/checkout/', {
        shipping_info: shippingInfo,
      })
      expect(result).toEqual(mockOrder)
    })

    it('creates checkout with anonymous cart ID', async () => {
      mockCookies.get.mockReturnValue('anon-999')

      const shippingInfo = {
        full_name: 'رضا احمدی',
        phone_number: '09129876543',
        province: 'اصفهان',
        city: 'اصفهان',
        postal_code: '9876543210',
        address: 'خیابان چهارباغ',
      }

      mockApi.post.mockResolvedValue({ data: { id: 'order-2' } })

      await shopService.checkout(shippingInfo)

      expect(mockApi.post).toHaveBeenCalledWith('/shop/cart/checkout/', {
        shipping_info: shippingInfo,
        anonymous_cart_id: 'anon-999',
      })
    })
  })

  describe('requestPayment', () => {
    it('requests payment for order', async () => {
      const mockPaymentResponse = {
        payment_url: 'https://payment-gateway.example.com/pay/123',
        transaction_id: 'trans-123',
      }

      mockApi.post.mockResolvedValue({ data: mockPaymentResponse })

      const result = await shopService.requestPayment('order-1', 'zarinpal')

      expect(mockApi.post).toHaveBeenCalledWith('/shop/payments/request/order-1/', {
        gateway: 'zarinpal',
      })
      expect(result).toEqual(mockPaymentResponse)
    })
  })

  describe('verifyPayment', () => {
    it('verifies payment successfully', async () => {
      const mockVerification = {
        status: 'success',
        order_id: 'order-1',
        transaction_id: 'trans-123',
      }

      mockApi.post.mockResolvedValue({ data: mockVerification })

      const result = await shopService.verifyPayment('order-1', 'trans-123')

      expect(mockApi.post).toHaveBeenCalledWith('/shop/payments/verify/', {
        order_id: 'order-1',
        transaction_id: 'trans-123',
      })
      expect(result).toEqual(mockVerification)
    })

    it('throws structured error on verification failure', async () => {
      const error = {
        response: {
          data: {
            error_code: 'invalid_transaction',
            error_message: 'تراکنش نامعتبر است',
          },
        },
      }

      mockApi.post.mockRejectedValue(error)

      await expect(
        shopService.verifyPayment('order-1', 'invalid-trans')
      ).rejects.toEqual({
        status: 'failed',
        error_code: 'invalid_transaction',
        error_message: 'تراکنش نامعتبر است',
      })
    })

    it('handles error without response data', async () => {
      mockApi.post.mockRejectedValue(new Error('Network error'))

      await expect(
        shopService.verifyPayment('order-1', 'trans-123')
      ).rejects.toEqual({
        status: 'failed',
        error_code: 'unknown',
        error_message: 'خطا در تایید پرداخت',
      })
    })
  })

  describe('uploadPaymentReceipt', () => {
    it('uploads payment receipt successfully', async () => {
      const receiptFile = new File(['receipt'], 'receipt.jpg', {
        type: 'image/jpeg',
      })

      mockApi.post.mockResolvedValue({ data: { success: true } })

      await shopService.uploadPaymentReceipt('order-1', receiptFile)

      expect(mockApi.post).toHaveBeenCalled()
      const callArgs = mockApi.post.mock.calls[0]
      expect(callArgs[0]).toBe('/shop/payments/upload-receipt/')
      expect(callArgs[1]).toBeInstanceOf(FormData)
      expect(callArgs[2]).toEqual({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    })
  })

  describe('getOrderById', () => {
    it('fetches order by ID', async () => {
      const mockOrder = {
        id: 'order-1',
        status: 'delivered',
        total_price: '200000',
      }

      mockApi.get.mockResolvedValue({ data: mockOrder })

      const result = await shopService.getOrderById('order-1')

      expect(mockApi.get).toHaveBeenCalledWith('/shop/orders/order-1/')
      expect(result).toEqual(mockOrder)
    })
  })

  describe('getProductComments', () => {
    it('fetches product comments with default page', async () => {
      const mockComments = {
        results: [
          {
            id: 'comment-1',
            text: 'محصول عالی',
            user: 'علی',
          },
        ],
      }

      mockApi.get.mockResolvedValue({ data: mockComments })

      const result = await shopService.getProductComments('product-slug')

      expect(mockApi.get).toHaveBeenCalledWith(
        '/shop/products/product-slug/comments/?page=1'
      )
      expect(result).toEqual(mockComments)
    })

    it('fetches product comments with custom page', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await shopService.getProductComments('product-slug', 2)

      expect(mockApi.get).toHaveBeenCalledWith(
        '/shop/products/product-slug/comments/?page=2'
      )
    })
  })

  describe('createProductComment', () => {
    it('creates product comment successfully', async () => {
      const commentText = 'محصول بسیار مفید بود'
      const mockComment = {
        id: 'comment-new',
        text: commentText,
        created_at: '2026-01-01T12:00:00Z',
      }

      mockApi.post.mockResolvedValue({ data: mockComment })

      const result = await shopService.createProductComment('product-slug', commentText)

      expect(mockApi.post).toHaveBeenCalledWith(
        '/shop/products/product-slug/comments/',
        { text: commentText }
      )
      expect(result).toEqual(mockComment)
    })
  })

  describe('deleteProductComment', () => {
    it('deletes product comment successfully', async () => {
      mockApi.delete.mockResolvedValue({ data: { success: true } })

      await shopService.deleteProductComment('product-slug', 'comment-1')

      expect(mockApi.delete).toHaveBeenCalledWith(
        '/shop/products/product-slug/comments/comment-1/'
      )
    })
  })
})
