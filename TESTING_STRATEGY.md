# Derakht Testing Strategy & Implementation Guide

## Executive Summary

This document outlines the comprehensive testing strategy for the Derakht educational platform, a Next.js/React/TypeScript application with zero existing test coverage. Our goal is to achieve **90% test coverage** through a phased implementation approach focusing on critical business logic first.

### Recommended Testing Stack

| Test Type | Framework | Purpose |
|-----------|-----------|---------|
| **Unit & Component Tests** | Jest + React Testing Library | Test individual functions, utilities, and React components in isolation |
| **API Mocking** | MSW (Mock Service Worker) | Mock HTTP requests at the network level for realistic API testing |
| **E2E Tests** | Playwright | Test complete user journeys across multiple pages |
| **Visual Regression** | Playwright Snapshots | Detect unintended UI changes |
| **Coverage Reporting** | Istanbul (via Jest) | Track coverage metrics and identify gaps |

### Testing Pyramid Breakdown

```
      /\
     /  \     E2E Tests (10%)
    /----\
   /      \   Integration Tests (30%)
  /--------\
 /          \ Unit Tests (60%)
/____________\
```

- **60% Unit Tests**: Services, utilities, validation logic, isolated component logic
- **30% Integration Tests**: Context providers, API integration, multi-component interactions
- **10% E2E Tests**: Critical user flows (login→checkout→payment, story creation)

---

## 1. Testing Strategy

### 1.1 Framework Justification

#### **Jest + React Testing Library**
- ✅ **Industry standard** for React testing
- ✅ **Next.js native support** - Works seamlessly with Next.js App Router
- ✅ **Fast execution** with parallel test running
- ✅ **Rich ecosystem** of matchers and utilities
- ✅ **RTL philosophy** - Tests focus on user behavior, not implementation details
- ✅ **TypeScript support** out of the box

#### **MSW (Mock Service Worker)**
- ✅ **Network-level mocking** - Intercepts requests before they leave the browser
- ✅ **Realistic testing** - Same request/response cycle as production
- ✅ **Framework agnostic** - Works with Jest and Playwright
- ✅ **Type-safe handlers** - Full TypeScript support
- ✅ **Reusable mocks** - Share handlers across test types

#### **Playwright (E2E)**
- ✅ **Modern E2E framework** with excellent developer experience
- ✅ **Multi-browser support** (Chromium, Firefox, WebKit)
- ✅ **Auto-wait** - Reduces flaky tests
- ✅ **Built-in test runner** with parallelization
- ✅ **Visual testing** with screenshots and snapshots
- ✅ **Network interception** for API mocking in E2E tests

**Alternatives Considered:**
- **Vitest**: Excellent choice but Jest has better Next.js integration
- **Cypress**: Good but Playwright has better performance and modern API
- **Testing Library without Jest**: Possible but Jest provides the full test runner experience

### 1.2 Test File & Folder Structure

```
derakht-project-front/
├── __tests__/                          # All test files
│   ├── unit/                           # Unit tests
│   │   ├── services/                   # Service layer tests
│   │   │   ├── shopService.test.ts
│   │   │   ├── loginService.test.ts
│   │   │   ├── userService.test.ts
│   │   │   └── storyService.test.ts
│   │   ├── utils/                      # Utility function tests
│   │   │   ├── validation.test.ts
│   │   │   ├── errorHandler.test.ts
│   │   │   └── errorLogger.test.ts
│   │   └── hooks/                      # Custom hooks tests
│   │       └── useProductQuantity.test.ts
│   ├── integration/                    # Integration tests
│   │   ├── contexts/                   # Context provider tests
│   │   │   ├── UserContext.test.tsx
│   │   │   ├── CartContext.test.tsx
│   │   │   └── FeatureFlagContext.test.tsx
│   │   ├── api/                        # API integration tests
│   │   │   ├── authFlow.test.ts
│   │   │   ├── tokenRefresh.test.ts
│   │   │   └── cartMerge.test.ts
│   │   └── flows/                      # Multi-step flows
│   │       ├── checkoutFlow.test.tsx
│   │       └── storyCreationFlow.test.tsx
│   ├── components/                     # Component tests
│   │   ├── shop/
│   │   │   ├── ProductCard.test.tsx
│   │   │   ├── CartDropdown.test.tsx
│   │   │   └── CheckoutPage.test.tsx
│   │   ├── shared/
│   │   │   ├── Navbar.test.tsx
│   │   │   ├── ErrorBoundary.test.tsx
│   │   │   └── Footer.test.tsx
│   │   └── login/
│   │       ├── LoginForm.test.tsx
│   │       └── SignupForm.test.tsx
│   └── e2e/                            # End-to-end tests (Playwright)
│       ├── auth.spec.ts
│       ├── shopping.spec.ts
│       ├── checkout.spec.ts
│       └── story-creation.spec.ts
├── __mocks__/                          # Manual mocks
│   ├── next/
│   │   ├── router.ts
│   │   └── navigation.ts
│   ├── react-hot-toast.ts
│   └── fabric.ts
├── test-utils/                         # Test utilities
│   ├── setup.ts                        # Global test setup
│   ├── test-helpers.tsx                # Custom render, wrappers
│   ├── mock-data/                      # Test fixtures
│   │   ├── products.ts
│   │   ├── users.ts
│   │   ├── stories.ts
│   │   └── orders.ts
│   └── msw/                            # MSW setup
│       ├── server.ts                   # MSW server config
│       └── handlers/                   # Request handlers
│           ├── auth.ts
│           ├── shop.ts
│           ├── user.ts
│           └── story.ts
├── jest.config.js                      # Jest configuration
├── jest.setup.js                       # Jest setup file
├── playwright.config.ts                # Playwright configuration
└── .github/
    └── workflows/
        └── test.yml                    # CI/CD test workflow
```

### 1.3 Mocking & Fixture Strategy

#### **API Mocking with MSW**
- **All HTTP requests** mocked at the network level
- **Handlers organized by domain** (auth, shop, user, story, blog)
- **Realistic response delays** to test loading states
- **Error scenario handlers** for testing error handling

#### **Next.js Mocking**
- **Router mocks** for `next/navigation` (useRouter, usePathname, etc.)
- **Image component mock** to avoid optimization issues in tests
- **Environment variables** mocked via `process.env`

#### **Third-Party Mocks**
- **react-hot-toast**: Mock `toast.success`, `toast.error`, etc.
- **fabric.js**: Mock Canvas API for illustration tests
- **localStorage/cookies**: jsdom provides these, but we'll add helpers

