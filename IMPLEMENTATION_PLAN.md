# Implementation Plan - Derakht Frontend Improvements

**Created**: 2026-01-08
**Based on**: Comprehensive Codebase Audit
**Scope**: Systematic improvements to meet CLAUDE.md standards and achieve 90% test coverage
**Issue Size**: Each issue changes ≤400 lines of code

---

## Overview

This plan addresses critical gaps in:
- Testing coverage (15% → 90%)
- Type safety (16 files with `any` → 0)
- Convention compliance (missing index.ts, co-located tests)
- Production security (console logs, XSS, missing middleware)
- Performance optimization (bundle size, image optimization)
- Accessibility (ARIA labels, keyboard navigation)

**Total Issues**: 47
**Estimated Timeline**: 8-10 weeks (2 developers)
**Priority Order**: Critical → High → Medium → Low

---

## Phase 1: Critical Security & Production Issues (Week 1-2)

### Issue #1: Remove Production Console Logs from API Proxy Route
**Priority**: CRITICAL
**Estimated LOC**: ~50 lines

**Files to Edit**:
- `/src/app/api/[...path]/route.ts`

**Reason**:
Currently logs all API requests, responses, headers, and URLs in production. This leaks sensitive data (tokens, user data, payment info) and creates security vulnerabilities.

**How to Fix**:
1. Remove or wrap ALL console.log/warn/error statements in conditional checks
2. Only log in development environment: `if (process.env.NODE_ENV === 'development')`
3. Specifically remove logs at lines 66-78 (request logging) and 111-113 (response logging)
4. Keep only critical error logs that don't expose sensitive data
5. Consider implementing a proper logging service instead

**Acceptance Criteria**:
- No console output in production builds
- Development logs remain for debugging
- Error tracking still functional

---

### Issue #2: Remove Production Console Logs from API Service
**Priority**: CRITICAL
**Estimated LOC**: ~80 lines

**Files to Edit**:
- `/src/services/api.tsx`

**Reason**:
Contains 22 console.log statements that log tokens, request details, and sensitive authentication data. Major security risk in production.

**How to Fix**:
1. Remove or wrap all console.log statements in development checks
2. Pay special attention to token refresh logic (avoid logging tokens)
3. Remove request/response logging that exposes user data
4. Keep error logs but sanitize sensitive information
5. Consider using a structured logging approach

**Acceptance Criteria**:
- No token or sensitive data logged in production
- Error tracking remains functional
- Token refresh flow works without logging

---

### Issue #3: Create Development-Only Logger Utility
**Priority**: HIGH
**Estimated LOC**: ~100 lines

**Files to Create**:
- `/src/utils/logger.ts`
- `/src/utils/logger.test.ts`

**Files to Edit** (in subsequent issues):
- All files using console.log (will be gradual replacement)

**Reason**:
Need a centralized logging utility that automatically prevents logs in production and provides structured logging capabilities.

**How to Implement**:
1. Create logger utility with methods: `log`, `warn`, `error`, `debug`
2. Each method checks `process.env.NODE_ENV` before logging
3. Add optional log levels and categorization
4. Support structured logging with context objects
5. Provide no-op functions in production
6. Write comprehensive tests for all logging scenarios

**Acceptance Criteria**:
- Logger only outputs in development
- All log levels supported
- Type-safe interface
- 100% test coverage

---

### Issue #4: Create Server-Side Route Protection Middleware
**Priority**: CRITICAL
**Estimated LOC**: ~150 lines

**Files to Create**:
- `/middleware.ts` (root level)
- `/middleware.test.ts`

**Reason**:
CLAUDE.md specifies middleware for route protection, but it doesn't exist. Currently only client-side redirects exist, which can be bypassed. Need server-side protection for authenticated routes.

**How to Implement**:
1. Create middleware at root level (Next.js 15 convention)
2. Define protected routes: `/account/*`, `/shop/checkout`, `/story/create`, `/story/edit/*`
3. Check for valid JWT token in cookies
4. Redirect unauthenticated users to `/login?redirect={originalPath}`
5. Handle anonymous cart routes appropriately
6. Verify token validity (basic check, not full verification)
7. Add proper TypeScript types for middleware
8. Write tests covering all route scenarios

**Acceptance Criteria**:
- Protected routes require authentication
- Proper redirects with return path
- Anonymous users can access public routes
- No performance impact on public pages
- Tests cover authenticated, unauthenticated, and edge cases

---

### Issue #5: Implement XSS Sanitization for CMS Content
**Priority**: CRITICAL
**Estimated LOC**: ~120 lines

**Files to Install**:
- Add `dompurify` and `@types/dompurify` packages

**Files to Create**:
- `/src/utils/sanitize.ts`
- `/src/utils/sanitize.test.ts`

**Files to Edit**:
- `/src/components/blog/BlogDetails.tsx`
- `/src/app/blog/[id]/page.tsx`
- `/src/app/shop/[slug]/ProductDetailsPageClient.tsx`
- `/src/components/product-info/ProductInfoDetails.tsx`
- `/src/app/blog/page.tsx`
- `/src/app/blog/category/[slug]/page.tsx`

**Reason**:
8 files use `dangerouslySetInnerHTML` without sanitization. While content comes from trusted CMS, defense-in-depth requires sanitization to prevent XSS if CMS is compromised.

**How to Implement**:
1. Install dompurify: `pnpm add dompurify @types/dompurify`
2. Create sanitize utility with DOMPurify configuration
3. Configure allowed tags/attributes for blog content vs product descriptions
4. Create `useSanitizedHTML` hook for convenient usage
5. Replace all `dangerouslySetInnerHTML` with sanitized versions
6. Write tests with XSS attack vectors
7. Keep static content (about, home) unsanitized (low risk)

**Acceptance Criteria**:
- All CMS content sanitized before rendering
- XSS attack vectors blocked (script tags, event handlers, etc.)
- Valid HTML preserved (formatting, links, images)
- Tests verify XSS protection
- No visual changes to legitimate content

---

### Issue #6: Move Backend URL to Environment Variable
**Priority**: HIGH
**Estimated LOC**: ~30 lines

**Files to Edit**:
- `/src/app/api/[...path]/route.ts`
- `/.env.example`
- `/.env.local` (if exists)

**Reason**:
Backend URL is hardcoded on line 5. Should use environment variable for flexibility across environments (dev, staging, prod).

**How to Fix**:
1. Add `BACKEND_API_URL` to `.env.example` with production URL
2. Update route.ts to use `process.env.BACKEND_API_URL`
3. Add fallback to current hardcoded URL for backward compatibility
4. Add validation that environment variable is set
5. Update deployment documentation if needed

