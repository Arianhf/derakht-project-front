# CLAUDE.md - Derakht Frontend

**Persian educational platform for children** - Next.js 15, React 19, TypeScript, SCSS modules

## Commands
```bash
pnpm dev / build / lint
pnpm test / test:ci / test:e2e / test:all
```

## Critical Project-Specific Conventions

### Persian/RTL
- All UI text, errors, numbers in Persian (`toPersianDigits()` for display)
- Code/commits in English
- HTML: `lang="fa"` `dir="rtl"` in `src/app/layout.tsx`

### File Naming & Organization (MANDATORY)
- **SCSS modules MUST match component**: `StoryCard.tsx` → `StoryCard.module.scss` (NOT `storyCard.module.scss`)
- **Every component directory MUST have `index.ts`**:
  ```ts
  export { StoryCard } from './StoryCard';
  export type { StoryCardProps } from './StoryCard';
  ```
- **All new components MUST have co-located test file** (`ComponentName.test.tsx`)

### Import Order (ESLint enforced)
1. React/Next.js
2. Third-party libs
3. Internal aliases (@/services, @/components)
4. Relative imports
5. **Styles ALWAYS LAST**
- Combine duplicate imports: `import toast, { Toaster } from 'react-hot-toast';`

### Type Safety (ESLint: `@typescript-eslint/no-explicit-any` = error)
**NEVER use `any` - use specific types or `unknown` + type guards**

Error handling pattern (MOST COMMON):
```ts
import { StandardErrorResponse } from '@/types/error';

try {
  await saveStory();
} catch (error) {
  const standardError = error as StandardErrorResponse;
  toast.error(standardError.message || ERROR_MESSAGES.GENERIC);
}
```

Component props:
```ts
import { AddressFormData } from '@/types/shop';
onSubmit: (data: AddressFormData) => void  // NOT: (data: any) => void
```

Progress callbacks:
```ts
import { AxiosProgressEvent } from 'axios';
onProgress?: (e: AxiosProgressEvent) => void  // NOT: (e: any) => void
```

Canvas/Fabric.js:
```ts
import type { FabricObject, CanvasData } from '@/types/canvas';
activeObjects.forEach((obj: FabricObject) => {...})  // NOT: (obj: any)
const canvasRef = useRef<CanvasData | null>(null);   // NOT: <any>
```

**Temporary violations**: Some files ignored in `eslint.config.mjs` until refactored

## Architecture Specifics

### Conditional Provider Loading
```
UserProvider (root, always)
├── FeatureFlagProvider (always)
└── CartProvider (ONLY on /shop, /cart, /checkout routes)
```
- `CartProvider` via `ConditionalProviders` component reduces overhead
- Access via hooks: `useUser()`, `useCart()`, `useFeatureFlag()`
- **Test pattern**: Mock hooks, NOT providers

### Authentication & Tokens
- Token stored in **both** localStorage (JS access) AND cookies (middleware)
- **Token refresh flow** (401 → queue requests → refresh → retry with new token)
- Protected routes: `/account/*`, `/shop/checkout`, `/story/create`, `/story/edit`
- Middleware redirects to `/login?redirect={originalPath}`

### Anonymous Cart
- `anonymous_cart_id` cookie (30-day expiry)
- Sent via `X-Anonymous-Cart-ID` header
- Merged on login

### API Layer (`src/services/api.tsx`)
- Auto token refresh on 401 with request queue
- Transforms errors to `StandardErrorResponse`
- **Services are singleton objects** (NOT classes): `export const shopService = { ... }`

### Service Modules (`src/services/`)
- `shopService.ts` - Cart, checkout, orders
- `userService.ts` - Profile, addresses
- `loginService.tsx` - Auth, phone verification
- `blogService.tsx`, `storyService.tsx`, `featureFlagService.ts`, `searchService.ts`

### Error Handling
- Backend → `StandardErrorResponse` with `code`, `message`, `severity`
- Error codes: `src/types/error.ts`
- Persian messages: `src/constants/errorMessages.ts`
- Services throw, components catch + display

## Type Definitions (`src/types/`)
- `shop.ts`, `error.ts`, `story.ts`, `search.ts`, `canvas.ts`
- `images.d.ts` for static imports
- Canvas types for Fabric.js (extend if needed)

## Testing (MANDATORY for new code)
- **MSW** for API mocking
- Mock context **hooks**, not providers
- Test organization: `__tests__/unit/`, `__tests__/integration/`, `__tests__/components/`
- Co-located tests: `ComponentName.test.tsx` next to component
- Target: 90% coverage

## Key Files
- `src/services/api.tsx` - Token refresh, interceptors
- `src/middleware.ts` - Route protection
- `src/contexts/UserContext.tsx`, `CartContext.tsx`
- `src/components/ConditionalProviders.tsx` - Path-based provider loading
- `TESTING_STRATEGY.md`

## Environment
- `NEXT_PUBLIC_BASE_URL` - API base (default `/api`)
- Prod API: `https://derakht.darkube.app/api/`
- Docker: Standalone build, Nginx → Node.js:3000

## Workflow
1. Create branch: `feature/`, `fix/`, `refactor/`, `chore/`
2. Commit messages: `type(scope): description` - **NEVER mention "co-authored-by" or tool used**
3. Create PR (< 400 lines preferred)

## Pre-PR Checklist
- [ ] No `any` types (errors, props, services, canvas)
- [ ] Error handling: `catch (error)` → `as StandardErrorResponse`
- [ ] Component has `index.ts` barrel export
- [ ] Component has test file
- [ ] SCSS matches component name (PascalCase)
- [ ] Imports ordered correctly (styles last)
- [ ] Persian text for all UI
- [ ] No ESLint/TS errors, `pnpm build` succeeds

## Common Gotchas
1. Error handling: `catch (error)` NOT `catch (error: any)`
2. SCSS naming: `StoryCard.module.scss` NOT `storyCard.module.scss`
3. Styles imported last
4. Every component dir needs `index.ts`
5. New components need tests before PR
6. Anonymous cart: `anonymous_cart_id` cookie
7. Tokens in localStorage AND cookies
8. CartProvider only loads on shop routes
9. Services are objects, not classes
10. Canvas: use `@/types/canvas.ts` types
11. Navigation: pages must exist or be documented as planned
12. Persian for UI, English for code
13. Combine duplicate imports from same library