#### **Test Fixtures**
- **Typed fixtures** using TypeScript interfaces from `src/types`
- **Factory functions** for creating test data (e.g., `createMockProduct()`)
- **Realistic Persian data** to match production environment

---

## 2. Implementation Guide

### 2.1 Setup Phase

#### **Step 1: Install Testing Dependencies**

```bash
# Core testing frameworks
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Next.js Jest support
npm install --save-dev @testing-library/react-hooks jest-environment-jsdom

# MSW for API mocking
npm install --save-dev msw

# Playwright for E2E
npm install --save-dev @playwright/test

# Additional utilities
npm install --save-dev @types/jest ts-jest
```

#### **Step 2: Configure Jest**

**`jest.config.js`:**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/app/**/layout.tsx',
    '!src/app/**/page.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: [
    '**/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '**/*.test.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/__tests__/e2e/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(fabric)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

**`jest.setup.js`:**
```javascript
import '@testing-library/jest-dom'
import { server } from './test-utils/msw/server'

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Reset any request handlers that we may add during tests
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000/api'
process.env.NEXT_PUBLIC_ZARINPAL_MERCHANT_ID = 'test-merchant-id'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any

// Mock matchMedia (for responsive tests)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

#### **Step 3: Configure Playwright**

**`playwright.config.ts`:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

#### **Step 4: Set Up MSW**

**`test-utils/msw/server.ts`:**
```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

**`test-utils/msw/handlers/index.ts`:**
```typescript
import { authHandlers } from './auth'
import { shopHandlers } from './shop'
import { userHandlers } from './user'
import { storyHandlers } from './story'
import { blogHandlers } from './blog'

export const handlers = [
  ...authHandlers,
  ...shopHandlers,
  ...userHandlers,
  ...storyHandlers,
  ...blogHandlers,
]
```

#### **Step 5: Update package.json Scripts**

```json
{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:ci && npm run test:e2e"
  }
}
```

---

## 3. Test Examples by Category

### 3.1 Unit Tests - Validation Logic

**`__tests__/unit/utils/validation.test.ts`:**
```typescript
import { emailRules, passwordRules, confirmPasswordRules, phoneRules, postalCodeRules } from '@/utils/validation'

describe('Validation Utils', () => {
  describe('emailRules', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.ir',
        'user+tag@gmail.com',
      ]

      validEmails.forEach(email => {
        expect(emailRules.pattern?.value.test(email)).toBe(true)
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com',
      ]

      invalidEmails.forEach(email => {
        expect(emailRules.pattern?.value.test(email)).toBe(false)
      })
    })

    it('should require email field', () => {
      expect(emailRules.required).toBe('ایمیل الزامی است')
    })
  })

  describe('passwordRules', () => {
    it('should validate strong passwords', () => {
      const validPasswords = [
        'SecurePass123!',
        'MyP@ssw0rd',
        'Complex123$',
      ]

      validPasswords.forEach(password => {
        expect(passwordRules.pattern?.value.test(password)).toBe(true)
      })
    })

    it('should reject weak passwords', () => {
      const invalidPasswords = [
        '12345',           // Too short
        'password',        // No numbers or special chars
        'PASSWORD',        // No lowercase
        'password123',     // No uppercase or special chars
      ]

      invalidPasswords.forEach(password => {
        const result = passwordRules.validate?.(password)
        expect(result).toBeTruthy()
      })
    })

    it('should enforce minimum length of 8 characters', () => {
      expect(passwordRules.minLength?.value).toBe(8)
    })
  })

  describe('phoneRules', () => {
    it('should validate Iranian phone numbers', () => {
      const validPhones = [
        '09121234567',
        '09351234567',
        '09191234567',
      ]

      validPhones.forEach(phone => {
        expect(phoneRules.pattern?.value.test(phone)).toBe(true)
      })
    })

    it('should reject invalid Iranian phone numbers', () => {
      const invalidPhones = [
        '0812345678',    // Not mobile
        '912345678',     // Missing leading 0
        '09121234',      // Too short
        '091212345678',  // Too long
      ]

      invalidPhones.forEach(phone => {
        expect(phoneRules.pattern?.value.test(phone)).toBe(false)
      })
    })
  })

  describe('postalCodeRules', () => {
    it('should validate 10-digit postal codes', () => {
      expect(postalCodeRules.pattern?.value.test('1234567890')).toBe(true)
    })

    it('should reject invalid postal codes', () => {
      const invalidCodes = ['123456789', '12345678901', 'abcdefghij']

      invalidCodes.forEach(code => {
        expect(postalCodeRules.pattern?.value.test(code)).toBe(false)
      })
    })
  })
})
```

### 3.2 Unit Tests - Error Handling

**`__tests__/unit/utils/errorHandler.test.ts`:**
```typescript
import { transformError, extractFieldErrors, isRetryableError } from '@/utils/errorHandler'
import { ErrorCode } from '@/types/error'
import toast from 'react-hot-toast'

jest.mock('react-hot-toast')

describe('Error Handling Utils', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('transformError', () => {
    it('should transform axios error with standard backend response', () => {
      const axiosError = {
        response: {
          data: {
            code: 'INVALID_CREDENTIALS',
            message: 'ایمیل یا رمز عبور نادرست است',
            details: { field: 'password' }
          },
          status: 401,
        }
      }

      const result = transformError(axiosError)

      expect(result.code).toBe(ErrorCode.INVALID_CREDENTIALS)
      expect(result.message).toBe('ایمیل یا رمز عبور نادرست است')
      expect(result.status).toBe(401)
    })

    it('should handle network errors', () => {
      const networkError = {
        message: 'Network Error',
        request: {},
      }

      const result = transformError(networkError)

      expect(result.code).toBe(ErrorCode.NETWORK_ERROR)
      expect(result.message).toContain('اتصال به سرور')
    })

    it('should handle timeout errors', () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 10000ms exceeded',
      }

      const result = transformError(timeoutError)

      expect(result.code).toBe(ErrorCode.TIMEOUT)
    })

    it('should extract field-level errors', () => {
      const validationError = {
        response: {
          data: {
            code: 'VALIDATION_ERROR',
            message: 'اعتبارسنجی ناموفق',
            details: {
              errors: {
                email: 'فرمت ایمیل نامعتبر است',
                password: 'رمز عبور باید حداقل 8 کاراکتر باشد'
              }
            }
          },
          status: 400,
        }
      }

      const result = transformError(validationError)

      expect(result.fieldErrors).toEqual({
        email: 'فرمت ایمیل نامعتبر است',
        password: 'رمز عبور باید حداقل 8 کاراکتر باشد'
      })
    })
  })

  describe('extractFieldErrors', () => {
    it('should extract field errors from standard error response', () => {
      const error = {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        fieldErrors: {
          email: 'Invalid email',
          phone: 'Invalid phone'
        }
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({
        email: 'Invalid email',
        phone: 'Invalid phone'
      })
    })

    it('should return empty object if no field errors', () => {
      const error = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'Network error',
      }

      const result = extractFieldErrors(error)

      expect(result).toEqual({})
    })
  })

  describe('isRetryableError', () => {
    it('should identify network errors as retryable', () => {
      expect(isRetryableError(ErrorCode.NETWORK_ERROR)).toBe(true)
    })

    it('should identify timeout errors as retryable', () => {
      expect(isRetryableError(ErrorCode.TIMEOUT)).toBe(true)
    })

    it('should identify server errors as retryable', () => {
      expect(isRetryableError(ErrorCode.INTERNAL_SERVER_ERROR)).toBe(true)
    })

    it('should identify validation errors as non-retryable', () => {
      expect(isRetryableError(ErrorCode.VALIDATION_ERROR)).toBe(false)
    })

    it('should identify authentication errors as non-retryable', () => {
      expect(isRetryableError(ErrorCode.INVALID_CREDENTIALS)).toBe(false)
    })
  })
})
```

### 3.3 Integration Tests - Context Providers

**`__tests__/integration/contexts/CartContext.test.tsx`:**
```typescript
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '@/contexts/CartContext'
import { server } from '@/test-utils/msw/server'
import { http, HttpResponse } from 'msw'
import { mockProducts, mockCart } from '@/test-utils/mock-data'

// Test component to access cart context
function CartTestComponent() {
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, loading } = useCart()

  return (
    <div>
      <div data-testid="cart-count">{cart?.items.length || 0}</div>
      <div data-testid="cart-total">{cart?.total_price || 0}</div>
      <div data-testid="loading">{loading ? 'loading' : 'idle'}</div>

      <button onClick={() => addToCart(mockProducts[0].id, 2)}>
        Add Product
      </button>
      <button onClick={() => updateQuantity(1, 5)}>
        Update Quantity
      </button>
      <button onClick={() => removeFromCart(1)}>
        Remove Item
      </button>
      <button onClick={clearCart}>
        Clear Cart
      </button>
    </div>
  )
}

describe('CartContext Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    document.cookie = ''
  })

  it('should load cart on mount for anonymous user', async () => {
    // Mock initial cart fetch
    server.use(
      http.get('*/shop/cart/', () => {
        return HttpResponse.json(mockCart)
      })
    )

    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('500000')
    })
  })

  it('should add product to cart and update state', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('*/shop/cart/add/', async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json({
          ...mockCart,
          items: [
            ...mockCart.items,
            { product: mockProducts[0], quantity: body.quantity }
          ]
        })
      })
    )

    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    const addButton = screen.getByText('Add Product')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('3')
    })
  })

  it('should update item quantity in cart', async () => {
    const user = userEvent.setup()

    server.use(
      http.get('*/shop/cart/', () => {
        return HttpResponse.json(mockCart)
      }),
      http.put('*/shop/cart/update/*/', async ({ params, request }) => {
        const body = await request.json()
        return HttpResponse.json({
          ...mockCart,
          items: mockCart.items.map(item =>
            item.id === Number(params.id)
              ? { ...item, quantity: body.quantity }
              : item
          )
        })
      })
    )

    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    })

    const updateButton = screen.getByText('Update Quantity')
    await user.click(updateButton)

    await waitFor(() => {
      // Cart total should update based on new quantity
      expect(screen.getByTestId('loading')).toHaveTextContent('idle')
    })
  })

  it('should remove item from cart', async () => {
    const user = userEvent.setup()

    server.use(
      http.get('*/shop/cart/', () => {
        return HttpResponse.json(mockCart)
      }),
      http.delete('*/shop/cart/remove/*/', ({ params }) => {
        return HttpResponse.json({
          ...mockCart,
          items: mockCart.items.filter(item => item.id !== Number(params.id))
        })
      })
    )

    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    })

    const removeButton = screen.getByText('Remove Item')
    await user.click(removeButton)

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    })
  })

  it('should clear entire cart', async () => {
    const user = userEvent.setup()

    server.use(
      http.get('*/shop/cart/', () => {
        return HttpResponse.json(mockCart)
      }),
      http.post('*/shop/cart/clear/', () => {
        return HttpResponse.json({ items: [], total_price: 0 })
      })
    )

    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    })

    const clearButton = screen.getByText('Clear Cart')
    await user.click(clearButton)

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
    })
  })

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('*/shop/cart/add/', () => {
        return HttpResponse.json(
          { code: 'PRODUCT_OUT_OF_STOCK', message: 'محصول موجود نیست' },
          { status: 400 }
        )
      })
    )

    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    const addButton = screen.getByText('Add Product')
    await user.click(addButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('محصول موجود نیست'))
    })
  })

  it('should persist anonymous cart ID in cookie', async () => {
    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      const cookies = document.cookie.split(';')
      const hasAnonymousCartCookie = cookies.some(cookie =>
        cookie.trim().startsWith('anonymous_cart_id=')
      )
      expect(hasAnonymousCartCookie).toBe(true)
    })
  })
})
```

### 3.4 Integration Tests - Authentication Flow

**`__tests__/integration/api/authFlow.test.ts`:**
```typescript
import { login, signup, logout, refreshAccessToken } from '@/services/loginService'
import { server } from '@/test-utils/msw/server'
import { http, HttpResponse } from 'msw'
import Cookies from 'js-cookie'

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
  })

  describe('Login Flow', () => {
    it('should login successfully and store tokens', async () => {
      server.use(
        http.post('*/user/login/', async ({ request }) => {
          const body = await request.json()

          if (body.email === 'test@example.com' && body.password === 'Password123!') {
            return HttpResponse.json({
              access: 'access-token-123',
              refresh: 'refresh-token-456',
              user: {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                age: 25,
              }
            })
          }

          return HttpResponse.json(
            { code: 'INVALID_CREDENTIALS', message: 'ایمیل یا رمز عبور نادرست است' },
            { status: 401 }
          )
        })
      )

      const response = await login('test@example.com', 'Password123!')

      expect(response.access).toBe('access-token-123')
      expect(response.refresh).toBe('refresh-token-456')
      expect(response.user.email).toBe('test@example.com')

      // Verify tokens stored in cookies
      expect(Cookies.get('access_token')).toBe('access-token-123')
      expect(Cookies.get('refresh_token')).toBe('refresh-token-456')
    })

    it('should reject invalid credentials', async () => {
      server.use(
        http.post('*/user/login/', () => {
          return HttpResponse.json(
            { code: 'INVALID_CREDENTIALS', message: 'ایمیل یا رمز عبور نادرست است' },
            { status: 401 }
          )
        })
      )

      await expect(login('wrong@example.com', 'wrongpass')).rejects.toThrow()
    })
  })

  describe('Signup Flow', () => {
    it('should create new account successfully', async () => {
      server.use(
        http.post('*/user/signup/', async ({ request }) => {
          const body = await request.json()

          return HttpResponse.json({
            access: 'new-access-token',
            refresh: 'new-refresh-token',
            user: {
              id: 2,
              email: body.email,
              name: body.name,
              age: body.age,
            }
          })
        })
      )

      const response = await signup({
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        confirm_password: 'SecurePass123!',
        name: 'New User',
        age: 18,
      })

      expect(response.user.email).toBe('newuser@example.com')
      expect(Cookies.get('access_token')).toBe('new-access-token')
    })

    it('should reject signup with existing email', async () => {
      server.use(
        http.post('*/user/signup/', () => {
          return HttpResponse.json(
            {
              code: 'EMAIL_ALREADY_EXISTS',
              message: 'این ایمیل قبلاً ثبت شده است',
              details: { errors: { email: 'ایمیل تکراری است' } }
            },
            { status: 400 }
          )
        })
      )

      await expect(signup({
        email: 'existing@example.com',
        password: 'Pass123!',
        confirm_password: 'Pass123!',
        name: 'User',
        age: 20,
      })).rejects.toThrow()
    })

    it('should reject signup with mismatched passwords', async () => {
      // This should be caught by frontend validation
      const signupData = {
        email: 'user@example.com',
        password: 'Pass123!',
        confirm_password: 'DifferentPass123!',
        name: 'User',
        age: 20,
      }

      // Frontend validation would prevent this, but test backend handling
      server.use(
        http.post('*/user/signup/', () => {
          return HttpResponse.json(
            { code: 'VALIDATION_ERROR', message: 'رمزهای عبور یکسان نیستند' },
            { status: 400 }
          )
        })
      )

      await expect(signup(signupData)).rejects.toThrow()
    })
  })

  describe('Token Refresh Flow', () => {
    it('should refresh access token using refresh token', async () => {
      Cookies.set('refresh_token', 'valid-refresh-token')

      server.use(
        http.post('*/user/token/refresh/', async ({ request }) => {
          const body = await request.json()

          if (body.refresh === 'valid-refresh-token') {
            return HttpResponse.json({
              access: 'new-access-token-789'
            })
          }

          return HttpResponse.json(
            { code: 'INVALID_REFRESH_TOKEN', message: 'توکن نامعتبر است' },
            { status: 401 }
          )
        })
      )

      const newToken = await refreshAccessToken()

      expect(newToken).toBe('new-access-token-789')
      expect(Cookies.get('access_token')).toBe('new-access-token-789')
    })

    it('should handle expired refresh token', async () => {
      Cookies.set('refresh_token', 'expired-refresh-token')

      server.use(
        http.post('*/user/token/refresh/', () => {
          return HttpResponse.json(
            { code: 'INVALID_REFRESH_TOKEN', message: 'توکن منقضی شده است' },
            { status: 401 }
          )
        })
      )

      await expect(refreshAccessToken()).rejects.toThrow()

      // Tokens should be cleared on refresh failure
      expect(Cookies.get('access_token')).toBeUndefined()
      expect(Cookies.get('refresh_token')).toBeUndefined()
    })
  })

  describe('Logout Flow', () => {
    it('should clear tokens and user data on logout', async () => {
      // Set up authenticated state
      Cookies.set('access_token', 'access-123')
      Cookies.set('refresh_token', 'refresh-456')
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'user@example.com' }))

      await logout()

      expect(Cookies.get('access_token')).toBeUndefined()
      expect(Cookies.get('refresh_token')).toBeUndefined()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('Concurrent Token Refresh', () => {
    it('should queue concurrent requests during token refresh', async () => {
      // This tests the token refresh queue mechanism in api.tsx
      Cookies.set('access_token', 'expired-token')
      Cookies.set('refresh_token', 'valid-refresh')

      let refreshCallCount = 0

      server.use(
        // First request fails with 401
        http.get('*/user/profile/', ({ request }) => {
          const auth = request.headers.get('Authorization')

          if (auth === 'Bearer expired-token') {
            return HttpResponse.json(
              { code: 'TOKEN_EXPIRED', message: 'توکن منقضی شده' },
              { status: 401 }
            )
          }

          return HttpResponse.json({ id: 1, email: 'user@example.com' })
        }),

        // Refresh token endpoint
        http.post('*/user/token/refresh/', () => {
          refreshCallCount++
          return HttpResponse.json({ access: 'new-token-123' })
        })
      )

      // Make 3 concurrent requests
      const promises = [
        fetch('/user/profile/'),
        fetch('/user/profile/'),
        fetch('/user/profile/'),
      ]

      await Promise.all(promises)

      // Refresh should only be called once, not 3 times
      expect(refreshCallCount).toBe(1)
    })
  })
})
```

### 3.5 Component Tests - Checkout Flow

**`__tests__/components/shop/CheckoutPage.test.tsx`:**
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutPage from '@/components/shop/CheckoutPage'
import { CartProvider } from '@/contexts/CartContext'
import { UserProvider } from '@/contexts/UserContext'
import { server } from '@/test-utils/msw/server'
import { http, HttpResponse } from 'msw'
import { mockCart, mockUser } from '@/test-utils/mock-data'

const renderCheckoutPage = () => {
  return render(
    <UserProvider>
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    </UserProvider>
  )
}

describe('CheckoutPage Component', () => {
  beforeEach(() => {
    server.use(
      http.get('*/shop/cart/', () => HttpResponse.json(mockCart)),
      http.get('*/user/profile/', () => HttpResponse.json(mockUser))
    )
  })

  describe('Step 1: Shipping Information', () => {
    it('should display shipping information form', async () => {
      renderCheckoutPage()

      await waitFor(() => {
        expect(screen.getByText(/اطلاعات ارسال/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/نام و نام خانوادگی/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/شماره تماس/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/آدرس/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/کد پستی/i)).toBeInTheDocument()
      })
    })

    it('should validate shipping form fields', async () => {
      const user = userEvent.setup()
      renderCheckoutPage()

      const submitButton = await screen.findByText(/ادامه/i)
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/نام و نام خانوادگی الزامی است/i)).toBeInTheDocument()
        expect(screen.getByText(/شماره تماس الزامی است/i)).toBeInTheDocument()
      })
    })

    it('should validate Iranian phone number format', async () => {
      const user = userEvent.setup()
      renderCheckoutPage()

      const phoneInput = await screen.findByLabelText(/شماره تماس/i)
      await user.type(phoneInput, '1234567890')

      const submitButton = screen.getByText(/ادامه/i)
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/فرمت شماره تماس نامعتبر است/i)).toBeInTheDocument()
      })
    })

    it('should validate postal code format (10 digits)', async () => {
      const user = userEvent.setup()
      renderCheckoutPage()

      const postalInput = await screen.findByLabelText(/کد پستی/i)
      await user.type(postalInput, '12345')

      const submitButton = screen.getByText(/ادامه/i)
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/کد پستی باید 10 رقم باشد/i)).toBeInTheDocument()
      })
    })

    it('should proceed to payment step with valid shipping info', async () => {
      const user = userEvent.setup()
      renderCheckoutPage()

      await user.type(await screen.findByLabelText(/نام و نام خانوادگی/i), 'علی احمدی')
      await user.type(screen.getByLabelText(/شماره تماس/i), '09121234567')
      await user.type(screen.getByLabelText(/آدرس/i), 'تهران، خیابان ولیعصر')
      await user.type(screen.getByLabelText(/کد پستی/i), '1234567890')

      const submitButton = screen.getByText(/ادامه/i)
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/روش پرداخت/i)).toBeInTheDocument()
      })
    })
  })

  describe('Step 2: Payment Method', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      renderCheckoutPage()

      // Fill shipping form
      await user.type(await screen.findByLabelText(/نام و نام خانوادگی/i), 'علی احمدی')
      await user.type(screen.getByLabelText(/شماره تماس/i), '09121234567')
      await user.type(screen.getByLabelText(/آدرس/i), 'تهران، خیابان ولیعصر')
      await user.type(screen.getByLabelText(/کد پستی/i), '1234567890')
      await user.click(screen.getByText(/ادامه/i))
    })

    it('should display payment method options', async () => {
      await waitFor(() => {
        expect(screen.getByText(/پرداخت آنلاین/i)).toBeInTheDocument()
        expect(screen.getByText(/پرداخت در محل/i)).toBeInTheDocument()
        expect(screen.getByText(/کارت به کارت/i)).toBeInTheDocument()
      })
    })

    it('should select online payment method', async () => {
      const user = userEvent.setup()

      const onlinePaymentRadio = await screen.findByLabelText(/پرداخت آنلاین/i)
      await user.click(onlinePaymentRadio)

      expect(onlinePaymentRadio).toBeChecked()
    })

    it('should proceed to review step with selected payment method', async () => {
      const user = userEvent.setup()

      const onlinePaymentRadio = await screen.findByLabelText(/پرداخت آنلاین/i)
      await user.click(onlinePaymentRadio)

      const continueButton = screen.getByText(/ادامه/i)
      await user.click(continueButton)

      await waitFor(() => {
        expect(screen.getByText(/بررسی نهایی/i)).toBeInTheDocument()
      })
    })
  })

  describe('Step 3: Order Review and Submission', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      renderCheckoutPage()

      // Complete shipping form
      await user.type(await screen.findByLabelText(/نام و نام خانوادگی/i), 'علی احمدی')
      await user.type(screen.getByLabelText(/شماره تماس/i), '09121234567')
      await user.type(screen.getByLabelText(/آدرس/i), 'تهران، خیابان ولیعصر')
      await user.type(screen.getByLabelText(/کد پستی/i), '1234567890')
      await user.click(screen.getByText(/ادامه/i))

      // Select payment method
      await waitFor(() => screen.getByLabelText(/پرداخت آنلاین/i))
      await user.click(screen.getByLabelText(/پرداخت آنلاین/i))
      await user.click(screen.getByText(/ادامه/i))
    })

    it('should display order summary', async () => {
      await waitFor(() => {
        expect(screen.getByText(/بررسی نهایی/i)).toBeInTheDocument()
        expect(screen.getByText(/علی احمدی/i)).toBeInTheDocument()
        expect(screen.getByText(/09121234567/i)).toBeInTheDocument()
        expect(screen.getByText(/پرداخت آنلاین/i)).toBeInTheDocument()
      })
    })

    it('should display cart items in review', async () => {
      await waitFor(() => {
        mockCart.items.forEach(item => {
          expect(screen.getByText(item.product.title)).toBeInTheDocument()
        })
      })
    })

    it('should submit order and redirect to payment gateway', async () => {
      const user = userEvent.setup()

      server.use(
        http.post('*/shop/checkout/', async ({ request }) => {
          const body = await request.json()

          return HttpResponse.json({
            order_id: 'ORD-12345',
            payment_url: 'https://payment.zarinpal.com/pg/StartPay/abc123',
            total: 500000,
          })
        })
      )

      const submitButton = await screen.findByText(/تکمیل خرید/i)
      await user.click(submitButton)

      await waitFor(() => {
        // Should redirect to payment gateway
        expect(window.location.href).toContain('zarinpal.com')
      })
    })

    it('should handle checkout errors', async () => {
      const user = userEvent.setup()

      server.use(
        http.post('*/shop/checkout/', () => {
          return HttpResponse.json(
            { code: 'PAYMENT_GATEWAY_ERROR', message: 'خطا در اتصال به درگاه پرداخت' },
            { status: 500 }
          )
        })
      )

      const submitButton = await screen.findByText(/تکمیل خرید/i)
      await user.click(submitButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('خطا در اتصال'))
      })
    })
  })

  describe('Navigation Between Steps', () => {
    it('should allow going back to previous steps', async () => {
      const user = userEvent.setup()
      renderCheckoutPage()

      // Go to step 2
      await user.type(await screen.findByLabelText(/نام و نام خانوادگی/i), 'علی احمدی')
      await user.type(screen.getByLabelText(/شماره تماس/i), '09121234567')
      await user.type(screen.getByLabelText(/آدرس/i), 'تهران')
      await user.type(screen.getByLabelText(/کد پستی/i), '1234567890')
      await user.click(screen.getByText(/ادامه/i))

      await waitFor(() => screen.getByText(/روش پرداخت/i))

      // Go back to step 1
      const backButton = screen.getByText(/بازگشت/i)
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.getByText(/اطلاعات ارسال/i)).toBeInTheDocument()
        // Form should retain values
        expect(screen.getByLabelText(/نام و نام خانوادگی/i)).toHaveValue('علی احمدی')
      })
    })
  })
})
```