**Acceptance Criteria**:
- No hardcoded URLs in code
- Environment variable properly configured
- Works in all environments (local, Docker, production)
- Clear error if environment variable missing

---

## Phase 2: Convention Compliance - Barrel Exports (Week 2-3)

### Issue #7: Add index.ts to /src/components/account/
**Priority**: HIGH
**Estimated LOC**: ~30 lines

**Files to Create**:
- `/src/components/account/index.ts`

**Files in Directory**:
- `AccountDashboard.tsx`
- `ProfileManagement.tsx`
- `OrderHistory.tsx`
- `AddressManagement.tsx`
- `PasswordChange.tsx`

**Reason**:
CLAUDE.md mandates: "Every component directory MUST have index.ts". Enables barrel exports pattern and cleaner imports.

**How to Implement**:
1. Create index.ts with exports for all components
2. Export both components and their prop types
3. Follow pattern: `export { Component } from './Component'; export type { ComponentProps } from './Component';`
4. Update imports in consuming files to use barrel exports
5. Verify no circular dependencies created

**Acceptance Criteria**:
- All components exported from index.ts
- All prop types exported
- Consuming files can import from directory
- No build errors or circular dependencies

---

### Issue #8: Add index.ts to /src/components/blog/
**Priority**: HIGH
**Estimated LOC**: ~40 lines

**Files to Create**:
- `/src/components/blog/index.ts`

**Files in Directory**:
- `BlogCard.tsx`
- `BlogDetails.tsx`
- `BlogList.tsx`
- `BlogPostClient.tsx`
- `BlogSidebar.tsx`
- `CategoryFilter.tsx`
- `TagList.tsx`

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for all blog components.

**Acceptance Criteria**:
Same as Issue #7.

---

### Issue #9: Add index.ts to /src/components/checkout/
**Priority**: HIGH
**Estimated LOC**: ~30 lines

**Files to Create**:
- `/src/components/checkout/index.ts`

**Files in Directory**:
- `CheckoutPage.tsx`
- `CheckoutForm.tsx`
- `OrderSummary.tsx`
- `PaymentMethods.tsx`
- `ShippingAddressSelector.tsx`

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for all checkout components.

**Acceptance Criteria**:
Same as Issue #7.

---

### Issue #10: Add index.ts to /src/components/illustration/
**Priority**: HIGH
**Estimated LOC**: ~35 lines

**Files to Create**:
- `/src/components/illustration/index.ts`

**Files in Directory**:
- `AssetsPanel.tsx`
- `ColorPicker.tsx`
- `DrawingCanvas.tsx`
- `DrawingToolbar.tsx`
- `IllustrationEditor.tsx`
- (possibly more)

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for all illustration components.

**Acceptance Criteria**:
Same as Issue #7.

---

### Issue #11: Add index.ts to /src/components/story/
**Priority**: HIGH
**Estimated LOC**: ~50 lines

**Files to Create**:
- `/src/components/story/index.ts`

**Files in Directory**:
- `StoryCard.tsx`
- `StoryEditorV2.tsx`
- `StoryList.tsx`
- `StoryModal.tsx`
- `StoryPreviewV2.tsx`
- `TextCanvasEditor.tsx`
- `TextCanvasViewer.tsx`
- `IllustrationCanvasEditor.tsx`
- (possibly more)

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for all story components.

**Acceptance Criteria**:
Same as Issue #7.

---

### Issue #12: Add index.ts to /src/components/shop/
**Priority**: HIGH
**Estimated LOC**: ~40 lines

**Files to Create**:
- `/src/components/shop/index.ts`

**Files in Directory**:
- `CategoryNavigation.tsx`
- `ProductCard.tsx`
- `ProductFilters.tsx`
- `ProductGrid.tsx`
- `ProductList.tsx`
- `ShopPage.tsx`
- (possibly more)

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for all shop components.

**Acceptance Criteria**:
Same as Issue #7.

---

### Issue #13: Add index.ts to /src/components/login/
**Priority**: HIGH
**Estimated LOC**: ~20 lines

**Files to Create**:
- `/src/components/login/index.ts`

**Files in Directory**:
- `LoginPage.tsx`

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for login component.

**Acceptance Criteria**:
Same as Issue #7.

---

### Issue #14: Add index.ts to /src/components/product-info/
**Priority**: HIGH
**Estimated LOC**: ~25 lines

**Files to Create**:
- `/src/components/product-info/index.ts`

**Files in Directory**:
- `ProductInfo.tsx`
- `ProductInfoDetails.tsx`
- `ProductInfoList.tsx`

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for product-info components.

**Acceptance Criteria**:
Same as Issue #7.

---

### Issue #15: Add index.ts to /src/components/search/
**Priority**: HIGH
**Estimated LOC**: ~20 lines

**Files to Create**:
- `/src/components/search/index.ts`

**Files in Directory**:
- `SearchPage.tsx`
- `SearchResults.tsx`

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for search components.

**Acceptance Criteria**:
Same as Issue #7.

---

### Issue #16: Add index.ts to /src/components/admin/
**Priority**: HIGH
**Estimated LOC**: ~25 lines

**Files to Create**:
- `/src/components/admin/index.ts`

**Files in Directory**:
- `AdminDashboard.tsx`
- `TemplateEditor.tsx`
- `TemplateList.tsx`
- (possibly more)

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for admin components.

**Acceptance Criteria**:
Same as Issue #7.

---

### Issue #17: Add index.ts to /src/components/cart/
**Priority**: HIGH
**Estimated LOC**: ~25 lines

**Files to Create**:
- `/src/components/cart/index.ts`

**Files in Directory**:
- `CartPage.tsx`
- `CartItem.tsx`
- `CartSummary.tsx`

**Reason**:
Same as Issue #7 - CLAUDE.md convention compliance.

**How to Implement**:
Same pattern as Issue #7 for cart components.

**Acceptance Criteria**:
Same as Issue #7.

---

## Phase 3: Type Safety - Fix `any` Usage (Week 3-4)

### Issue #18: Fix TypeScript `any` in DrawingCanvas.tsx
**Priority**: HIGH
**Estimated LOC**: ~200 lines (canvas component with ~30 `any` instances)

**Files to Edit**:
- `/src/components/illustration/DrawingCanvas.tsx`

**Files to Reference**:
- `/src/types/canvas.ts` (use existing types)

**Reason**:
Component uses `any` for fabricCanvasRef and fabricLibRef (lines 55-56) and throughout canvas manipulation code. Violates CLAUDE.md requirement: "NEVER use `any`".

