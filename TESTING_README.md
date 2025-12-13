# Testing Guide - Derakht Project

## Quick Start

```bash
# Run tests in watch mode
npm test

# Run tests once with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run E2E tests (Playwright)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests
npm run test:all
```

## Test Structure

```
__tests__/
├── unit/                    # Unit tests for pure functions and utilities
│   ├── utils/              # Utility function tests
│   │   └── validation.test.ts
│   ├── services/           # Service layer tests (coming soon)
│   └── hooks/              # Custom hooks tests (coming soon)
├── integration/            # Integration tests (coming soon)
│   ├── contexts/           # Context provider tests
│   ├── api/                # API integration tests
│   └── flows/              # Multi-step flows
├── components/             # Component tests (coming soon)
└── e2e/                    # End-to-end tests (coming soon)
```

## Current Test Coverage

### ✅ Implemented Tests

- **Validation Utils** (27 tests)
  - Email validation
  - Password validation (with complexity requirements)
  - Password match validation
  - Iranian phone number validation
  - Iranian postal code validation

### 🚧 Coming Soon (Phase 1)

- Authentication flow tests
- Shopping cart tests
- Error handling tests
- Context provider tests

## Writing Tests

### Unit Tests Example

```typescript
import { validateEmail } from '@/utils/validation'
import { ErrorCode } from '@/types/error'

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    const result = validateEmail('user@example.com')
    expect(result.isValid).toBe(true)
  })

  it('should reject invalid emails', () => {
    const result = validateEmail('invalid-email')
    expect(result.isValid).toBe(false)
    expect(result.errorCode).toBe(ErrorCode.INVALID_EMAIL)
  })
})
```

### Component Tests Example (Template)

```typescript
import { render, screen, waitFor } from '@/test-utils/test-helpers'
import userEvent from '@testing-library/user-event'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText('Clicked')).toBeInTheDocument()
    })
  })
})
```

### Integration Tests with MSW (Template)

For tests that need API mocking, set up MSW per-test-suite:

```typescript
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'

// Set up MSW server for this test suite
const server = setupServer(
  http.get('*/api/products/', () => {
    return HttpResponse.json({ items: [] })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ProductList', () => {
  it('should fetch and display products', async () => {
    server.use(
      http.get('*/api/products/', () => {
        return HttpResponse.json({
          items: [
            { id: '1', title: 'Product 1' }
          ]
        })
      })
    )

    render(<ProductList />)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })
  })
})
```

## Test Utilities

### Custom Render

Use the custom `render` function from `test-utils/test-helpers` to automatically wrap components with providers:

```typescript
import { render } from '@/test-utils/test-helpers'
import { mockUser, mockCart } from '@/test-utils/mock-data'

// Render with initial user and cart
render(<MyComponent />, {
  initialUser: mockUser,
  initialCart: mockCart,
  featureFlags: { storyCreation: true }
})
```

### Mock Data

Import pre-configured mock data from `test-utils/mock-data`:

```typescript
import {
  mockProducts,
  mockUser,
  mockCart,
  createMockProduct,
  createMockUser
} from '@/test-utils/mock-data'

// Use pre-configured mocks
expect(result).toEqual(mockUser)

// Or create custom mocks
const customProduct = createMockProduct({
  title: 'Custom Product',
  price: 100000
})
```

## Best Practices

### 1. Test User Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation details
expect(component.state.count).toBe(1)

// ✅ Good: Testing user-visible behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument()
```

### 2. Use waitFor for Async Operations

```typescript
// ❌ Bad: Assuming immediate state update
fireEvent.click(button)
expect(screen.getByText('Loaded')).toBeInTheDocument()

// ✅ Good: Wait for async update
await user.click(button)
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### 3. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks()
  // Additional cleanup if needed
})
```

### 4. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => { ... })

// ✅ Good
it('should display error message when email is invalid', () => { ... })
```

### 5. Test Edge Cases

```typescript
describe('validatePassword', () => {
  it('should accept passwords at minimum length (8 chars)', () => ...)
  it('should reject passwords below minimum length', () => ...)
  it('should handle empty string', () => ...)
  it('should handle whitespace-only passwords', () => ...)
})
```

## Debugging Tests

### Run Single Test File

```bash
npm test -- validation.test.ts
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="validateEmail"
```

### Debug in VS Code

Add this configuration to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Current File",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["${fileBasename}", "--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## CI/CD Integration

Tests run automatically on:
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

The CI pipeline:
1. Runs linter
2. Runs TypeScript type checking
3. Runs all unit and integration tests
4. Generates coverage report
5. Fails if coverage is below 90%

## Coverage Reports

After running `npm run test:coverage`, open the HTML report:

```bash
open coverage/lcov-report/index.html
```

## Troubleshooting

### Test Failures

1. **Check if mocks are set up correctly**
   - Verify MSW handlers are configured
   - Check that Next.js router mock is working

2. **Async issues**
   - Use `await waitFor()` for async operations
   - Check for unhandled promise rejections

3. **Clean up between tests**
   - Ensure `afterEach` cleanup is working
   - Check for test interdependencies

### Common Issues

**Issue**: `TextEncoder is not defined`
**Solution**: Already handled in `jest.polyfills.js`

**Issue**: MSW not intercepting requests
**Solution**: Ensure MSW server is set up with `beforeAll/afterAll`

**Issue**: Persian text not rendering
**Solution**: Use `renderRTL` helper from test-utils

## Resources

- [Testing Strategy](./TESTING_STRATEGY.md) - Comprehensive testing guide
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Playwright Documentation](https://playwright.dev/)

## Next Steps

See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) for the full implementation roadmap and Phase 2/3 plans.
