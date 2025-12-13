import { http, HttpResponse } from 'msw'
import { mockCart, mockProducts, createMockCart, createMockCartItem } from '../../mock-data'

// In-memory cart state for testing
let cartState = { ...mockCart }

export const shopHandlers = [
  // Get products
  http.get('*/shop/products/', ({ request }) => {
    const url = new URL(request.url)
    const searchTerm = url.searchParams.get('search')
    const category = url.searchParams.get('category')
    const minPrice = url.searchParams.get('min_price')
    const maxPrice = url.searchParams.get('max_price')

    let filteredProducts = [...mockProducts]

    // Apply filters
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(p =>
        p.title.includes(searchTerm) || p.description.includes(searchTerm)
      )
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice))
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice))
    }

    return HttpResponse.json({
      items: filteredProducts,
      total: filteredProducts.length,
      page: 1,
      pages: 1,
    })
  }),

  // Get single product
  http.get('*/shop/products/:id/', ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id)

    if (!product) {
      return HttpResponse.json(
        {
          code: 'PRODUCT_NOT_FOUND',
          message: 'محصول یافت نشد',
        },
        { status: 404 }
      )
    }

    return HttpResponse.json(product)
  }),

  // Get cart
  http.get('*/shop/cart/', () => {
    return HttpResponse.json(cartState)
  }),

  // Add to cart
  http.post('*/shop/cart/add/', async ({ request }) => {
    const body = await request.json() as { product_id: string; quantity: number }

    const product = mockProducts.find(p => p.id === body.product_id)

    if (!product) {
      return HttpResponse.json(
        {
          code: 'PRODUCT_NOT_FOUND',
          message: 'محصول یافت نشد',
        },
        { status: 404 }
      )
    }

    if (!product.is_available || product.stock < body.quantity) {
      return HttpResponse.json(
        {
          code: 'PRODUCT_OUT_OF_STOCK',
          message: 'محصول موجود نیست',
        },
        { status: 400 }
      )
    }

    // Add to cart or update quantity
    const existingItem = cartState.items.find(item => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += body.quantity
      existingItem.total_price = existingItem.quantity * existingItem.price
    } else {
      cartState.items.push(createMockCartItem({
        product,
        quantity: body.quantity,
        price: product.price,
      }))
    }

    // Recalculate totals
    cartState.items_count = cartState.items.length
    cartState.total_amount = cartState.items.reduce((sum, item) => sum + item.total_price, 0)

    return HttpResponse.json(cartState)
  }),

  // Update cart item quantity
  http.put('*/shop/cart/update/:id/', async ({ params, request }) => {
    const body = await request.json() as { quantity: number }
    const itemIndex = cartState.items.findIndex(item => item.product.id === params.id)

    if (itemIndex === -1) {
      return HttpResponse.json(
        {
          code: 'ITEM_NOT_FOUND',
          message: 'محصول در سبد خرید یافت نشد',
        },
        { status: 404 }
      )
    }

    if (body.quantity <= 0) {
      // Remove item if quantity is 0
      cartState.items.splice(itemIndex, 1)
    } else {
      cartState.items[itemIndex].quantity = body.quantity
      cartState.items[itemIndex].total_price =
        cartState.items[itemIndex].price * body.quantity
    }

    // Recalculate totals
    cartState.items_count = cartState.items.length
    cartState.total_amount = cartState.items.reduce((sum, item) => sum + item.total_price, 0)

    return HttpResponse.json(cartState)
  }),

  // Remove from cart
  http.delete('*/shop/cart/remove/:id/', ({ params }) => {
    const itemIndex = cartState.items.findIndex(item => item.product.id === params.id)

    if (itemIndex === -1) {
      return HttpResponse.json(
        {
          code: 'ITEM_NOT_FOUND',
          message: 'محصول در سبد خرید یافت نشد',
        },
        { status: 404 }
      )
    }

    cartState.items.splice(itemIndex, 1)

    // Recalculate totals
    cartState.items_count = cartState.items.length
    cartState.total_amount = cartState.items.reduce((sum, item) => sum + item.total_price, 0)

    return HttpResponse.json(cartState)
  }),

  // Clear cart
  http.post('*/shop/cart/clear/', () => {
    cartState = createMockCart({ items: [] })
    return HttpResponse.json(cartState)
  }),

  // Checkout
  http.post('*/shop/checkout/', async ({ request }) => {
    const body = await request.json() as {
      shipping_info: any
      payment_method: string
    }

    if (cartState.items.length === 0) {
      return HttpResponse.json(
        {
          code: 'EMPTY_CART',
          message: 'سبد خرید خالی است',
        },
        { status: 400 }
      )
    }

    // Mock successful checkout
    return HttpResponse.json({
      order_id: 'ORD-' + Math.random().toString(36).substring(7).toUpperCase(),
      payment_url: body.payment_method === 'online'
        ? 'https://payment.zarinpal.com/pg/StartPay/mock-authority'
        : null,
      total: cartState.total_amount,
      status: 'pending',
    })
  }),

  // Payment verification
  http.get('*/shop/payment/verify/', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('Status')
    const orderId = url.searchParams.get('order_id')

    if (status === 'OK' && orderId) {
      return HttpResponse.json({
        status: 'completed',
        order_id: orderId,
        transaction_id: 'TRX-' + Math.random().toString(36).substring(7).toUpperCase(),
        message: 'پرداخت با موفقیت انجام شد',
      })
    }

    return HttpResponse.json(
      {
        code: 'PAYMENT_FAILED',
        message: 'پرداخت ناموفق بود',
      },
      { status: 400 }
    )
  }),
]

// Helper to reset cart state between tests
export function resetCartState() {
  cartState = { ...mockCart }
}