**How to Fix**:
1. Import types from `@/types/canvas.ts`: `FabricCanvas`, `FabricObject`
2. Type fabricCanvasRef as `useRef<FabricCanvas | null>(null)`
3. Type fabricLibRef as `useRef<typeof fabric | null>(null)` or create `FabricLib` type in canvas.ts
4. Type all canvas operation parameters and return values
5. Type event handlers with proper Fabric.js event types
6. Type image upload callbacks with proper file types
7. Add type guards where necessary for null checks
8. Update all function signatures to remove `any`

**Acceptance Criteria**:
- No `any` types remaining in file
- All refs properly typed
- All event handlers typed
- TypeScript strict mode passes
- No runtime errors
- Canvas functionality unchanged

---

### Issue #19: Fix TypeScript `any` in IllustrationCanvasEditor.tsx
**Priority**: HIGH
**Estimated LOC**: ~250 lines (complex canvas editor with multiple `any` instances)

**Files to Edit**:
- `/src/components/story/IllustrationCanvasEditor.tsx`

**Files to Reference**:
- `/src/types/canvas.ts`
- `/src/types/story.ts`

**Reason**:
Canvas and Fabric.js refs typed as `any`. Complex component with canvas manipulation, object handling, and state management all using loose types.

**How to Fix**:
1. Apply same typing strategy as Issue #18
2. Type canvas state management (selected objects, active tool, etc.)
3. Type canvas data serialization/deserialization
4. Type asset loading and image handling
5. Type toolbar callbacks and event handlers
6. Add proper types for canvas export functionality
7. Type props interface completely
8. Add JSDoc for complex operations

**Acceptance Criteria**:
Same as Issue #18 plus proper story/canvas data types integration.

---

### Issue #20: Fix TypeScript `any` in TextCanvasEditor.tsx
**Priority**: HIGH
**Estimated LOC**: ~200 lines

**Files to Edit**:
- `/src/components/story/TextCanvasEditor.tsx`

**Files to Reference**:
- `/src/types/canvas.ts`
- `/src/types/story.ts`

**Reason**:
Text canvas manipulation uses `any` for canvas objects and text handling.

**How to Fix**:
1. Type canvas ref with `FabricCanvas`
2. Type text objects with proper Fabric text types (IText, Textbox)
3. Type text styling operations (font, color, alignment)
4. Type canvas save/load operations
5. Type event handlers for text editing
6. Add proper return types for all methods
7. Type text validation and constraints

**Acceptance Criteria**:
Same as Issue #18 with focus on text-specific operations.

---

### Issue #21: Fix TypeScript `any` in TextCanvasViewer.tsx
**Priority**: HIGH
**Estimated LOC**: ~150 lines

**Files to Edit**:
- `/src/components/story/TextCanvasViewer.tsx`

**Files to Reference**:
- `/src/types/canvas.ts`

**Reason**:
Read-only canvas viewer uses `any` for canvas object display.

**How to Fix**:
1. Type canvas ref with `FabricCanvas`
2. Type canvas loading and rendering
3. Type canvas data deserialization
4. Type display-only operations
5. Ensure no editing operations possible (type-level safety)
6. Type responsive canvas sizing

**Acceptance Criteria**:
Same as Issue #18, simpler due to read-only nature.

---

### Issue #22: Fix TypeScript `any` in StoryEditorV2.tsx
**Priority**: HIGH
**Estimated LOC**: ~300 lines (large file, multiple `any` instances in event handlers)

**Files to Edit**:
- `/src/components/story/StoryEditorV2.tsx`

**Files to Reference**:
- `/src/types/story.ts`
- `/src/types/canvas.ts`

**Reason**:
Event handlers and state management use `any`. Complex component with many moving parts requiring proper typing.

**How to Fix**:
1. Type all event handlers (page navigation, canvas switching, save operations)
2. Type state management properly (story data, layout, pages)
3. Type refs for canvas components
4. Type callback props passed to child components
5. Type API response handling
6. Type error states and recovery
7. Add proper types for layout system (LayoutType, PageLayout, etc.)
8. Document complex state interactions with JSDoc

**Acceptance Criteria**:
- No `any` types in file
- All state properly typed
- All event handlers typed
- Complex state transitions type-safe
- No functionality changes

---

### Issue #23: Fix TypeScript `any` in Template Editor Files
**Priority**: MEDIUM
**Estimated LOC**: ~200 lines across 2 files

**Files to Edit**:
- `/src/app/admin/templates/[id]/edit/EditTemplatePageClient.tsx`
- `/src/app/admin/templates/new/page.tsx`

**Files to Create/Update**:
- `/src/types/story.ts` (add `TemplateEditData`, `TemplateFormData` interfaces)

**Reason**:
Template editing and creation use `any` for form data and template structures.

**How to Fix**:
1. Define `TemplateEditData` interface in story.ts
2. Define `TemplateFormData` interface in story.ts
3. Type form submission handlers
4. Type template validation
5. Type API responses for template operations
6. Type error handling for template operations
7. Type file uploads for template assets

**Acceptance Criteria**:
- New interfaces defined in types
- No `any` in template files
- Form validation type-safe
- Tests updated if needed

---

### Issue #24: Fix TypeScript `any` in Remaining Files
**Priority**: MEDIUM
**Estimated LOC**: ~150 lines across remaining files

**Files to Edit**:
- `/src/app/story/[id]/edit/page.tsx`
- `/src/services/shopService.ts` (line 245)
- `/src/components/shop/CategoryNavigation.tsx`
- `/src/components/blog/BlogPostClient.tsx` (low priority)
- `/src/app/shop/[slug]/ProductDetailsPageClient.tsx` (low priority)

**Reason**:
Remaining `any` usage scattered across various files, mostly in error handling and state management.

**How to Fix**:
1. Story edit page: Use `StandardErrorResponse` for errors, proper story types
2. shopService: Fix error handling catch block (line 245)
3. CategoryNavigation: Define `NavigationState` interface
4. Other files: Already have proper types, just need to remove `any` casts

**Acceptance Criteria**:
- Zero `any` usage across entire codebase
- ESLint `no-explicit-any` rule violations removed from config (lines 18-37)
- All TypeScript strict mode enabled
- Full project builds without type errors

---

## Phase 4: Testing - Critical Components (Week 4-6)

### Issue #25: Add Tests for StoryEditorV2 Component
**Priority**: CRITICAL
**Estimated LOC**: ~400 lines (comprehensive test suite)

**Files to Create**:
- `/src/components/story/StoryEditorV2.test.tsx`