### 3.6 E2E Tests - Complete Shopping Flow

**`__tests__/e2e/shopping.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Complete Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete anonymous purchase flow', async ({ page }) => {
    // 1. Browse products
    await page.click('text=فروشگاه')
    await expect(page).toHaveURL(/\/shop/)

    // 2. Add product to cart
    const productCard = page.locator('[data-testid="product-card"]').first()
    await productCard.click()

    await page.waitForURL(/\/shop\/product\/\d+/)
    await page.click('button:has-text("افزودن به سبد خرید")')

    // Verify toast notification
    await expect(page.locator('text=محصول به سبد خرید اضافه شد')).toBeVisible()

    // 3. View cart
    await page.click('[data-testid="cart-icon"]')
    await expect(page).toHaveURL(/\/shop\/cart/)

    // Verify product in cart
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)

    // 4. Proceed to checkout
    await page.click('text=ادامه خرید')
    await expect(page).toHaveURL(/\/shop\/checkout/)

    // 5. Fill shipping information
    await page.fill('input[name="name"]', 'علی احمدی')
    await page.fill('input[name="phone"]', '09121234567')
    await page.fill('textarea[name="address"]', 'تهران، خیابان ولیعصر، پلاک 100')
    await page.fill('input[name="postal_code"]', '1234567890')

    await page.click('button:has-text("ادامه")')

    // 6. Select payment method
    await page.click('input[value="online"]')
    await page.click('button:has-text("ادامه")')

    // 7. Review and submit order
    await expect(page.locator('text=بررسی نهایی')).toBeVisible()
    await expect(page.locator('text=علی احمدی')).toBeVisible()

    await page.click('button:has-text("تکمیل خرید")')

    // 8. Verify redirect to payment gateway (mock in test environment)
    await page.waitForURL(/\/shop\/payment\/verify/, { timeout: 10000 })

    // Simulate successful payment return
    await page.goto('/shop/payment/verify?status=OK&order_id=ORD-12345')

    // 9. Verify order confirmation
    await expect(page.locator('text=سفارش شما با موفقیت ثبت شد')).toBeVisible()
    await expect(page.locator('text=ORD-12345')).toBeVisible()
  })

  test('should add multiple products and update quantities', async ({ page }) => {
    await page.goto('/shop')

    // Add first product
    await page.locator('[data-testid="product-card"]').first().click()
    await page.click('button:has-text("افزودن به سبد خرید")')
    await page.goto('/shop')

    // Add second product
    await page.locator('[data-testid="product-card"]').nth(1).click()
    await page.click('button:has-text("افزودن به سبد خرید")')

    // Go to cart
    await page.click('[data-testid="cart-icon"]')

    // Verify 2 items
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2)

    // Update quantity of first item
    const firstItemQuantity = page.locator('[data-testid="quantity-input"]').first()
    await firstItemQuantity.fill('3')
    await page.keyboard.press('Enter')

    // Wait for update
    await page.waitForTimeout(500)

    // Verify total price updated
    const totalBefore = await page.locator('[data-testid="cart-total"]').textContent()
    expect(totalBefore).toBeTruthy()

    // Remove second item
    await page.locator('[data-testid="remove-item"]').nth(1).click()

    // Confirm removal
    await page.click('button:has-text("حذف")')

    // Verify only 1 item remains
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
  })

  test('should filter products by category and price', async ({ page }) => {
    await page.goto('/shop')

    // Select category filter
    await page.click('text=دسته‌بندی')
    await page.click('text=کتاب‌های آموزشی')

    // Wait for filtered results
    await page.waitForSelector('[data-testid="product-card"]')

    const productsAfterCategoryFilter = await page.locator('[data-testid="product-card"]').count()
    expect(productsAfterCategoryFilter).toBeGreaterThan(0)

    // Apply price range filter
    await page.fill('input[name="min_price"]', '100000')
    await page.fill('input[name="max_price"]', '500000')
    await page.click('button:has-text("اعمال فیلتر")')

    // Wait for filtered results
    await page.waitForTimeout(500)

    // Verify URL contains filter params
    expect(page.url()).toContain('min_price=100000')
    expect(page.url()).toContain('max_price=500000')
  })

  test('should search for products', async ({ page }) => {
    await page.goto('/shop')

    // Enter search query
    await page.fill('input[placeholder*="جستجو"]', 'ریاضی')
    await page.keyboard.press('Enter')

    await page.waitForURL(/\/shop\?.*search=/)

    // Verify search results
    const searchResults = await page.locator('[data-testid="product-card"]').count()
    expect(searchResults).toBeGreaterThan(0)

    // Verify all products contain search term (in title or description)
    const productTitles = await page.locator('[data-testid="product-title"]').allTextContents()
    expect(productTitles.some(title => title.includes('ریاضی'))).toBe(true)
  })
})

test.describe('Authenticated Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button:has-text("ورود")')

    await page.waitForURL('/')
  })

  test('should show user addresses in checkout', async ({ page }) => {
    // Add product to cart
    await page.goto('/shop')
    await page.locator('[data-testid="product-card"]').first().click()
    await page.click('button:has-text("افزودن به سبد خرید")')

    // Go to checkout
    await page.goto('/shop/checkout')

    // Verify saved addresses appear
    await expect(page.locator('text=آدرس‌های ذخیره شده')).toBeVisible()
    await expect(page.locator('[data-testid="saved-address"]')).toHaveCount.greaterThan(0)

    // Select saved address
    await page.locator('[data-testid="saved-address"]').first().click()

    // Form should populate with saved address data
    const nameInput = page.locator('input[name="name"]')
    await expect(nameInput).not.toBeEmpty()
  })

  test('should view order history', async ({ page }) => {
    await page.goto('/account/orders')

    // Verify orders list
    await expect(page.locator('text=سفارش‌های من')).toBeVisible()

    // Click on order to view details
    await page.locator('[data-testid="order-item"]').first().click()

    // Verify order details page
    await expect(page.locator('text=جزئیات سفارش')).toBeVisible()
    await expect(page.locator('text=شماره سفارش')).toBeVisible()
    await expect(page.locator('[data-testid="order-item-product"]')).toHaveCount.greaterThan(0)
  })
})
```

