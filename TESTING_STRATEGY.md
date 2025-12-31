# Testing Strategy

This document outlines the testing approach, patterns, and best practices for the Derakht frontend application.

## Table of Contents

- [Overview](#overview)
- [Test Infrastructure](#test-infrastructure)
- [Testing Patterns](#testing-patterns)
- [Test Organization](#test-organization)
- [Writing Tests](#writing-tests)
- [Mocking Strategies](#mocking-strategies)
- [Coverage Goals](#coverage-goals)
- [Common Patterns](#common-patterns)

## Overview

### Testing Stack

- **Unit & Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **API Mocking**: MSW (Mock Service Worker)
- **Test Environment**: jsdom

### Test Types

1. **Unit Tests (60%)**: Services, utilities, hooks, isolated components
2. **Integration Tests (30%)**: Component interactions, context integration, API flows
3. **E2E Tests (10%)**: Critical user journeys

## Test Infrastructure

### Setup Files

- `jest.config.js`: Jest configuration with path aliases and coverage settings
- `jest.setup.js`: Global test setup (mocks for router, toast, localStorage, etc.)
- `jest.polyfills.js`: Polyfills for test environment (TextEncoder, TextDecoder)

### Test Utilities

Located in `__tests__/utils/`:

- **`mockData.ts`**: Factory functions for creating mock data
- **`testHelpers.ts`**: Common test helper functions
- **`renderHelpers.tsx`**: React Testing Library render helpers with providers

### MSW Setup

Located in `__tests__/mocks/`:

- **`handlers.ts`**: HTTP request handlers for common API endpoints
- **`server.ts`**: MSW server instance for Node.js test environment

## Testing Patterns

### Pattern 1: Mock Context Hooks (Preferred)

For most component tests, **mock the context hooks** rather than wrapping components with providers:

```tsx
import { useUser } from '@/contexts/UserContext'
import { createMockUser } from '@/__tests__/utils'

jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}))

describe('MyComponent', () => {
  it('shows user name when authenticated', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: createMockUser({ first_name: 'علی' }),
      isAuthenticated: true,
      logout: jest.fn(),
    })

    render(<MyComponent />)
    expect(screen.getByText('علی')).toBeInTheDocument()
  })
})
```

**Why?** This approach:
- Tests components in isolation
- Makes tests faster and more focused
- Avoids complex provider nesting
- Easier to test different states

### Pattern 2: Render with Providers (Integration Tests Only)

Use `renderWithProviders` only for **integration tests** that specifically test provider interactions:

```tsx
import { renderWithProviders } from '@/__tests__/utils'

describe('ShoppingCart Integration', () => {
  it('updates cart when user adds item', async () => {
    const { getByText, user } = renderWithProviders(<ShopPage />, {
      includeCart: true,
    })

    await user.click(getByText('افزودن به سبد'))
    expect(getByText('۱ محصول')).toBeInTheDocument()
  })
})
```

### Pattern 3: API Mocking with MSW

For tests that make API calls, use MSW to intercept and mock network requests:

```tsx
import { server } from '@/__tests__/mocks/server'
import { http, HttpResponse } from 'msw'

describe('ProductList', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('displays products from API', async () => {
    render(<ProductList />)

    await waitFor(() => {
      expect(screen.getByText('محصول تست ۱')).toBeInTheDocument()
    })
  })

  it('handles API errors', async () => {
    server.use(
      http.get('/api/shop/products/', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<ProductList />)

    await waitFor(() => {
      expect(screen.getByText(/خطا/)).toBeInTheDocument()
    })
  })
})
```

## Test Organization

```
__tests__/
├── mocks/
│   ├── handlers.ts      # MSW request handlers
│   ├── server.ts        # MSW server setup
│   └── index.ts         # Barrel export
├── utils/
│   ├── mockData.ts      # Mock data factories
│   ├── testHelpers.ts   # Test helper functions
│   ├── renderHelpers.tsx # Render helpers
│   └── index.ts         # Barrel export
├── unit/
│   ├── utils/           # Utility function tests
│   ├── hooks/           # Custom hook tests
│   └── services/        # Service layer tests
├── integration/
│   ├── contexts/        # Context integration tests
│   └── flows/           # User flow integration tests
└── components/
    ├── shared/          # Shared component tests
    ├── shop/            # Shop component tests
    └── story/           # Story component tests
```

## Writing Tests

### Test Naming Convention

```tsx
describe('ComponentName', () => {
  describe('when user is authenticated', () => {
    it('shows user profile link', () => {})
    it('hides login button', () => {})
  })

  describe('when user is not authenticated', () => {
    it('shows login button', () => {})
    it('redirects to login on protected action', () => {})
  })
})
```

### Component Test Structure

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  // Setup
  const defaultProps = {
    title: 'عنوان تست',
    onSubmit: jest.fn(),
  }

  // Helper to render component with default props
  const renderComponent = (props = {}) => {
    return render(<MyComponent {...defaultProps} {...props} />)
  }

  // Tests organized by scenario
  describe('when form is submitted', () => {
    it('calls onSubmit with form data', async () => {
      const user = userEvent.setup()
      const onSubmit = jest.fn()
      renderComponent({ onSubmit })

      await user.type(screen.getByLabelText('نام'), 'علی')
      await user.click(screen.getByRole('button', { name: 'ارسال' }))

      expect(onSubmit).toHaveBeenCalledWith({ name: 'علی' })
    })

    it('shows success message', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: 'ارسال' }))

      await waitFor(() => {
        expect(screen.getByText('با موفقیت ارسال شد')).toBeInTheDocument()
      })
    })
  })

  describe('validation', () => {
    it('shows error for empty required field', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: 'ارسال' }))

      expect(screen.getByText('این فیلد الزامی است')).toBeInTheDocument()
    })
  })
})
```

### Service Test Structure

```tsx
import { shopService } from '@/services/shopService'
import { server } from '@/__tests__/mocks/server'
import { http, HttpResponse } from 'msw'