**Files to Reference**:
- `/src/components/story/StoryEditorV2.tsx`
- `/__tests__/setup/msw-handlers.ts` (add story API mocks)

**Reason**:
Core feature component (1000+ lines) with 0% test coverage. Critical for story creation flow.

**How to Test**:
1. **Rendering tests**: Initial load, different layouts, page navigation
2. **State management tests**: Story data updates, page creation/deletion, layout switching
3. **Canvas integration tests**: Text canvas switching, illustration canvas loading
4. **Save functionality tests**: Auto-save, manual save, save errors, retry logic
5. **User interactions tests**: Navigation, toolbar actions, modal interactions
6. **Error handling tests**: API failures, validation errors, recovery
7. **Props variation tests**: Different initial states, permissions, modes
8. Mock all child components (canvas editors, toolbars) to test in isolation
9. Use MSW for API mocking
10. Mock useRouter for navigation testing

**Acceptance Criteria**:
- 90%+ coverage for StoryEditorV2
- All critical paths tested
- All user interactions tested
- Error scenarios covered
- Tests pass consistently
- No flaky tests

---

### Issue #26: Add Tests for DrawingCanvas Component
**Priority**: CRITICAL
**Estimated LOC**: ~350 lines

**Files to Create**:
- `/src/components/illustration/DrawingCanvas.test.tsx`

**Files to Reference**:
- `/src/components/illustration/DrawingCanvas.tsx`

**Reason**:
Critical canvas manipulation component with complex Fabric.js integration. 0% coverage.

**How to Test**:
1. **Canvas initialization tests**: Canvas creation, Fabric.js loading, setup
2. **Drawing tool tests**: Brush, eraser, color selection, brush size
3. **Image upload tests**: File selection, image loading, image placement, drag/resize
4. **Canvas operations tests**: Clear, undo, redo, export
5. **Event handling tests**: Mouse events, touch events, keyboard shortcuts
6. **State management tests**: Active tool, selected objects, canvas history
7. **Error handling tests**: Invalid files, upload failures, canvas errors
8. Mock Fabric.js library to avoid actual canvas rendering in tests
9. Test file upload flow with mock File objects
10. Test responsive canvas sizing

**Acceptance Criteria**:
- 90%+ coverage
- All drawing tools tested
- Image upload flow covered
- Canvas operations verified
- Mock Fabric.js properly
- Tests are fast (no actual rendering)

---

### Issue #27: Add Tests for CheckoutPage Component
**Priority**: CRITICAL
**Estimated LOC**: ~400 lines

**Files to Create**:
- `/src/components/checkout/CheckoutPage.test.tsx`

**Files to Reference**:
- `/src/components/checkout/CheckoutPage.tsx`
- `/__tests__/setup/msw-handlers.ts` (add checkout API mocks)

**Reason**:
Payment flow component handling money transactions. Must have comprehensive tests. 0% coverage.

**How to Test**:
1. **Form validation tests**: Address validation, contact info, required fields
2. **Address selection tests**: Existing addresses, new address, address switching
3. **Payment method tests**: Different payment options, selection
4. **Order summary tests**: Cart items display, totals calculation, discounts
5. **Submission flow tests**: Form submit, API call, payment redirect, success/failure
6. **Error handling tests**: Validation errors, API errors, payment errors
7. **State management tests**: Form state, loading states, error states
8. **Anonymous cart tests**: Guest checkout flow
9. **Authenticated user tests**: Saved addresses, profile data
10. Mock payment gateway redirect
11. Mock cart context
12. Use MSW for API mocking

**Acceptance Criteria**:
- 90%+ coverage
- All payment flows tested
- Address management covered
- Error scenarios handled
- Mock payment gateway
- No actual API calls in tests

---

### Issue #28: Add Tests for LoginPage Component
**Priority**: HIGH
**Estimated LOC**: ~300 lines

**Files to Create**:
- `/src/components/login/LoginPage.test.tsx`

**Files to Reference**:
- `/src/components/login/LoginPage.tsx`
- `/__tests__/setup/msw-handlers.ts` (add auth API mocks)

**Reason**:
Authentication flow component. Critical for user access. 0% coverage.

**How to Test**:
1. **Phone number validation tests**: Format validation, Persian digits handling
2. **OTP request tests**: Submit phone, receive OTP, error handling
3. **OTP verification tests**: Enter OTP, verify, success/failure
4. **Token handling tests**: Token storage, cookie setting, redirect after login
5. **Anonymous cart merge tests**: Cart merge on login
6. **Error handling tests**: Invalid phone, invalid OTP, network errors
7. **Redirect tests**: Return to original page after login
8. **State management tests**: Form state, loading states, steps
9. Mock useUser context
10. Mock useCart context
11. Use MSW for authentication API

**Acceptance Criteria**:
- 90%+ coverage
- Full auth flow tested
- OTP flow covered
- Cart merge verified
- Redirect logic tested
- Mock contexts properly

---

### Issue #29: Add Tests for ProfileManagement Component
**Priority**: HIGH
**Estimated LOC**: ~300 lines

**Files to Create**:
- `/src/components/account/ProfileManagement.test.tsx`

**Files to Reference**:
- `/src/components/account/ProfileManagement.tsx`
- `/__tests__/setup/msw-handlers.ts` (add user API mocks)

**Reason**:
User data management component. Handles sensitive personal information. 0% coverage.

**How to Test**:
1. **Profile display tests**: Load and display user data
2. **Edit mode tests**: Switch to edit, form population
3. **Form validation tests**: Required fields, format validation, Persian text
4. **Update flow tests**: Submit changes, API call, success/error
5. **Avatar upload tests**: Image selection, upload, preview
6. **Password change tests**: Validation, submission, security
7. **Error handling tests**: API errors, validation errors, upload errors
8. **State management tests**: View/edit modes, loading states
9. Mock useUser context
10. Use MSW for profile API

**Acceptance Criteria**:
- 90%+ coverage
- Profile CRUD operations tested
- Image upload covered
- Validation tested
- Security checks verified

---

### Issue #30: Add Tests for CartPage Component
**Priority**: HIGH
**Estimated LOC**: ~300 lines

**Files to Create**:
- `/src/components/cart/CartPage.test.tsx`

**Files to Reference**:
- `/src/components/cart/CartPage.tsx`
- `/__tests__/setup/msw-handlers.ts` (add cart API mocks)

**Reason**:
Shopping cart management. Critical for e-commerce flow. 0% coverage.

