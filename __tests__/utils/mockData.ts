import type { User } from '@/types/user'
import type { Product, CartItem, Order } from '@/types/shop'
import type { BlogPost } from '@/types/blog'
import type { Story } from '@/types/story'

/**
 * Mock data factories for testing
 *
 * Usage:
 * ```
 * const user = createMockUser({ first_name: 'علی' })
 * const product = createMockProduct({ price: 50000 })
 * ```
 */

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  phone: '09121234567',
  first_name: 'علی',
  last_name: 'احمدی',
  email: 'ali@example.com',
  ...overrides,
})

export const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'product-1',
  title: 'محصول تست',
  slug: 'test-product',
  description: 'توضیحات محصول تست',
  price: 100000,
  discount_price: null,
  thumbnail: '/media/products/test.jpg',
  images: [],
  stock: 10,
  category: {
    id: 'cat-1',
    name: 'کتاب',
    slug: 'book',
  },
  tags: [],
  created_at: '2025-01-01T12:00:00Z',
  updated_at: '2025-01-01T12:00:00Z',
  ...overrides,
})

export const createMockCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'item-1',
  product: createMockProduct(),
  quantity: 1,
  subtotal: 100000,
  ...overrides,
})

export const createMockOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 'order-1',
  order_number: 'ORD-12345',
  status: 'pending',
  total_amount: 160000,
  items: [
    {
      id: 'item-1',
      product_title: 'محصول تست',
      product_slug: 'test-product',
      quantity: 2,
      price: 80000,
      subtotal: 160000,
    },
  ],
  shipping_address: {
    id: 'addr-1',
    recipient_name: 'علی احمدی',
    phone: '09121234567',
    province: 'تهران',
    city: 'تهران',
    postal_code: '1234567890',
    address: 'خیابان ولیعصر',
    is_default: true,
  },
  created_at: '2025-01-01T12:00:00Z',
  updated_at: '2025-01-01T12:00:00Z',
  ...overrides,
})

export const createMockBlogPost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: 'post-1',
  title: 'پست تست',
  slug: 'test-post',
  content: 'محتوای پست تست',
  excerpt: 'خلاصه پست',
  featured_image: '/media/blog/test.jpg',
  published_at: '2025-01-01T12:00:00Z',
  category: {
    id: 'cat-1',
    name: 'آموزشی',
    slug: 'educational',
  },
  tags: [],
  author: {
    id: 'author-1',
    name: 'نویسنده تست',
  },
  ...overrides,
})

export const createMockStory = (overrides: Partial<Story> = {}): Story => ({
  id: 'story-1',
  title: 'داستان من',
  template: {
    id: 'template-1',
    name: 'قالب تست',
  },
  parts: [],
  created_at: '2025-01-01T12:00:00Z',
  updated_at: '2025-01-01T12:00:00Z',
  is_complete: false,
  ...overrides,
})

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

/**
 * Wait for async updates in tests
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))
