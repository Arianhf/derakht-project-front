# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Derakht** is a Persian-language educational platform for children featuring story creation, educational blog content, and an e-commerce shop for educational packages. Built with Next.js 15 (App Router), React 19, TypeScript, and SCSS modules.

## Development Commands

### Core Development
```bash
pnpm dev              # Start development server at http://localhost:3000
pnpm build            # Build production application (standalone output)
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Testing
```bash
# Unit & Integration Tests (Jest + React Testing Library)
pnpm test             # Run tests in watch mode
pnpm test:ci          # CI mode with coverage (max 2 workers)
pnpm test:coverage    # Generate coverage report

# E2E Tests (Playwright)
pnpm test:e2e         # Run E2E tests headless
pnpm test:e2e:ui      # Run with Playwright UI
pnpm test:e2e:debug   # Debug mode
pnpm test:all         # Run all tests (unit + e2e)
```

### Running Individual Tests
```bash
# Single test file
pnpm test -- path/to/test.test.ts

# Specific test suite
pnpm test -- -t "test name pattern"

# Watch single file
pnpm test -- path/to/test.test.ts --watch
```

## Architecture

### RTL (Right-to-Left) Support
This is a Persian (Farsi) application with RTL layout configured at the root:
- HTML has `lang="fa"` and `dir="rtl"` in `src/app/layout.tsx`
- All UI text and error messages are in Persian
- Use Persian for user-facing messages, English for code comments

### State Management Architecture

The application uses React Context API for global state with conditional provider loading:

1. **UserProvider** (root level in `layout.tsx`):
   - Manages authentication state and user profile
   - Available globally across all routes
   - Handles token-based authentication with automatic refresh

2. **FeatureFlagProvider** (loaded via ConditionalProviders):
   - Controls feature toggles for gradual rollout
   - Supports localStorage overrides in development
   - Available globally

3. **CartProvider** (conditionally loaded):
   - Only loaded on `/shop`, `/cart`, `/checkout` routes to reduce overhead
   - Managed by `ConditionalProviders` component
   - Supports both authenticated and anonymous carts via `anonymous_cart_id` cookie

**Pattern**: Path-based conditional provider loading reduces context overhead on non-shopping pages.

### API Layer Architecture

**API Client** (`src/services/api.tsx`):
- Axios-based client with automatic token refresh on 401 errors
- Request queue system prevents duplicate refresh requests
- Transforms backend errors to standardized `StandardErrorResponse` format
- Anonymous cart support via `X-Anonymous-Cart-ID` header
- Automatic breadcrumb logging for debugging

**Environment Configuration**:
- `NEXT_PUBLIC_BASE_URL` - API base URL (default: `/api` with dev warning)
- Configure in `.env` for development, build args for Docker

**Token Refresh Flow**:
1. 401 error triggers refresh using `refresh_token` from localStorage
2. Failed requests are queued during refresh
3. New `access_token` stored in both localStorage and cookies
4. Queued requests retried with new token
5. On refresh failure: clear auth state and redirect to `/login?session_expired=true`

**Error Handling**:
- Backend errors transformed to standardized format with `code`, `message`, `severity`
- Error codes defined in `src/types/error.ts`
- Persian error messages in `src/constants/errorMessages.ts`

### Service Layer Pattern

All API interactions go through service modules in `src/services/`:
- `shopService.ts` - Product catalog, cart, checkout, orders
- `userService.ts` - User profile, addresses, authentication status
- `loginService.tsx` - Login, registration, phone verification
- `blogService.tsx` - Blog posts, categories, tags
- `storyService.tsx` - Story creation and management
- `featureFlagService.ts` - Feature flag management
- `searchService.ts` - Global search functionality

**Pattern**: Services export singleton objects (e.g., `export const shopService = { ... }`), not classes.

### Authentication & Route Protection

**Middleware** (`src/middleware.ts`):
- Checks `access_token` cookie for authentication
- Protected routes: `/account/*`, `/shop/checkout`, `/story/create`, `/story/edit`
- Redirects to `/login?redirect={originalPath}` if unauthenticated

**Pattern**: Token stored in both localStorage (for JS access) and cookies (for middleware).

### Testing Infrastructure

**Test Organization**:
- `__tests__/unit/` - Services, utils, hooks (60% of tests)
- `__tests__/integration/` - Contexts, API flows (30% of tests)
- `__tests__/components/` - React component tests
- E2E tests in Playwright test files

**Key Testing Patterns**:
- MSW for API mocking (network-level interception)
- Context providers tested by mocking hooks, not wrapping with providers
- Path alias `@/*` resolves to `src/*` in tests via `jest.config.js`

**Coverage Goals**:
- Target: 90% overall coverage (currently disabled during initial implementation)
- Excludes: `layout.tsx`, `page.tsx`, type definitions, stories files

### Component Patterns

**Page Components**:
- Server Components by default (Next.js 15 App Router)
- Client Components marked with `'use client'` directive
- Layout components use nested `layout.tsx` files
- Dynamic routes use `[param]` folder naming (e.g., `/shop/[slug]/`)

**Styling**:
- SCSS modules (`.module.scss`) for component-scoped styles
- Global styles in `src/app/globals.scss`
- CSS variables defined in `src/assets/styles/variables.css`
- Persian font: Yekan (loaded via `next/font`)

**Common Patterns**:
- Client-side components separated (e.g., `page.tsx` imports `*Client.tsx`)
- Toast notifications via `react-hot-toast` (Persian messages)
- Error boundaries wrap root layout for crash recovery
- Shared components in `src/components/shared/`

### Type Safety

- Strict TypeScript enabled in `tsconfig.json`
- Type definitions in `src/types/`:
  - `shop.ts` - E-commerce types
  - `error.ts` - Error handling types
  - `story.ts` - Story creation types
  - `search.ts` - Search result types
- Image types in `src/types/images.d.ts` for static imports

### Deployment

**Docker**:
- Multi-stage build (Node.js builder + Nginx serving)
- Standalone Next.js output for smaller image
- Nginx proxies requests to Node.js on port 3000
- Build arg: `NEXT_PUBLIC_BASE_URL` configurable at build time

**Environment**:
- Production API: `https://derakht.darkube.app/api/`
- Image domains whitelisted in `next.config.ts`

## Key Files to Understand

- `src/services/api.tsx` - Request/response interceptors, token refresh logic
- `src/middleware.ts` - Route protection logic
- `src/contexts/UserContext.tsx` - Authentication state management
- `src/contexts/CartContext.tsx` - Anonymous + authenticated cart handling
- `src/components/ConditionalProviders.tsx` - Path-based provider loading
- `jest.config.js` - Test configuration and module aliases
- `TESTING_STRATEGY.md` - Comprehensive testing approach documentation

## Common Gotchas

1. **Anonymous Cart ID**: Generated once and stored in `anonymous_cart_id` cookie (30-day expiry)
2. **Context Usage**: Always use hooks (`useUser()`, `useCart()`) instead of accessing context directly
3. **API Errors**: All errors should be caught as `StandardErrorResponse` type, not raw Axios errors
4. **Persian Text**: Use Persian for all user-facing strings; check `src/constants/errorMessages.ts` for common messages
5. **Provider Nesting**: UserProvider at root, FeatureFlagProvider always on, CartProvider only on shop routes
6. **Test Mocking**: Mock context hooks (e.g., `useUser`) rather than wrapping components with providers in tests


## Platform Implementation Guideline
When implementing features:
1. Always consider both web and mobile contexts
2. If implementations differ between platforms, explicitly create both versions
3. Don't ask which platform to implement - do both by default
4. Highlight any platform-specific considerations or trade-offs
5. Test/verify behavior works correctly on both platforms