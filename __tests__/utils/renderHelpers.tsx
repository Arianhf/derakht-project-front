import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

/**
 * Custom render helpers for testing React components
 *
 * IMPORTANT: According to CLAUDE.md testing patterns, prefer mocking context hooks
 * (e.g., useUser, useCart) rather than wrapping components with providers.
 *
 * Example - Preferred approach (mock hooks):
 * ```
 * jest.mock('@/contexts/UserContext', () => ({
 *   useUser: () => ({
 *     user: createMockUser(),
 *     isAuthenticated: true,
 *     logout: jest.fn(),
 *   }),
 * }))
 * ```
 *
 * Use renderWithProviders only for integration tests that specifically test
 * provider interactions.
 */

/**
 * Mock UserProvider for testing
 * Used when you need provider behavior without the full implementation
 */
export const MockUserProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

/**
 * Mock FeatureFlagProvider for testing
 */
export const MockFeatureFlagProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

/**
 * Mock CartProvider for testing
 */
export const MockCartProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

/**
 * Render with all providers (for integration tests)
 *
 * @example
 * ```
 * const { getByText } = renderWithProviders(<MyComponent />)
 * ```
 */
interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  includeCart?: boolean
}

export const renderWithProviders = (
  ui: ReactElement,
  { includeCart = false, ...renderOptions }: RenderWithProvidersOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    let wrapped = children

    // Wrap with FeatureFlagProvider
    wrapped = <MockFeatureFlagProvider>{wrapped}</MockFeatureFlagProvider>

    // Wrap with UserProvider
    wrapped = <MockUserProvider>{wrapped}</MockUserProvider>

    // Conditionally wrap with CartProvider
    if (includeCart) {
      wrapped = <MockCartProvider>{wrapped}</MockCartProvider>
    }

    return <>{wrapped}</>
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react'

/**
 * Helper to create mock context values
 */
export const createMockUserContext = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  updateUser: jest.fn(),
  refreshUser: jest.fn(),
  ...overrides,
})

export const createMockCartContext = (overrides = {}) => ({
  cart: null,
  isLoading: false,
  itemCount: 0,
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  refreshCart: jest.fn(),
  ...overrides,
})

export const createMockFeatureFlagContext = (overrides = {}) => ({
  flags: {},
  isEnabled: jest.fn(() => false),
  getFlag: jest.fn(() => undefined),
  ...overrides,
})