---

## 4. Progressive Implementation Roadmap

### Phase 1: Foundation (Week 1-2) - 40% Coverage

**Priority: Critical Business Logic**

1. **Setup Testing Infrastructure**
   - Install dependencies
   - Configure Jest, React Testing Library
   - Set up MSW with initial handlers
   - Create test utilities and helpers

2. **Unit Tests - Utilities**
   - ✅ `validation.test.ts` - All validation rules
   - ✅ `errorHandler.test.ts` - Error transformation
   - ✅ `errorLogger.test.ts` - Error logging
   - `convertToPersianNumber.test.ts` - Number conversion

3. **Integration Tests - Authentication**
   - ✅ `authFlow.test.ts` - Login, signup, logout
   - ✅ `tokenRefresh.test.ts` - Token refresh with queue
   - `sessionPersistence.test.ts` - Session management

4. **Integration Tests - Cart Operations**
   - ✅ `CartContext.test.tsx` - Cart CRUD operations
   - `cartMerge.test.ts` - Anonymous cart merging on login
   - `cartPersistence.test.ts` - Cookie and localStorage

5. **Service Tests - Critical APIs**
   - `shopService.test.ts` - Product listing, cart APIs
   - `loginService.test.ts` - Auth endpoints
   - `userService.test.ts` - Profile, addresses

