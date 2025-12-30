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

## Code Style

### Naming Conventions
- Components: PascalCase (`StoryCard.tsx`)
- Hooks: camelCase with `use` prefix (`useStoryProgress.ts`)
- Services: camelCase (`storyService.ts`)
- Types/Interfaces: PascalCase, no `I` prefix (`StoryMeta`, not `IStoryMeta`)
- Constants: SCREAMING_SNAKE_CASE for true constants, camelCase for config objects
- CSS classes in SCSS modules: camelCase (`storyCard`, `storyCardTitle`)

### File Organization
- One component per file (except small internal helpers)
- Co-locate component, styles, types, and tests:
  ```
  src/components/StoryCard/
    index.ts           # Re-export
    StoryCard.tsx      # Component
    StoryCard.module.scss
    StoryCard.test.tsx
    StoryCard.types.ts # If types are complex
  ```
- Barrel exports via `index.ts` for cleaner imports

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Internal aliases (@/services, @/components, etc.)
4. Relative imports (./types, ./styles)
5. Styles last

## Component Patterns

### Component Structure Template
```tsx
'use client'; // Only if needed

import { useState } from 'react';
import styles from './ComponentName.module.scss';

interface ComponentNameProps {
  // Required props first, optional last
  title: string;
  onAction: (id: string) => void;
  className?: string;
}

export function ComponentName({ title, onAction, className }: ComponentNameProps) {
  // 1. Hooks
  // 2. Derived state
  // 3. Handlers
  // 4. Effects
  // 5. Render

  return (
    <div className={cn(styles.root, className)}>
      {/* content */}
    </div>
  );
}
```

### Props Guidelines
- Prefer specific props over spreading: `{ title, onClick }` not `{...props}`
- Use `className?: string` for style customization, not `style` prop
- Callbacks: `onX` for events, `handleX` for internal handlers
- Boolean props: `isLoading`, `hasError`, `canEdit` (verb prefixes)

### Page Components
- Server Components by default (Next.js 15 App Router)
- Client Components marked with `'use client'` directive
- Layout components use nested `layout.tsx` files
- Dynamic routes use `[param]` folder naming (e.g., `/shop/[slug]/`)

### Styling
- SCSS modules (`.module.scss`) for component-scoped styles
- Global styles in `src/app/globals.scss`
- CSS variables defined in `src/assets/styles/variables.css`
- Persian font: Shoor (loaded via `next/font`)

### Avoid
- Inline styles (use SCSS modules)
- Anonymous functions in JSX for complex logic (extract to named handlers)
- Prop drilling beyond 2 levels (use context or composition)

## Architecture

### RTL (Right-to-Left) Support
This is a Persian (Farsi) application with RTL layout configured at the root:
- HTML has `lang="fa"` and `dir="rtl"` in `src/app/layout.tsx`
- All UI text and error messages are in Persian
- All numbers in UI should be in persian 
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

## Error Handling

### Service Layer
```tsx
// Services should throw, let components handle
async function fetchStory(id: string): Promise<Story> {
  const response = await api.get(`/stories/${id}`);
  return response.data;
}
```

### Component Layer
```tsx
// Components catch and display
try {
  const story = await storyService.fetchStory(id);
} catch (error) {
  const standardError = error as StandardErrorResponse;
  toast.error(standardError.message || ERROR_MESSAGES.GENERIC);
}
```

### Error Handling Rules
- Backend errors transformed to standardized format with `code`, `message`, `severity`
- Error codes defined in `src/types/error.ts`
- Persian error messages in `src/constants/errorMessages.ts`
- Never swallow errors silently (at minimum, console.error in dev)
- Never show raw English error messages to users
- Never use `any` for error types

## Authentication & Route Protection

**Middleware** (`src/middleware.ts`):
- Checks `access_token` cookie for authentication
- Protected routes: `/account/*`, `/shop/checkout`, `/story/create`, `/story/edit`
- Redirects to `/login?redirect={originalPath}` if unauthenticated

**Pattern**: Token stored in both localStorage (for JS access) and cookies (for middleware).

## Performance

### Must Do
- Use `next/image` for all images (automatic optimization)
- Lazy load below-fold components: `dynamic(() => import('./Heavy'), { ssr: false })`
- Memoize expensive computations: `useMemo` for derived data, `useCallback` for handlers passed as props

### Avoid
- Re-creating objects/arrays in render (move to useMemo or outside component)
- Fetching in useEffect when Server Components can fetch
- Large bundle imports (use specific imports: `import { debounce } from 'lodash-es'`)

