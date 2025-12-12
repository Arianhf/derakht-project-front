import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { UserProvider } from '@/contexts/UserContext'
import { CartProvider } from '@/contexts/CartContext'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext'
import { User } from '@/contexts/UserContext'
import { CartDetails } from '@/types/shop'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialUser?: User | null
  initialCart?: CartDetails | null
  featureFlags?: Record<string, boolean>
}

interface AllProvidersProps {
  children: ReactNode
  initialUser?: User | null
  initialCart?: CartDetails | null
  featureFlags?: Record<string, boolean>
}

function AllProviders({ children, initialUser, initialCart, featureFlags }: AllProvidersProps) {
  return (
    <FeatureFlagProvider value={featureFlags || {}}>
      <UserProvider initialValue={initialUser || undefined}>
        <CartProvider initialValue={initialCart || undefined}>
          {children}
        </CartProvider>
      </UserProvider>
    </FeatureFlagProvider>
  )
}

/**
 * Custom render function that wraps components with necessary providers
 * @param ui - The component to render
 * @param options - Render options including initial values for providers
 */
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