describe('shopService', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('getProducts', () => {
    it('fetches products successfully', async () => {
      const products = await shopService.getProducts()

      expect(products).toHaveLength(2)
      expect(products[0].title).toBe('محصول تست ۱')
    })

    it('throws error on API failure', async () => {
      server.use(
        http.get('/api/shop/products/', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(shopService.getProducts()).rejects.toThrow()
    })
  })
})
```

## Mocking Strategies

### 1. Mock Next.js Router

Already set up globally in `jest.setup.js`. Override in specific tests:

```tsx
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

it('navigates on button click', async () => {
  const push = jest.fn()
  ;(useRouter as jest.Mock).mockReturnValue({ push })

  const user = userEvent.setup()
  render(<MyComponent />)

  await user.click(screen.getByRole('button'))
  expect(push).toHaveBeenCalledWith('/target-page')
})
```

### 2. Mock Toast Notifications

```tsx
import toast from 'react-hot-toast'

it('shows error toast on failure', async () => {
  // Trigger error
  await user.click(screen.getByRole('button'))

  expect(toast.error).toHaveBeenCalledWith('پیام خطا')
})
```

### 3. Mock localStorage

```tsx
import { mockLocalStorage } from '@/__tests__/utils'

it('saves to localStorage', () => {
  const storage = mockLocalStorage()
  global.localStorage = storage

  // Trigger action that uses localStorage

  expect(storage.setItem).toHaveBeenCalledWith('key', 'value')
})
```

### 4. Mock Context Hooks

```tsx
jest.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: '123', first_name: 'علی' },
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}))
```

### 5. Mock API Calls with MSW

```tsx
server.use(
  http.post('/api/endpoint', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ success: true, data: body })
  })
)
```

## Coverage Goals

### Current Status

Coverage thresholds are **disabled during initial implementation** but will be re-enabled once sufficient tests are written.

### Target Coverage (Future)

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 90,
    statements: 90,
  },
}
```

### What to Test

✅ **Do test:**
- User interactions (clicks, form inputs, navigation)
- Conditional rendering based on props/state
- Error states and edge cases
- Integration with services/APIs
- Accessibility (keyboard navigation, screen reader text)