**How to Test**:
1. **Cart display tests**: Empty cart, cart with items, loading states
2. **Quantity updates tests**: Increase/decrease quantity, validation
3. **Remove item tests**: Remove single item, remove all
4. **Price calculations tests**: Item totals, cart subtotal, discounts
5. **Checkout navigation tests**: Proceed to checkout, auth checks
6. **Anonymous cart tests**: Anonymous user flow
7. **Authenticated cart tests**: Logged-in user flow
8. **Error handling tests**: Update failures, remove failures, API errors
9. Mock useCart context
10. Mock useUser context
11. Use MSW for cart API

**Acceptance Criteria**:
- 90%+ coverage
- Cart operations tested
- Price calculations verified
- Auth scenarios covered
- Error handling tested

---

### Issue #31: Add Tests for Navbar Component
**Priority**: HIGH
**Estimated LOC**: ~250 lines

**Files to Create**:
- `/src/components/shared/Navbar/Navbar.test.tsx`

**Files to Reference**:
- `/src/components/shared/Navbar/Navbar.tsx`

**Reason**:
Main navigation component with auth state, cart display, search. Visible on all pages. Minimal test coverage.

**How to Test**:
1. **Rendering tests**: Authenticated vs anonymous, different screen sizes
2. **Navigation tests**: Links, dropdowns, mobile menu
3. **Auth state tests**: Login/logout display, profile menu
4. **Cart display tests**: Cart count badge, cart dropdown
5. **Search integration tests**: Search bar, search submission
6. **Responsive tests**: Mobile menu, hamburger icon, drawer
7. **User interactions tests**: Hover states, click events, keyboard navigation
8. Mock useUser context
9. Mock useCart context
10. Mock useRouter for navigation

**Acceptance Criteria**:
- 90%+ coverage
- All navigation paths tested
- Auth states covered
- Cart integration verified
- Responsive behavior tested
- Accessibility verified

---

## Phase 5: Testing - Services (Week 6-7)

### Issue #32: Complete Tests for shopService
**Priority**: HIGH
**Estimated LOC**: ~350 lines

**Files to Create**:
- `/src/services/shopService.test.ts` (if not exists) or expand existing

**Files to Reference**:
- `/src/services/shopService.ts`
- `/__tests__/setup/msw-handlers.ts` (expand shop API mocks)

**Reason**:
Core service for e-commerce operations. Currently 8% overall service coverage.

**How to Test**:
1. **Cart operations**: Add to cart, update quantity, remove item, clear cart
2. **Product operations**: Fetch products, fetch product details, search, filter
3. **Category operations**: Fetch categories, category products
4. **Checkout operations**: Create order, request payment, verify payment
5. **Order operations**: Fetch orders, order details, order history
6. **Address operations**: CRUD operations for shipping addresses
7. **Error handling**: Network errors, validation errors, API errors
8. **Anonymous cart**: Anonymous cart ID header handling
9. **Token refresh**: Test with expired tokens
10. Use MSW for all API mocking
11. Test response transformations
12. Test error mapping to StandardErrorResponse

**Acceptance Criteria**:
- 90%+ coverage for shopService
- All API endpoints tested
- Error scenarios covered
- Anonymous cart flow tested
- Token refresh tested
- Response transformations verified

---

### Issue #33: Complete Tests for storyService
**Priority**: HIGH
**Estimated LOC**: ~300 lines

**Files to Create**:
- `/src/services/storyService.test.ts`

**Files to Reference**:
- `/src/services/storyService.tsx`
- `/__tests__/setup/msw-handlers.ts` (add story API mocks)

**Reason**:
Core service for story creation feature. No test coverage.

**How to Test**:
1. **Template operations**: Fetch templates, template details, template search
2. **Story CRUD operations**: Create, read, update, delete stories
3. **Story page operations**: Add page, update page, delete page, reorder pages
4. **Canvas operations**: Save canvas data, load canvas data
5. **Image upload operations**: Upload images, progress tracking, image management
6. **Story completion**: Mark complete, publish, unpublish
7. **Error handling**: Upload failures, save failures, validation errors
8. **Progress tracking**: Upload progress callbacks
9. Use MSW for API mocking
10. Mock file uploads with progress events
11. Test authentication requirements

**Acceptance Criteria**:
- 90%+ coverage for storyService
- All story operations tested
- Image upload flow covered
- Progress tracking verified
- Error handling tested
- Canvas data serialization tested

---

### Issue #34: Complete Tests for userService
**Priority**: HIGH
**Estimated LOC**: ~250 lines

**Files to Create**:
- `/src/services/userService.test.ts`

**Files to Reference**:
- `/src/services/userService.ts`
- `/__tests__/setup/msw-handlers.ts` (add user API mocks)

**Reason**:
Handles user profile and authentication. No test coverage.

**How to Test**:
1. **Profile operations**: Get profile, update profile, avatar upload
2. **Address operations**: CRUD for user addresses
3. **Password operations**: Change password, reset password
4. **Authentication state**: Token validation, user data fetching
5. **Error handling**: API errors, validation errors, upload errors
6. **Response transformations**: Data mapping, error mapping
7. Use MSW for API mocking
8. Test file upload for avatar
9. Test authentication requirements
10. Test data validation

**Acceptance Criteria**:
- 90%+ coverage for userService
- All user operations tested
- Avatar upload covered
- Error scenarios tested
- Data transformations verified

---

### Issue #35: Complete Tests for loginService
**Priority**: MEDIUM
**Estimated LOC**: ~200 lines (expand existing tests)

**Files to Edit**:
- `/__tests__/services/loginService.test.tsx`

**Files to Reference**:
- `/src/services/loginService.tsx`

**Reason**:
Currently has some tests (100% service coverage) but need to verify comprehensive coverage.

**How to Expand**:
1. Verify OTP request flow fully covered
2. Verify OTP verification fully covered
3. Test token storage (localStorage + cookies)
4. Test error scenarios comprehensively
5. Test phone number validation edge cases
6. Test Persian digit handling
7. Test token refresh integration
8. Add edge cases and error paths
9. Test retry logic if exists
10. Verify MSW handlers comprehensive

**Acceptance Criteria**:
- Maintain 90%+ coverage
- All edge cases covered
- Error scenarios tested
- Token handling verified
- Integration with auth flow tested

---

### Issue #36: Add Tests for blogService
**Priority**: MEDIUM
**Estimated LOC**: ~200 lines

**Files to Create**:
- `/src/services/blogService.test.ts`

**Files to Reference**:
- `/src/services/blogService.tsx`
- `/__tests__/setup/msw-handlers.ts` (add blog API mocks)

**Reason**:
Blog content fetching service. No test coverage.