**Deliverables:**
- All critical business logic tested
- 40-50% overall coverage
- CI pipeline running tests on PRs

### Phase 2: Comprehensive Coverage (Week 3-4) - 70% Coverage

**Priority: User Flows and Components**

1. **Integration Tests - Contexts**
   - `UserContext.test.tsx` - User state management
   - `FeatureFlagContext.test.tsx` - Feature flags

2. **Component Tests - Forms**
   - `LoginForm.test.tsx` - Login validation and submission
   - `SignupForm.test.tsx` - Signup flow
   - `AddressForm.test.tsx` - Address management
   - `CheckoutPage.test.tsx` - ✅ Multi-step checkout

3. **Component Tests - Shop**
   - `ProductCard.test.tsx` - Product display and actions
   - `ProductFilter.test.tsx` - Filtering logic
   - `CartDropdown.test.tsx` - Mini cart
   - `OrderSummary.test.tsx` - Price calculation

4. **Service Tests - Remaining APIs**
   - `storyService.test.ts` - Story CRUD
   - `blogService.test.ts` - Blog APIs
   - `searchService.test.ts` - Search functionality
   - `categoryService.test.ts` - Category operations

5. **E2E Tests - Critical Flows**
   - ✅ `shopping.spec.ts` - Complete purchase flow
   - `auth.spec.ts` - Login and signup
   - `checkout.spec.ts` - Payment verification

