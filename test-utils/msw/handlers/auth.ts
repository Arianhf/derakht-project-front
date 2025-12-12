import { http, HttpResponse } from 'msw'
import { mockLoginResponse, mockAuthTokens, mockUser } from '../../mock-data'

export const authHandlers = [
  // Login endpoint
  http.post('*/user/login/', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }

    // Valid credentials check
    if (body.email === 'test@example.com' && body.password === 'Password123!') {
      return HttpResponse.json(mockLoginResponse)
    }

    // Invalid credentials
    return HttpResponse.json(
      {
        code: 'INVALID_CREDENTIALS',
        message: 'ایمیل یا رمز عبور نادرست است',
      },
      { status: 401 }
    )
  }),

  // Signup endpoint
  http.post('*/user/signup/', async ({ request }) => {
    const body = await request.json() as {
      email: string
      password: string
      confirm_password: string
      first_name: string
      last_name: string
      age: number
    }

    // Check for existing email (mock validation)
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'این ایمیل قبلاً ثبت شده است',
          details: {
            errors: {
              email: 'ایمیل تکراری است',
            },
          },
        },
        { status: 400 }
      )
    }

    // Check password match
    if (body.password !== body.confirm_password) {
      return HttpResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'رمزهای عبور یکسان نیستند',
          details: {
            errors: {
              confirm_password: 'رمز عبور با تکرار آن مطابقت ندارد',
            },
          },
        },
        { status: 400 }
      )
    }

    // Successful signup
    return HttpResponse.json({
      ...mockAuthTokens,
      user: {
        ...mockUser,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
      },
    })
  }),

  // Token refresh endpoint
  http.post('*/user/token/refresh/', async ({ request }) => {
    const body = await request.json() as { refresh: string }

    if (body.refresh === 'valid-refresh-token' || body.refresh === mockAuthTokens.refresh) {
      return HttpResponse.json({
        access: 'new-access-token-789',
      })
    }

    // Invalid or expired refresh token
    return HttpResponse.json(
      {
        code: 'INVALID_REFRESH_TOKEN',
        message: 'توکن نامعتبر یا منقضی شده است',
      },
      { status: 401 }
    )
  }),

  // Logout endpoint
  http.post('*/user/logout/', () => {
    return HttpResponse.json({ message: 'خروج موفقیت‌آمیز بود' })
  }),
]