**How to Test**:
1. **Post operations**: Fetch posts, post details, post by slug
2. **Category operations**: Fetch categories, posts by category
3. **Tag operations**: Fetch tags, posts by tag
4. **Search operations**: Blog search functionality
5. **Pagination operations**: Page navigation, load more
6. **Error handling**: 404s, network errors, API errors
7. Use MSW for API mocking
8. Test response parsing (Wagtail CMS format)
9. Test caching if implemented
10. Test filter combinations

**Acceptance Criteria**:
- 90%+ coverage for blogService
- All blog operations tested
- Wagtail integration verified
- Error handling tested
- Pagination tested

---

### Issue #37: Add Tests for searchService
**Priority**: MEDIUM
**Estimated LOC**: ~150 lines

**Files to Create**:
- `/src/services/searchService.test.ts`

**Files to Reference**:
- `/src/services/searchService.ts`
- `/__tests__/setup/msw-handlers.ts` (add search API mocks)

**Reason**:
Global search functionality. No test coverage.

**How to Test**:
1. **Search operations**: General search, filtered search, autocomplete
2. **Result types**: Products, stories, blog posts
3. **Pagination**: Search result pagination
4. **Filtering**: Category filters, type filters
5. **Sorting**: Relevance, date, popularity
6. **Error handling**: Empty results, API errors, invalid queries
7. Use MSW for API mocking
8. Test debouncing if implemented
9. Test query sanitization
10. Test result parsing

**Acceptance Criteria**:
- 90%+ coverage for searchService
- All search types tested
- Filtering/sorting tested
- Error handling covered
- Performance considerations tested

---

### Issue #38: Add Tests for featureFlagService
**Priority**: LOW
**Estimated LOC**: ~100 lines

**Files to Create**:
- `/src/services/featureFlagService.test.ts`

**Files to Reference**:
- `/src/services/featureFlagService.ts`

**Reason**:
Feature flag system. Should have tests for proper flag evaluation.

**How to Test**:
1. **Flag fetching**: Get all flags, get specific flag
2. **Flag evaluation**: Boolean flags, string flags, number flags
3. **Default values**: Fallback when flag not found
4. **Caching**: Flag cache behavior
5. **Error handling**: API errors, invalid flags
6. Use MSW for API mocking
7. Test flag override logic if exists
8. Test environment-specific flags
9. Test flag refresh

**Acceptance Criteria**:
- 90%+ coverage for featureFlagService
- All flag types tested
- Caching verified
- Error handling tested
- Default behavior verified

---

## Phase 6: Testing - E2E Critical Flows (Week 7-8)

### Issue #39: Add E2E Tests for Story Creation Flow
**Priority**: HIGH
**Estimated LOC**: ~300 lines

**Files to Create**:
- `/__tests__/e2e/story-creation.spec.ts`

**Files to Reference**:
- `/src/app/story/create/page.tsx`
- `/src/components/story/StoryEditorV2.tsx`

**Reason**:
Critical user flow for primary feature. Needs end-to-end verification.

**How to Test**:
1. **Template selection**: Browse templates, select template, proceed
2. **Story creation**: Enter story details, customize pages
3. **Text editing**: Add text to text pages, formatting, save
4. **Illustration editing**: Draw on illustration pages, upload images, colors
5. **Page navigation**: Navigate between pages, reorder pages
6. **Save/autosave**: Manual save, autosave behavior, draft recovery
7. **Story completion**: Mark complete, view finished story
8. **Error recovery**: Handle API errors, retry, resume
9. Use Playwright or Cypress
10. Mock API where appropriate or use test database
11. Test with real canvas interactions
12. Test file upload flows

**Acceptance Criteria**:
- Complete flow from template to finished story
- All editing features tested
- Canvas interactions verified
- Save functionality tested
- Error scenarios covered
- Tests are reliable and not flaky

---

### Issue #40: Add E2E Tests for Payment Flow
**Priority**: HIGH
**Estimated LOC**: ~300 lines

**Files to Create**:
- `/__tests__/e2e/payment-flow.spec.ts`

**Files to Reference**:
- `/src/components/shop/` (product browsing)
- `/src/components/cart/CartPage.tsx`
- `/src/components/checkout/CheckoutPage.tsx`

**Reason**:
Critical e-commerce flow handling money. Must be tested end-to-end.