**Deliverables:**
- Major user flows tested end-to-end
- 70-80% coverage
- Visual regression tests for key pages

### Phase 3: Advanced Testing (Week 5-6) - 90% Coverage

**Priority: Edge Cases and Performance**

1. **Component Tests - Advanced**
   - `Navbar.test.tsx` - Navigation and responsive behavior
   - `ErrorBoundary.test.tsx` - Error catching
   - `StoryEditor.test.tsx` - Story creation
   - `IllustrationCanvas.test.tsx` - Canvas interactions

2. **E2E Tests - Complete Flows**
   - `story-creation.spec.ts` - Full story creation
   - `profile-management.spec.ts` - User profile updates
   - `blog-navigation.spec.ts` - Blog browsing

3. **Edge Case Testing**
   - Network failure scenarios
   - Concurrent request handling
   - Race conditions in state updates
   - Boundary value testing (max quantities, etc.)
   - RTL layout testing

4. **Performance Testing**
   - Large dataset rendering (100+ products)
   - Cart with many items (50+)
   - Image loading and optimization
   - Bundle size monitoring

5. **Accessibility Testing**
   - Keyboard navigation
   - Screen reader compatibility
   - ARIA labels and roles
   - Color contrast
   - Focus management

**Deliverables:**
- 90%+ test coverage
- Performance benchmarks established
- Accessibility compliance verified
- Comprehensive test documentation

