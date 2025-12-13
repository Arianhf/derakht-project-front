import { http, HttpResponse } from 'msw'
import { mockUser, mockUserAddresses } from '../../mock-data'

export const userHandlers = [
  // Get current user profile
  http.get('*/user/profile/', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    return HttpResponse.json(mockUser)
  }),

  // Update user profile
  http.put('*/user/profile/', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    const body = await request.json() as Partial<typeof mockUser>

    return HttpResponse.json({
      ...mockUser,
      ...body,
    })
  }),

  // Get user addresses
  http.get('*/user/addresses/', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    return HttpResponse.json(mockUserAddresses)
  }),

  // Add new address
  http.post('*/user/addresses/', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    const body = await request.json() as any

    return HttpResponse.json({
      id: String(mockUserAddresses.length + 1),
      ...body,
    })
  }),

  // Update address
  http.put('*/user/addresses/:id/', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    const body = await request.json() as any
    const address = mockUserAddresses.find(addr => addr.id === params.id)

    if (!address) {
      return HttpResponse.json(
        {
          code: 'ADDRESS_NOT_FOUND',
          message: 'آدرس یافت نشد',
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      ...address,
      ...body,
    })
  }),

  // Delete address
  http.delete('*/user/addresses/:id/', ({ params, request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    const address = mockUserAddresses.find(addr => addr.id === params.id)

    if (!address) {
      return HttpResponse.json(
        {
          code: 'ADDRESS_NOT_FOUND',
          message: 'آدرس یافت نشد',
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({ message: 'آدرس حذف شد' })
  }),

  // Upload profile image
  http.post('*/user/profile/image/', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      ...mockUser,
      profile_image: '/uploads/profile/mock-image.jpg',
    })
  }),

  // Delete profile image
  http.delete('*/user/profile/image/', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      ...mockUser,
      profile_image: null,
    })
  }),

  // Get user orders
  http.get('*/user/orders/', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      items: [],
      total: 0,
      page: 1,
      pages: 1,
    })
  }),

  // Get order details
  http.get('*/user/orders/:id/', ({ params, request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'لطفاً وارد شوید',
        },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      id: params.id,
      status: 'delivered',
      total_amount: 500000,
      currency: 'IRR',
      items: [],
      created_at: new Date().toISOString(),
    })
  }),
]
