import { http, HttpResponse } from 'msw'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

/**
 * MSW handlers for common API endpoints
 *
 * Usage in tests:
 * ```
 * import { server } from '@/__tests__/mocks/server'
 *
 * beforeAll(() => server.listen())
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 * ```
 */

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login/`, () => {
    return HttpResponse.json({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: '123',
        phone: '09121234567',
        first_name: 'علی',
        last_name: 'احمدی',
      },
    })
  }),

  http.post(`${API_BASE_URL}/auth/refresh/`, () => {
    return HttpResponse.json({
      access: 'new-mock-access-token',
    })
  }),

  http.post(`${API_BASE_URL}/auth/verify-phone/`, () => {
    return HttpResponse.json({
      message: 'کد تایید ارسال شد',
      session_id: 'mock-session-id',
    })
  }),

  http.post(`${API_BASE_URL}/auth/register/`, () => {
    return HttpResponse.json({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: '456',
        phone: '09121234567',
        first_name: 'محمد',
        last_name: 'رضایی',
      },
    })
  }),

  // User endpoints
  http.get(`${API_BASE_URL}/users/profile/`, () => {
    return HttpResponse.json({
      id: '123',
      phone: '09121234567',
      first_name: 'علی',
      last_name: 'احمدی',
      email: 'ali@example.com',
    })
  }),

  http.patch(`${API_BASE_URL}/users/profile/`, () => {
    return HttpResponse.json({
      id: '123',
      phone: '09121234567',
      first_name: 'علی',
      last_name: 'احمدی',
      email: 'ali.updated@example.com',
    })
  }),

  http.get(`${API_BASE_URL}/users/addresses/`, () => {
    return HttpResponse.json([
      {
        id: '1',
        recipient_name: 'علی احمدی',
        phone: '09121234567',
        province: 'تهران',
        city: 'تهران',
        postal_code: '1234567890',
        address: 'خیابان ولیعصر',
        is_default: true,
      },
    ])
  }),

  // Shop endpoints
  http.get(`${API_BASE_URL}/shop/products/`, () => {
    return HttpResponse.json({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: '1',
          title: 'محصول تست ۱',
          slug: 'test-product-1',
          price: 100000,
          discount_price: 80000,
          thumbnail: '/media/products/test1.jpg',
          stock: 10,
        },
        {
          id: '2',
          title: 'محصول تست ۲',
          slug: 'test-product-2',
          price: 150000,
          discount_price: null,
          thumbnail: '/media/products/test2.jpg',
          stock: 5,
        },
      ],
    })
  }),

  http.get(`${API_BASE_URL}/shop/products/:slug/`, ({ params }) => {
    return HttpResponse.json({
      id: '1',
      title: 'محصول تست',
      slug: params.slug,
      description: 'توضیحات محصول تست',
      price: 100000,
      discount_price: 80000,
      thumbnail: '/media/products/test.jpg',
      images: [],
      stock: 10,
      category: 'کتاب',
    })
  }),

  http.get(`${API_BASE_URL}/shop/cart/`, () => {
    return HttpResponse.json({
      id: 'cart-1',
      items: [
        {
          id: '1',
          product: {
            id: '1',
            title: 'محصول تست',
            slug: 'test-product',
            price: 100000,
            discount_price: 80000,
            thumbnail: '/media/products/test.jpg',
          },
          quantity: 2,
          subtotal: 160000,
        },
      ],
      total_price: 160000,
      item_count: 2,
    })
  }),

  http.post(`${API_BASE_URL}/shop/cart/items/`, () => {
    return HttpResponse.json({
      id: '2',
      product: {
        id: '2',
        title: 'محصول جدید',
        slug: 'new-product',
        price: 50000,
        discount_price: null,
        thumbnail: '/media/products/new.jpg',
      },
      quantity: 1,
      subtotal: 50000,
    })
  }),

  http.patch(`${API_BASE_URL}/shop/cart/items/:id/`, () => {
    return HttpResponse.json({
      id: '1',
      quantity: 3,
      subtotal: 240000,
    })
  }),

  http.delete(`${API_BASE_URL}/shop/cart/items/:id/`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Blog endpoints
  http.get(`${API_BASE_URL}/blog/posts/`, () => {
    return HttpResponse.json({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: '1',
          title: 'پست تست ۱',
          slug: 'test-post-1',
          excerpt: 'خلاصه پست تست',
          featured_image: '/media/blog/test1.jpg',
          published_at: '2025-01-01T12:00:00Z',
          category: {
            id: '1',
            name: 'آموزشی',
            slug: 'educational',
          },
        },
      ],
    })
  }),

  http.get(`${API_BASE_URL}/blog/posts/:slug/`, ({ params }) => {
    return HttpResponse.json({
      id: '1',
      title: 'پست تست',
      slug: params.slug,
      content: 'محتوای پست تست',
      excerpt: 'خلاصه پست',
      featured_image: '/media/blog/test.jpg',
      published_at: '2025-01-01T12:00:00Z',
      category: {
        id: '1',
        name: 'آموزشی',
        slug: 'educational',
      },
      tags: [
        { id: '1', name: 'برچسب ۱', slug: 'tag-1' },
      ],
    })
  }),

  // Story endpoints
  http.get(`${API_BASE_URL}/stories/templates/`, () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'قالب تست',
        parts: [],
      },
    ])
  }),

  http.get(`${API_BASE_URL}/stories/my-stories/`, () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'داستان من',
        created_at: '2025-01-01T12:00:00Z',
        updated_at: '2025-01-01T12:00:00Z',
        is_complete: false,
      },
    ])
  }),

  http.post(`${API_BASE_URL}/stories/`, () => {
    return HttpResponse.json({
      id: '2',
      title: 'داستان جدید',
      template: '1',
      created_at: '2025-01-01T13:00:00Z',
      updated_at: '2025-01-01T13:00:00Z',
      is_complete: false,
    })
  }),

  http.get(`${API_BASE_URL}/stories/:id/`, ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: 'داستان تست',
      template: {
        id: '1',
        name: 'قالب تست',
      },
      parts: [],
      created_at: '2025-01-01T12:00:00Z',
      updated_at: '2025-01-01T12:00:00Z',
      is_complete: false,
    })
  }),

  // Order endpoints
  http.post(`${API_BASE_URL}/shop/orders/`, () => {
    return HttpResponse.json({
      id: 'order-1',
      order_number: 'ORD-12345',
      total_amount: 160000,
      status: 'pending',
      created_at: '2025-01-01T12:00:00Z',
    })
  }),

  http.get(`${API_BASE_URL}/shop/orders/:id/`, ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      order_number: 'ORD-12345',
      total_amount: 160000,
      status: 'paid',
      items: [
        {
          id: '1',
          product_title: 'محصول تست',
          quantity: 2,
          price: 80000,
          subtotal: 160000,
        },
      ],
      shipping_address: {
        recipient_name: 'علی احمدی',
        phone: '09121234567',
        address: 'خیابان ولیعصر',
      },
      created_at: '2025-01-01T12:00:00Z',
    })
  }),
]