❌ **Don't test:**
- Implementation details (internal state, private methods)
- Third-party library behavior (unless you're integrating it)
- Styles/CSS (use visual regression if needed)
- Next.js framework internals

## Common Patterns

### Testing Forms

```tsx
it('submits form with validation', async () => {
  const user = userEvent.setup()
  const onSubmit = jest.fn()
  render(<AddressForm onSubmit={onSubmit} />)

  // Fill form
  await user.type(screen.getByLabelText('نام گیرنده'), 'علی احمدی')
  await user.type(screen.getByLabelText('شماره تماس'), '09121234567')
  await user.type(screen.getByLabelText('آدرس'), 'خیابان ولیعصر')
  await user.type(screen.getByLabelText('کد پستی'), '1234567890')

  // Submit
  await user.click(screen.getByRole('button', { name: 'ذخیره' }))

  // Assert
  expect(onSubmit).toHaveBeenCalledWith({
    recipient_name: 'علی احمدی',
    phone: '09121234567',
    address: 'خیابان ولیعصر',
    postal_code: '1234567890',
  })
})
```

### Testing Async Loading States

```tsx
it('shows loading spinner while fetching', async () => {
  render(<ProductList />)

  // Loading state
  expect(screen.getByRole('status')).toBeInTheDocument()

  // Wait for data
  await waitFor(() => {
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  // Data loaded
  expect(screen.getByText('محصول تست')).toBeInTheDocument()
})
```

### Testing Error Handling

```tsx
it('displays error message on API failure', async () => {
  server.use(
    http.get('/api/products/', () => {
      return HttpResponse.json(
        { code: 'SERVER_ERROR', message: 'خطای سرور' },
        { status: 500 }
      )
    })
  )

  render(<ProductList />)

  await waitFor(() => {
    expect(screen.getByText('خطای سرور')).toBeInTheDocument()
  })
})
```

### Testing with Persian Text

```tsx
import { findByPersianText } from '@/__tests__/utils'

it('displays Persian text correctly', () => {
  render(<MyComponent />)

  const button = findByPersianText('افزودن به سبد خرید')
  expect(button).toBeInTheDocument()
})
```

### Testing with Persian Numbers

```tsx
import { toPersianDigits, formatPersianPrice } from '@/__tests__/utils'

it('displays price in Persian format', () => {
  render(<ProductCard price={100000} />)

  expect(screen.getByText(formatPersianPrice(100000))).toBeInTheDocument()
  // Expects: "۱۰۰,۰۰۰ تومان"
})
```

### Testing File Uploads

```tsx
import { createMockFile } from '@/__tests__/utils'

it('uploads image file', async () => {
  const user = userEvent.setup()
  const file = createMockFile('test.jpg', 'image/jpeg', 1024)

  render(<ImageUpload />)

  const input = screen.getByLabelText('بارگذاری تصویر')
  await user.upload(input, file)

  expect(screen.getByText('test.jpg')).toBeInTheDocument()
})
```

### Testing Navigation

```tsx
import { useRouter } from 'next/navigation'

it('navigates to product page on click', async () => {
  const push = jest.fn()
  ;(useRouter as jest.Mock).mockReturnValue({ push })

  const user = userEvent.setup()
  render(<ProductCard slug="test-product" />)

  await user.click(screen.getByRole('link'))

  expect(push).toHaveBeenCalledWith('/shop/test-product')
})
```

## Best Practices

1. **Write tests that resemble how users interact** with your app (use `getByRole`, `getByLabelText`, avoid `getByTestId`)

2. **Test behavior, not implementation** - refactoring shouldn't break tests

3. **Use Persian text in assertions** - tests should reflect the actual user experience

4. **Keep tests simple and focused** - one concept per test

5. **Use factories for test data** - `createMockUser()`, `createMockProduct()`, etc.

6. **Clean up after tests** - MSW server cleanup, clear mocks with `afterEach`

7. **Use meaningful descriptions** - test names should explain what is being tested

8. **Test edge cases** - empty states, errors, loading states, permission issues

9. **Avoid testing implementation details** - internal state, component lifecycle methods

10. **Use MSW for API mocking** - avoid manual `fetch` mocking, test realistic network interactions

## Running Tests

```bash
# Watch mode (development)
pnpm test

# CI mode with coverage
pnpm test:ci

# Coverage report
pnpm test:coverage

# Specific test file
pnpm test -- path/to/test.test.ts

# Tests matching pattern
pnpm test -- -t "pattern"

# E2E tests
pnpm test:e2e

# All tests (unit + E2E)
pnpm test:all
```

## Debugging Tests

### VS Code Launch Configuration

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest: Current File",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["${fileBasename}", "--config", "jest.config.js"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Common Debugging Tips

1. **Use `screen.debug()`** to see current DOM state:
   ```tsx
   screen.debug() // Prints entire DOM
   screen.debug(element) // Prints specific element
   ```

2. **Check what queries are available**:
   ```tsx
   screen.logTestingPlaygroundURL()
   ```

3. **Increase timeout for debugging**:
   ```tsx
   await waitFor(() => expect(element).toBeInTheDocument(), {
     timeout: 5000
   })
   ```

4. **Run single test**:
   ```bash
   pnpm test -- -t "specific test name"
   ```

## Future Improvements

- [ ] Add visual regression testing with Playwright
- [ ] Add accessibility testing with `jest-axe`
- [ ] Implement snapshot testing for complex components
- [ ] Add performance testing for critical paths
- [ ] Set up test coverage badges in README
- [ ] Enable coverage thresholds once 90% coverage is reached
- [ ] Add mutation testing to verify test quality

---

**Last Updated**: 2025-01-01

For questions or suggestions about testing strategy, please open an issue or contact the development team.
