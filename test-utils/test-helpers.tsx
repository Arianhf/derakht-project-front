import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Options can be extended in the future as needed
}

/**
 * Custom render function for testing
 *
 * Note: For components that use contexts (UserContext, CartContext, FeatureFlagContext),
 * mock the context hooks directly in your test instead of using providers:
 *
 * @example
 * ```typescript
 * import { useUser } from '@/contexts/UserContext'
 *
 * jest.mock('@/contexts/UserContext', () => ({
 *   useUser: jest.fn()
 * }))
 *
 * // In your test:
 * (useUser as jest.Mock).mockReturnValue({
 *   user: mockUser,
 *   loading: false,
 *   fetchUser: jest.fn(),
 *   // ... other context values
 * })
 * ```
 *
 * @param ui - The component to render
 * @param options - Render options
 */
export function render(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return rtlRender(ui, options)
}

/**
 * Render component with RTL direction for Persian text testing
 */
export function renderRTL(ui: ReactElement, options?: CustomRenderOptions) {
  return render(
    <div dir="rtl" lang="fa">
      {ui}
    </div>,
    options
  )
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { render as default }