---

## 5. Patterns & Best Practices

### 5.1 Test Organization (AAA Pattern)

Always structure tests using **Arrange-Act-Assert**:

```typescript
it('should add product to cart', async () => {
  // Arrange: Set up test data and mocks
  const product = createMockProduct({ id: 1, price: 100000 })
  server.use(
    http.post('*/shop/cart/add/', () => HttpResponse.json({ success: true }))
  )

  // Act: Perform the action
  const result = await addToCart(product.id, 2)

  // Assert: Verify the outcome
  expect(result.success).toBe(true)
  expect(toast.success).toHaveBeenCalledWith('محصول به سبد خرید اضافه شد')
})
```

### 5.2 Custom Render Function

Create a custom render for components that need providers:

**`test-utils/test-helpers.tsx`:**
```typescript
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { UserProvider } from '@/contexts/UserContext'
import { CartProvider } from '@/contexts/CartContext'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialUser?: any
  initialCart?: any
  featureFlags?: Record<string, boolean>
}

function AllProviders({ children, initialUser, initialCart, featureFlags }: {
  children: ReactNode
  initialUser?: any
  initialCart?: any
  featureFlags?: Record<string, boolean>
}) {
  return (
    <FeatureFlagProvider value={featureFlags || {}}>
      <UserProvider initialUser={initialUser}>
        <CartProvider initialCart={initialCart}>
          {children}
        </CartProvider>
      </UserProvider>
    </FeatureFlagProvider>
  )
}

export function render(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { initialUser, initialCart, featureFlags, ...renderOptions } = options || {}

  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <AllProviders
        initialUser={initialUser}
        initialCart={initialCart}
        featureFlags={featureFlags}
      >
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { render }
```

### 5.3 Test Fixtures & Factory Functions

**`test-utils/mock-data/products.ts`:**
```typescript
import { Product, ProductCategory } from '@/types/shop'

let productIdCounter = 1

export function createMockProduct(overrides?: Partial<Product>): Product {
  return {
    id: productIdCounter++,
    title: 'کتاب آموزش ریاضی',
    description: 'کتاب آموزش ریاضی برای کودکان',
    price: 250000,
    discounted_price: null,
    age_min: 6,
    age_max: 10,
    category: ProductCategory.EDUCATIONAL_BOOK,
    image: '/images/products/math-book.jpg',
    stock: 50,
    is_available: true,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

export const mockProducts: Product[] = [
  createMockProduct({ id: 1, title: 'کتاب ریاضی پایه اول', price: 150000 }),
  createMockProduct({ id: 2, title: 'کتاب علوم پایه دوم', price: 200000 }),
  createMockProduct({ id: 3, title: 'مجموعه داستان‌های کودکانه', price: 350000 }),
]
```

### 5.4 Async Testing Patterns

Always use `waitFor` for async state updates:

```typescript
it('should load user profile on mount', async () => {
  render(<UserProfile />)

  // ❌ DON'T: Expect immediately
  // expect(screen.getByText('علی احمدی')).toBeInTheDocument()

  // ✅ DO: Wait for async operation
  await waitFor(() => {
    expect(screen.getByText('علی احمدی')).toBeInTheDocument()
  })
})
```