**How to Test**:
1. **Product browsing**: Browse products, view details, select product
2. **Add to cart**: Add items, update quantities, view cart
3. **Cart management**: Update cart, apply discounts, proceed to checkout
4. **Address entry**: Select/create shipping address, validate
5. **Payment method**: Select payment method
6. **Order creation**: Submit order, create payment request
7. **Payment gateway**: Mock Zarinpal redirect, callback handling
8. **Payment verification**: Verify payment, create invoice, show success
9. **Order confirmation**: View order details, order history
10. Use Playwright or Cypress
11. Mock payment gateway (don't make real payments)
12. Test both authenticated and anonymous flows
13. Test error scenarios (payment failure, timeout, etc.)

**Acceptance Criteria**:
- Complete purchase flow tested
- All payment scenarios covered
- Anonymous and authenticated flows
- Error handling verified
- No real payments made
- Tests are reliable

---

### Issue #41: Add E2E Tests for Anonymous Cart Merge
**Priority**: MEDIUM
**Estimated LOC**: ~200 lines

**Files to Create**:
- `/__tests__/e2e/cart-merge.spec.ts`

**Files to Reference**:
- `/src/contexts/CartContext.tsx`
- `/src/components/login/LoginPage.tsx`

**Reason**:
Important UX feature - anonymous cart should merge on login.

**How to Test**:
1. **Anonymous cart creation**: Add items as anonymous user
2. **Verify anonymous cart**: Check cart ID cookie, verify items
3. **Login flow**: Login while having anonymous cart
4. **Cart merge**: Verify items from anonymous cart merged to user cart
5. **Duplicate handling**: Test merging duplicate items (quantity update)
6. **Verify cookie cleanup**: Anonymous cart cookie removed after merge
7. **Verify persistence**: User cart persists across logout/login
8. Use Playwright or Cypress
9. Test with multiple items and quantities
10. Test edge cases (empty carts, identical items)

**Acceptance Criteria**:
- Anonymous cart merges correctly on login
- No items lost during merge
- Duplicate items handled properly
- Cookies managed correctly
- Flow is seamless for user

---

## Phase 7: Performance Optimization (Week 8-9)

### Issue #42: Implement Code Splitting for Fabric.js
**Priority**: HIGH
**Estimated LOC**: ~150 lines across multiple files

**Files to Edit**:
- `/src/components/illustration/DrawingCanvas.tsx`
- `/src/components/story/IllustrationCanvasEditor.tsx`
- `/src/components/story/TextCanvasEditor.tsx`
- `/src/components/story/TextCanvasViewer.tsx`
- `/next.config.js` (if needed)

**Reason**:
Fabric.js is ~500KB and loads on all pages. Should only load on canvas routes.

**How to Implement**:
1. Convert Fabric.js imports to dynamic imports
2. Use Next.js dynamic import: `import dynamic from 'next/dynamic'`
3. Create canvas component wrappers with loading states
4. Lazy load Fabric.js only when canvas components mount
5. Show loading spinner while Fabric.js loads
6. Add error boundary for failed loads
7. Optimize Fabric.js build (tree-shake unused features if possible)
8. Test bundle size reduction with webpack-bundle-analyzer
9. Verify no functionality broken
10. Test on slow networks to verify loading experience

**Acceptance Criteria**:
- Fabric.js not in initial bundle
- Canvas pages load Fabric.js dynamically
- Non-canvas pages don't load Fabric.js
- Loading states display properly
- No functionality broken
- Bundle size reduced by ~500KB for non-canvas routes
- Performance metrics improved (Lighthouse score)

---

### Issue #43: Optimize Images in /public Directory
**Priority**: HIGH
**Estimated LOC**: ~100 lines (config and component updates)

**Files to Edit**:
- All components using static images (convert to next/image)
- `/public/images/` (replace with optimized versions)
- `/next.config.js` (configure image optimization)

**Images to Optimize** (>100KB):
- `/public/images/about/kids-story.png`
- `/public/images/blogimage2.png`
- `/public/images/finishStory.jpg`
- `/public/images/header.jpg`
- `/public/images/home/*.png` (5 files)
- `/public/images/logo.jpg`

**Reason**:
18MB of static assets, many images not optimized. Slows page loads.

**How to Implement**:
1. Convert all large images to WebP format (use cwebp or image optimization tool)
2. Create multiple sizes for responsive loading (small, medium, large)
3. Replace `<img>` tags with Next.js `<Image>` component
4. Add proper width/height attributes
5. Configure image domains in next.config.js
6. Use placeholder blur for better UX
7. Implement lazy loading for below-fold images
8. Optimize logo and icons separately (consider SVG where appropriate)
9. Test visual quality after optimization
10. Measure improvement with Lighthouse

**Acceptance Criteria**:
- All large images converted to WebP
- Images load responsively (correct size for viewport)
- next/image used throughout
- Page load time improved
- Visual quality maintained
- Lighthouse performance score improved
- Total public folder size reduced by 50%+

---

### Issue #44: Add React.memo to Heavy Components
**Priority**: MEDIUM
**Estimated LOC**: ~200 lines across multiple files

**Files to Edit**:
- `/src/components/story/StoryPreviewV2.tsx`
- `/src/components/shop/ProductCard.tsx`
- `/src/components/cart/CartDropdown.tsx`
- `/src/components/shared/SearchBar.tsx`
- `/src/components/blog/BlogCard.tsx`
- `/src/components/illustration/DrawingCanvas.tsx`

**Reason**:
Heavy components re-render unnecessarily. No React.memo usage detected.

**How to Implement**:
1. Profile components with React DevTools Profiler
2. Identify components with expensive renders
3. Wrap identified components with React.memo
4. Add custom comparison functions where needed
5. Ensure props are stable (use useCallback for callbacks)
6. Memoize expensive calculations with useMemo
7. Verify re-render reduction with profiler
8. Ensure no functionality broken
9. Document why components are memoized
10. Add performance comments for future developers

**Acceptance Criteria**:
- Heavy components wrapped with React.memo
- Render count reduced (measured with profiler)
- Custom comparisons added where needed
- Props properly stabilized with useCallback/useMemo
- No functionality broken
- Performance improvement measurable
- Code documented

---

### Issue #45: Refactor StoryEditorV2 State to useReducer
**Priority**: MEDIUM
**Estimated LOC**: ~350 lines

**Files to Edit**:
- `/src/components/story/StoryEditorV2.tsx`

**Files to Create**:
- `/src/components/story/storyEditorReducer.ts` (new reducer file)
- `/src/components/story/storyEditorActions.ts` (action creators)
- `/src/types/story.ts` (add reducer types)

**Reason**:
Component has ~30 useState calls and complex state interactions. useReducer would simplify.

**How to Implement**:
1. Analyze current state structure and interactions
2. Design reducer state shape (consolidate related state)
3. Define action types for all state transitions
4. Create reducer function with all action handlers
5. Create action creator functions
6. Replace useState calls with useReducer
7. Update all state updates to dispatch actions
8. Ensure derived state calculated from reducer state
9. Add TypeScript types for state and actions
10. Test thoroughly to ensure behavior unchanged
11. Update tests to work with new state management
12. Document reducer logic

**Acceptance Criteria**:
- All state consolidated in reducer
- Action types defined and typed
- Reducer handles all state transitions
- Component logic simplified
- Functionality unchanged
- Tests updated and passing
- Performance same or better
- Code more maintainable

---

## Phase 8: Accessibility & Polish (Week 9-10)

### Issue #46: Add ARIA Labels and Keyboard Navigation
**Priority**: MEDIUM
**Estimated LOC**: ~300 lines across multiple files

**Files to Edit**:
- `/src/components/account/` (all form components)
- `/src/components/checkout/CheckoutForm.tsx`
- `/src/components/shared/Modal.tsx` (if exists)
- `/src/components/story/StoryModal.tsx`
- `/src/components/shared/ConfirmDialog/ConfirmDialog.tsx`
- `/src/components/shared/Navbar/` (navigation)
- `/src/components/shop/ProductCard.tsx`
- `/src/components/blog/BlogPostClient.tsx`

**Reason**:
Missing ARIA labels on forms, modals, and interactive elements. Some elements not keyboard accessible.

**How to Implement**:
1. **Forms**: Add aria-invalid, aria-describedby for error messages, aria-required
2. **Modals**: Add role="dialog", aria-modal="true", aria-labelledby, aria-describedby
3. **Loading states**: Add aria-live="polite", aria-busy="true"
4. **Buttons**: Add aria-label for icon-only buttons
5. **Interactive elements**: Ensure tab navigation works, add onKeyDown handlers
6. **Focus management**: Focus trap in modals, restore focus on close
7. **Product cards**: Add proper labels for actions
8. **Pagination**: Add aria-current="page", aria-label="Page X"
9. **Search**: Add aria-label, aria-expanded for dropdowns
10. **Tags**: Make keyboard navigable (onKeyDown)
11. Test with screen reader (NVDA or VoiceOver)
12. Test keyboard-only navigation
13. Run aXe DevTools for accessibility audit

**Acceptance Criteria**:
- All forms have proper ARIA labels
- Modals have role and labels
- Loading states announced
- All interactive elements keyboard accessible
- Focus management working
- Screen reader friendly
- aXe audit passes
- Keyboard navigation smooth

---

### Issue #47: Standardize Error Handling Pattern
**Priority**: MEDIUM
**Estimated LOC**: ~250 lines across multiple files

**Files to Edit**:
- `/src/contexts/CartContext.tsx` (lines 66-69, others)
- All files with inconsistent error handling (identified in audit)
- Create error handling utility if needed

**Files to Create**:
- `/src/utils/errorHandler.ts` (optional: centralized error handling)

**Reason**:
Error handling is inconsistent - some use StandardErrorResponse, others use custom type guards.

**How to Implement**:
1. Audit all catch blocks across codebase
2. Standardize on pattern: `const standardError = error as StandardErrorResponse;`
3. Update CartContext error handling (lines 66-69)
4. Update all service error handling
5. Update all component error handling
6. Optionally create utility: `handleError(error: unknown): StandardErrorResponse`
7. Ensure all error messages are Persian
8. Ensure all errors use toast.error or appropriate UI
9. Document error handling pattern in CLAUDE.md
10. Add examples to docs
11. Update tests to match new pattern

**Acceptance Criteria**:
- All catch blocks use StandardErrorResponse
- Error handling consistent across codebase
- All error messages in Persian
- Utility function if created
- Documentation updated
- Tests updated
- No functionality broken

---

## Summary Statistics

| Phase | Issues | Estimated LOC | Priority | Weeks |
|-------|--------|---------------|----------|-------|
| Phase 1: Security | 6 | ~530 | Critical/High | 1-2 |
| Phase 2: Barrel Exports | 11 | ~335 | High | 1 |
| Phase 3: Type Safety | 7 | ~1,450 | High/Medium | 1-2 |
| Phase 4: Component Tests | 7 | ~2,300 | Critical/High | 2 |
| Phase 5: Service Tests | 7 | ~1,550 | High/Medium | 1 |
| Phase 6: E2E Tests | 3 | ~800 | High/Medium | 1 |
| Phase 7: Performance | 4 | ~800 | High/Medium | 1-2 |
| Phase 8: Accessibility | 2 | ~550 | Medium | 1 |
| **TOTAL** | **47** | **~8,315** | **Mixed** | **8-10** |

---

## Priority Order Recommendation

### Sprint 1 (Week 1-2): Production Critical
- Issue #1: Remove logs from API proxy
- Issue #2: Remove logs from API service
- Issue #4: Create middleware
- Issue #5: Implement XSS sanitization
- Issue #6: Environment variable for backend URL

### Sprint 2 (Week 2-3): Convention Compliance
- Issue #3: Logger utility
- Issues #7-17: Add all index.ts files (can be done in parallel or scripted)

### Sprint 3 (Week 3-4): Type Safety
- Issues #18-22: Fix `any` in canvas components (highest priority)
- Issues #23-24: Fix remaining `any` usage

### Sprint 4 (Week 4-5): Critical Component Tests
- Issue #25: StoryEditorV2 tests
- Issue #26: DrawingCanvas tests
- Issue #27: CheckoutPage tests

### Sprint 5 (Week 5-6): High Priority Component Tests
- Issue #28: LoginPage tests
- Issue #29: ProfileManagement tests
- Issue #30: CartPage tests
- Issue #31: Navbar tests

### Sprint 6 (Week 6-7): Service Tests
- Issues #32-38: All service tests

### Sprint 7 (Week 7-8): E2E Tests
- Issue #39: Story creation E2E
- Issue #40: Payment flow E2E
- Issue #41: Cart merge E2E

### Sprint 8 (Week 8-9): Performance
- Issue #42: Code split Fabric.js
- Issue #43: Optimize images
- Issue #44: Add React.memo
- Issue #45: Refactor StoryEditorV2 state

### Sprint 9 (Week 9-10): Polish
- Issue #46: ARIA labels and keyboard navigation
- Issue #47: Standardize error handling

---

## Notes

### Issue Dependencies
- Issue #3 (logger utility) should be completed before replacing console.logs elsewhere
- Issues #7-17 (index.ts files) can be done in parallel or automated with a script
- Type safety issues (#18-24) should be completed before or alongside component tests
- Component tests (#25-31) can be done in parallel by multiple developers
- Service tests (#32-38) can be done in parallel
- E2E tests (#39-41) require component tests to be complete
- Performance optimizations (#42-45) should come after tests are in place

### Automation Opportunities
- **Issues #7-17** can be automated with a script to generate index.ts files
- **Console.log removal** (#1, #2) can be partially automated with AST tools
- **Image optimization** (#43) can use automated tools (sharp, imagemin)
- **Bundle analysis** (#42) should use webpack-bundle-analyzer

### Testing Strategy
- Use MSW for all API mocking
- Mock contexts with hooks, not provider wrappers
- Keep tests co-located with components
- Target 90% coverage minimum
- Use Playwright for E2E tests (already configured)

### Code Review Checkpoints
- After Phase 1: Security review (no logs, middleware working, XSS protected)
- After Phase 3: Type safety review (no `any`, strict mode enabled)
- After Phase 5: Test coverage review (should be near 90%)
- After Phase 7: Performance review (Lighthouse scores, bundle analysis)
- After Phase 8: Accessibility audit (screen reader, keyboard, aXe)

---

## Success Criteria

### Overall Goals
- ✅ Zero production console.logs
- ✅ Server-side route protection implemented
- ✅ XSS protection on all CMS content
- ✅ All component directories have index.ts
- ✅ Zero `any` types in codebase
- ✅ 90%+ test coverage
- ✅ All critical components tested
- ✅ All services tested
- ✅ Critical E2E flows tested
- ✅ Fabric.js code-split
- ✅ Images optimized
- ✅ ARIA labels complete
- ✅ Keyboard navigation working
- ✅ Error handling standardized

### Measurable Metrics
- **Test Coverage**: 15% → 90%+
- **TypeScript `any`**: 16 files → 0 files
- **Console Logs**: 264 → 0 (production)
- **Bundle Size**: Reduce by ~500KB (Fabric.js split)
- **Image Size**: Reduce public folder by 50%+ (18MB → <9MB)
- **Lighthouse Performance**: Target 90+ score
- **aXe Accessibility**: Zero violations

---

**End of Implementation Plan**