### Images
- Always provide `width` and `height` or use `fill` with sized container
- Use `priority` only for above-fold LCP images
- Lazy load images in lists/grids

## Accessibility (a11y)

### Requirements
- All interactive elements must be keyboard accessible
- Images need meaningful `alt` text in Persian
- Form inputs need associated labels (not just placeholder)
- Color contrast: minimum 4.5:1 for text
- Focus states must be visible

### Patterns
- Use semantic HTML (`<button>` not `<div onClick>`)
- Use `aria-label` for icon-only buttons
- Loading states: `aria-busy="true"` and `aria-live="polite"` for updates
- Skip link for main content (important for RTL)

## Language Guidelines

### Persian (User-Facing)
- All UI text, labels, buttons
- Error messages (via errorMessages.ts)
- Placeholder text
- Toast notifications
- Meta descriptions, page titles

### English (Code-Facing)
- Variable names, function names
- Code comments
- Console logs
- Git commits
- Documentation (CLAUDE.md, README)
- CSS class names
- Test descriptions (but test display text in Persian)

### Numbers
- Use Persian numerals for display: `toPersianDigits(count)`
- Keep numbers in English for calculations/IDs

## Testing Infrastructure

### Test Organization
- `__tests__/unit/` - Services, utils, hooks (60% of tests)
- `__tests__/integration/` - Contexts, API flows (30% of tests)
- `__tests__/components/` - React component tests
- E2E tests in Playwright test files

### Key Testing Patterns
- MSW for API mocking (network-level interception)
- Context providers tested by mocking hooks, not wrapping with providers
- Path alias `@/*` resolves to `src/*` in tests via `jest.config.js`

### Test Naming
```tsx
describe('StoryCard', () => {
  describe('when story is published', () => {
    it('shows publish date in Persian format', () => {});
    it('enables share button', () => {});
  });
  
  describe('when story is draft', () => {
    it('shows draft badge', () => {});
    it('disables share button', () => {});
  });
});
```

### Coverage Goals
- Target: 90% overall coverage (currently disabled during initial implementation)
- Excludes: `layout.tsx`, `page.tsx`, type definitions, stories files

### Don't Test
- Implementation details (internal state, private methods)
- Third-party library behavior
- Styles/CSS (use visual regression if needed)

## Refactoring Guidelines

### Before Changing Shared Code
- Search for all usages before modifying: services, hooks, components, types
- If something is used in 3+ places, discuss the change scope first

### Deprecation Pattern
When replacing old patterns:
1. Add `@deprecated` JSDoc comment with migration path
2. Don't delete old code until all usages are migrated
3. Log deprecation warnings in development only

### Breaking Changes Checklist
- [ ] Update all call sites
- [ ] Update related tests
- [ ] Update types
- [ ] Check for dynamic imports/lazy loading that might miss the change

### When Refactoring, Tests Must
1. Pass before you start (verify baseline)
2. Fail when you break something (verify they're testing the right thing)
3. Pass after refactor with minimal changes

## Git Conventions

### Branch Names
- `feature/story-progress-tracking`
- `fix/cart-anonymous-merge`
- `refactor/services-to-hooks`
- `chore/update-dependencies`

### Commit Messages
```
type(scope): description

feat(story): add progress saving
fix(cart): handle anonymous cart merge on login
refactor(services): convert shopService to hooks
test(story): add StoryCard integration tests
```
NEVER ever mention a co-authored-by or similar aspects. In particular, never mention the tool used to create the commit message or PR.

### PR Size
- Keep PRs under 400 lines when possible
- Large refactors: split into sequential PRs (e.g., "add new pattern" → "migrate usages" → "remove old code")

## Workflow

Whenever I ask you to work on something, follow this workflow:

1. Create a new branch with a descriptive name based on the task
2. Make the necessary changes to implement the feature or fix
3. Commit frequently with clear, descriptive commit messages
4. Create a Pull Request when done with a summary of the changes

## Navigation and Routing

When adding router.push(), links, or navigation to a new page:
- **The page must exist** in the codebase already, OR
- **It must be part of the planned implementation** for this task or a documented future task

Do not create broken links to pages that don't exist and aren't planned. If you need to link to a page that doesn't exist yet, discuss it first before implementing.

## Type Safety

- Strict TypeScript enabled in `tsconfig.json`
- Type definitions in `src/types/`:
    - `shop.ts` - E-commerce types
    - `error.ts` - Error handling types
    - `story.ts` - Story creation types
    - `search.ts` - Search result types
- Image types in `src/types/images.d.ts` for static imports

## Deployment

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