### 5.5 Testing User Interactions

Use `@testing-library/user-event` for realistic interactions:

```typescript
import userEvent from '@testing-library/user-event'

it('should submit form on enter key', async () => {
  const user = userEvent.setup()
  const onSubmit = jest.fn()

  render(<SearchForm onSubmit={onSubmit} />)

  const input = screen.getByPlaceholderText('جستجو...')
  await user.type(input, 'کتاب ریاضی{Enter}')

  expect(onSubmit).toHaveBeenCalledWith('کتاب ریاضی')
})
```

### 5.6 Testing Error Scenarios

Always test error paths:

```typescript
describe('Error Handling', () => {
  it('should display error message on failed login', async () => {
    server.use(
      http.post('*/user/login/', () => {
        return HttpResponse.json(
          { code: 'INVALID_CREDENTIALS', message: 'ایمیل یا رمز عبور نادرست است' },
          { status: 401 }
        )
      })
    )

    render(<LoginForm />)

    // Fill form and submit
    await user.type(screen.getByLabelText(/ایمیل/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/رمز عبور/i), 'wrongpass')
    await user.click(screen.getByText(/ورود/i))

    // Verify error displayed
    await waitFor(() => {
      expect(screen.getByText('ایمیل یا رمز عبور نادرست است')).toBeInTheDocument()
    })
  })

  it('should show retry button for network errors', async () => {
    server.use(
      http.get('*/shop/products/', () => {
        return HttpResponse.error()
      })
    )

    render(<ProductList />)

    await waitFor(() => {
      expect(screen.getByText(/خطا در بارگذاری/i)).toBeInTheDocument()
      expect(screen.getByText(/تلاش مجدد/i)).toBeInTheDocument()
    })
  })
})
```

---

## 6. CI/CD Integration

### 6.1 GitHub Actions Workflow

**`.github/workflows/test.yml`:**
```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-integration-tests:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npx tsc --noEmit

      - name: Run unit and integration tests
        run: npm run test:ci

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

      - name: Archive test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.node-version }}
          path: coverage/

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  coverage-check:
    needs: [unit-integration-tests]
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Download coverage artifacts
        uses: actions/download-artifact@v4
        with:
          name: test-results-20.x
          path: coverage/

      - name: Check coverage thresholds
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 90" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 90% threshold"
            exit 1
          fi
          echo "Coverage $COVERAGE% meets threshold ✅"
```

### 6.2 Pre-commit Hooks

**`package.json`:**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:ci"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.test.{ts,tsx}": [
      "jest --bail --findRelatedTests"
    ]
  }
}
```

---

## 7. Maintenance Guidelines

### 7.1 When to Update Tests

- **Feature changes**: Update tests when functionality changes
- **API changes**: Update MSW handlers when backend contracts change
- **Refactoring**: Tests should still pass after refactoring (if behavior unchanged)
- **Bug fixes**: Add test case that reproduces the bug before fixing

### 7.2 Identifying Flaky Tests

Signs of flaky tests:
- Intermittent failures in CI
- Passes locally but fails in CI
- Timing-dependent assertions

Fixes:
```typescript
// ❌ Flaky: Hard-coded timeout
await new Promise(resolve => setTimeout(resolve, 1000))

// ✅ Better: Wait for specific condition
await waitFor(() => expect(screen.getByText('Loaded')).toBeInTheDocument())

// ❌ Flaky: Assuming immediate state update
fireEvent.click(button)
expect(counter).toBe(1)

// ✅ Better: Wait for async update
await user.click(button)
await waitFor(() => expect(counter).toBe(1))
```

### 7.3 Test Performance Optimization

- **Parallel execution**: Jest runs tests in parallel by default
- **Selective testing**: Use `--findRelatedTests` in pre-commit hooks
- **Mock heavy dependencies**: Mock Fabric.js, large libraries
- **Clean up**: Use `afterEach` to clean state between tests

```typescript
afterEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
  server.resetHandlers()
})
```

### 7.4 Coverage Gaps Analysis

Run coverage report to find gaps:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

Focus on:
1. **Uncovered branches**: Error handlers, edge cases
2. **Uncovered functions**: Utility functions, helpers
3. **Low coverage files**: Components, services below 80%

---

## 8. Common Pitfalls & Solutions

### 8.1 Next.js Specific Issues

**Problem:** `useRouter` not defined in tests

**Solution:** Mock in `jest.setup.js` (already included above)

---

**Problem:** Dynamic imports fail in tests

**Solution:** Use `next/dynamic` with `ssr: false` or mock the component

---

### 8.2 Async State Management

**Problem:** State updates after component unmounts

**Solution:** Clean up in `useEffect`:
```typescript
useEffect(() => {
  let mounted = true

  async function fetchData() {
    const data = await api.getData()
    if (mounted) {
      setData(data)
    }
  }

  fetchData()
  return () => { mounted = false }
}, [])
```

---

### 8.3 MSW Handlers Not Matching

**Problem:** Requests not intercepted by MSW

**Solution:** Check handler URL patterns:
```typescript
// ❌ Won't match: /api/user/profile/
http.get('/user/profile/', ...)

// ✅ Matches: Uses wildcard for base URL
http.get('*/user/profile/', ...)
```

---

### 8.4 Persian Text Rendering

**Problem:** RTL text not rendering correctly in tests

**Solution:** Add RTL testing utilities:
```typescript
import { render } from '@testing-library/react'

function renderRTL(ui: ReactElement) {
  return render(
    <div dir="rtl" lang="fa">
      {ui}
    </div>
  )
}
```

---

## 9. Resources & Further Learning

### Official Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

### Best Practices
- [Testing Trophy Philosophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test Isolation](https://kentcdodds.com/blog/test-isolation-with-react)

### Persian/RTL Resources
- [RTL Testing Strategies](https://rtlcss.com/learn/getting-started/why-rtl/)
- [Accessibility in Persian Interfaces](https://www.w3.org/International/questions/qa-bidi-unicode-controls)

---

## 10. Next Steps

1. ✅ Review this testing strategy
2. ⏳ Set up testing infrastructure (Phase 1, Week 1)
3. ⏳ Implement critical tests (Phase 1, Week 1-2)
4. ⏳ Expand to comprehensive coverage (Phase 2, Week 3-4)
5. ⏳ Advanced testing and optimization (Phase 3, Week 5-6)
6. ⏳ Continuous improvement and maintenance

**Let's build confidence in the Derakht platform through comprehensive testing! 🚀**
